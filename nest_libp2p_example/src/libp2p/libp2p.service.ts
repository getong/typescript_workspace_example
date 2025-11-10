import { Injectable } from "@nestjs/common";
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createLibp2p, type Libp2p } from "libp2p";
import {
  createLibp2pBaseConfig,
  ensurePeerIdOnAddress,
  extractPeerIdFromAddress,
  getEnvDialAddress,
  getEnvPeerId,
  parseMultiaddrOrThrow,
  pickDialableAddress,
  sanitizeDialAddress,
} from "./libp2p.helpers.js";
import type {
  DialPeerRequest,
  DialPeerResponse,
  Libp2pLifecycleStatus,
  Libp2pSummary,
  PeerSummary,
} from "./libp2p.types.js";
import { createContextLogger } from "../logger.js";

@Injectable()
export class Libp2pService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createContextLogger(Libp2pService.name);
  private readonly nodes: Libp2p[] = [];
  private lifecycleStatus: Libp2pLifecycleStatus = "stopped";
  private serverNode?: Libp2p;
  private clientNode?: Libp2p;
  private dialTarget?: string;
  private lastError?: string;
  private autoShutdownTimer?: ReturnType<typeof setTimeout>;

  async onModuleInit(): Promise<void> {
    this.lifecycleStatus = "starting";
    try {
      await this.bootstrapNodes();
      this.lifecycleStatus = "ready";
      this.lastError = undefined;
    } catch (error) {
      this.lifecycleStatus = "error";
      this.lastError = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to bootstrap libp2p: ${this.lastError}`);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.shutdown();
  }

  getSummary(): Libp2pSummary {
    return {
      status: this.lifecycleStatus,
      dialTarget: this.dialTarget,
      lastError: this.lastError,
      server: this.serverNode ? this.describeNode(this.serverNode) : undefined,
      client: this.clientNode ? this.describeNode(this.clientNode) : undefined,
    };
  }

  async dialPeer(request: DialPeerRequest): Promise<DialPeerResponse> {
    if (this.clientNode == null) {
      throw new Error("Libp2p client node is not ready yet");
    }

    if (request.multiaddr == null || request.multiaddr.trim().length === 0) {
      throw new Error("multiaddr is required");
    }

    const sanitizedAddress = sanitizeDialAddress(request.multiaddr.trim());
    const target = ensurePeerIdOnAddress(
      sanitizedAddress,
      request.peerId,
      "Dial request",
    );
    const dialMultiaddr = parseMultiaddrOrThrow(target);

    await this.clientNode.dial(dialMultiaddr);
    this.dialTarget = target;

    return {
      dialTarget: target,
      resolvedPeerId:
        extractPeerIdFromAddress(target) ?? request.peerId ?? "unknown",
    };
  }

  private async bootstrapNodes(): Promise<void> {
    const listenAddress =
      process.env.LIBP2P_LISTEN_MULTIADDR ?? "/ip4/127.0.0.1/tcp/0";

    this.logger.info(`libp2p server listening on ${listenAddress}`);

    this.serverNode = await createLibp2p({
      ...createLibp2pBaseConfig(),
      addresses: {
        listen: [listenAddress],
      },
    });
    this.nodes.push(this.serverNode);

    this.serverNode.addEventListener("peer:connect", (evt) => {
      this.logger.info(`Server connected to peer ${evt.detail.toString()}`);
    });
    this.serverNode.addEventListener("peer:disconnect", (evt) => {
      this.logger.warn(
        `Server disconnected from peer ${evt.detail.toString()}`,
      );
    });

    this.logger.info(
      `libp2p server node started with peer id ${this.serverNode.peerId.toString()}`,
    );
    this.logListenAddresses(this.serverNode);

    const localDialAddress = pickDialableAddress(
      this.serverNode.getMultiaddrs(),
    );

    if (localDialAddress == null) {
      throw new Error(
        "Unable to determine a dialable multiaddr for the server node",
      );
    }

    const localDialTarget = ensurePeerIdOnAddress(
      localDialAddress,
      this.serverNode.peerId.toString(),
      "Server listen address",
    );

    const envDialTarget = this.resolveEnvDialTarget();
    let dialTarget = envDialTarget ?? localDialTarget;

    if (envDialTarget != null) {
      this.logger.info(`Dial target loaded from .env: ${envDialTarget}`);
    }

    try {
      this.clientNode = await this.connectClientToServer(dialTarget);
    } catch (error) {
      if (envDialTarget == null) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to dial remote libp2p target ${envDialTarget}: ${message}. Falling back to local server address ${localDialTarget}`,
      );
      dialTarget = localDialTarget;
      this.clientNode = await this.connectClientToServer(dialTarget);
    }

    this.dialTarget = dialTarget;
    this.nodes.push(this.clientNode);

    this.logger.info(
      `libp2p client node started with peer id ${this.clientNode.peerId.toString()}`,
    );

    this.scheduleAutoShutdown();
  }

  private resolveEnvDialTarget(): string | undefined {
    const envDialAddress = getEnvDialAddress();
    if (envDialAddress == null) {
      return undefined;
    }

    try {
      return ensurePeerIdOnAddress(
        envDialAddress,
        getEnvPeerId(),
        "LIBP2P_REMOTE_MULTIADDR",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `[libp2p] Ignoring LIBP2P_REMOTE_MULTIADDR value "${envDialAddress}": ${message}`,
      );
      return undefined;
    }
  }

  private async connectClientToServer(dialTarget: string): Promise<Libp2p> {
    const dialMultiaddr = parseMultiaddrOrThrow(dialTarget);
    const clientNode = await createLibp2p(createLibp2pBaseConfig());

    clientNode.addEventListener("peer:connect", (evt) => {
      this.logger.info(`Client connected to peer ${evt.detail.toString()}`);
    });
    clientNode.addEventListener("peer:disconnect", (evt) => {
      this.logger.warn(
        `Client disconnected from peer ${evt.detail.toString()}`,
      );
    });

    this.logger.info(
      `libp2p client node ${clientNode.peerId.toString()} dialing ${dialMultiaddr.toString()}`,
    );

    await clientNode.dial(dialMultiaddr);

    return clientNode;
  }

  private scheduleAutoShutdown(): void {
    const shutdownDelayMs = this.resolveShutdownDelay();
    if (
      shutdownDelayMs == null ||
      !Number.isFinite(shutdownDelayMs) ||
      shutdownDelayMs <= 0
    ) {
      return;
    }

    this.autoShutdownTimer = setTimeout(() => {
      this.logger.warn(
        `Auto shutdown triggered after ${shutdownDelayMs}ms (LIBP2P_SHUTDOWN_MS)`,
      );
      void this.shutdown();
    }, shutdownDelayMs);
    this.autoShutdownTimer.unref?.();
  }

  private resolveShutdownDelay(): number | undefined {
    const raw = process.env.LIBP2P_SHUTDOWN_MS;
    if (raw == null || raw.length === 0) {
      return undefined;
    }

    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  async shutdown(): Promise<void> {
    if (this.autoShutdownTimer) {
      clearTimeout(this.autoShutdownTimer);
      this.autoShutdownTimer = undefined;
    }

    for (const libp2pNode of this.nodes) {
      if (libp2pNode.status === "started") {
        this.logger.info(
          `Stopping libp2p node ${libp2pNode.peerId.toString()}...`,
        );
        await libp2pNode.stop();
        this.logger.info(`libp2p node ${libp2pNode.peerId.toString()} stopped`);
      }
    }

    this.lifecycleStatus = "stopped";
  }

  private logListenAddresses(node: Libp2p): void {
    this.logger.info("Listening on:");
    node.getMultiaddrs().forEach((addr) => {
      this.logger.info(`  ${addr.toString()}`);
    });
  }

  private describeNode(node: Libp2p): PeerSummary {
    return {
      peerId: node.peerId.toString(),
      status: node.status,
      addresses: node.getMultiaddrs().map((addr) => addr.toString()),
      connections: node.getConnections().map((connection) => ({
        remotePeer: connection.remotePeer.toString(),
        direction: connection.direction,
        streams: connection.streams.length,
      })),
    };
  }
}
