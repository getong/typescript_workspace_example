import { multiaddr, type Multiaddr } from "@multiformats/multiaddr";
import { createLibp2p, type Libp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { mplex } from "@libp2p/mplex";
import { noise } from "@chainsafe/libp2p-noise";

const createLibp2pBaseConfig = () => ({
  transports: [tcp()],
  streamMuxers: [mplex()],
  connectionEncrypters: [noise()],
});

const sanitizeDialAddress = (address: string): string => {
  if (address.includes("/ip4/0.0.0.0/")) {
    return address.replace("/ip4/0.0.0.0/", "/ip4/127.0.0.1/");
  }

  if (address.includes("/ip6/::/")) {
    return address.replace("/ip6/::/", "/ip6/::1/");
  }

  return address;
};

const isLoopbackAddress = (address: string): boolean =>
  address.includes("/ip4/127.0.0.1/") || address.includes("/ip6/::1/");

const pickDialableAddress = (
  addresses: ReturnType<Libp2p["getMultiaddrs"]>,
): string | undefined => {
  if (addresses.length === 0) {
    return undefined;
  }

  const prioritized = addresses
    .map((addr) => sanitizeDialAddress(addr.toString()))
    .sort((a, b) => {
      const aIsLoopback = isLoopbackAddress(a);
      const bIsLoopback = isLoopbackAddress(b);
      if (aIsLoopback === bIsLoopback) {
        return 0;
      }

      return aIsLoopback ? -1 : 1;
    });

  return prioritized[0];
};

const getEnvDialAddress = (): string | undefined => {
  const value = process.env.LIBP2P_REMOTE_MULTIADDR;
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? sanitizeDialAddress(trimmed) : undefined;
};

const getEnvPeerId = (): string | undefined => {
  const value = process.env.LIBP2P_REMOTE_PEER_ID;
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const BASE58_BTC_REGEX =
  /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

const validatePeerIdFormat = (
  peerId: string,
  sourceDescription: string,
): string => {
  if (!BASE58_BTC_REGEX.test(peerId)) {
    throw new Error(
      `${sourceDescription} contains an invalid libp2p peer id (must be base58btc). Received "${peerId}"`,
    );
  }

  return peerId;
};

const extractPeerIdFromAddress = (address: string): string | undefined => {
  const segments = address.split("/").filter((segment) => segment.length > 0);
  const peerIndex = segments.findIndex((segment) => segment === "p2p");
  if (peerIndex === -1 || peerIndex + 1 >= segments.length) {
    return undefined;
  }

  return segments[peerIndex + 1];
};

const ensurePeerIdOnAddress = (
  baseAddress: string,
  peerId: string | undefined,
  sourceDescription: string,
): string => {
  const embeddedPeerId = extractPeerIdFromAddress(baseAddress);
  if (embeddedPeerId != null) {
    validatePeerIdFormat(
      embeddedPeerId,
      `${sourceDescription} (/p2p component)`,
    );
    return baseAddress;
  }

  if (peerId == null || peerId.length === 0) {
    throw new Error(
      `${sourceDescription} is missing a /p2p/<peerId> suffix and no peer id override was provided via LIBP2P_REMOTE_PEER_ID`,
    );
  }

  const sanitizedPeerId = validatePeerIdFormat(peerId, "LIBP2P_REMOTE_PEER_ID");

  return `${baseAddress}/p2p/${sanitizedPeerId}`;
};

const parseMultiaddrOrThrow = (address: string): Multiaddr => {
  try {
    return multiaddr(address);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse multiaddr "${address}". ${message}`);
  }
};

const connectClientToServer = async (
  nodesToShutdown: Libp2p[],
  dialTarget: string,
): Promise<Libp2p> => {
  const dialMultiaddr = parseMultiaddrOrThrow(dialTarget);
  const clientNode = await createLibp2p(createLibp2pBaseConfig());
  nodesToShutdown.push(clientNode);

  clientNode.addEventListener("peer:connect", (evt) => {
    console.log(`Client connected to peer ${evt.detail.toString()}`);
  });

  console.log(
    `libp2p client node ${clientNode.peerId.toString()} dialing ${dialMultiaddr.toString()}`,
  );

  await clientNode.dial(dialMultiaddr);

  return clientNode;
};

const resolveEnvDialTarget = (): string | undefined => {
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
    console.warn(
      `[libp2p] Ignoring LIBP2P_REMOTE_MULTIADDR value "${envDialAddress}": ${message}`,
    );
    return undefined;
  }
};

async function main() {
  const shutdownDelayMs =
    process.env.LIBP2P_SHUTDOWN_MS != null &&
    process.env.LIBP2P_SHUTDOWN_MS.length > 0
      ? Number(process.env.LIBP2P_SHUTDOWN_MS)
      : undefined;

  const node = await createLibp2p({
    ...createLibp2pBaseConfig(),
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
  });

  const nodesToShutdown: Libp2p[] = [node];

  node.addEventListener("peer:connect", (evt) => {
    console.log(`Connected to peer ${evt.detail.toString()}`);
  });

  console.log(`libp2p node started with peer id ${node.peerId.toString()}`);
  console.log("Listening on:");
  node.getMultiaddrs().forEach((addr) => {
    console.log(`  ${addr.toString()}`);
  });

  const envDialTarget = resolveEnvDialTarget();

  const baseDialAddress =
    envDialTarget ?? pickDialableAddress(node.getMultiaddrs());

  if (baseDialAddress == null) {
    throw new Error(
      "Unable to determine a dialable multiaddr for the server node",
    );
  }

  const targetDialAddress =
    envDialTarget ??
    ensurePeerIdOnAddress(
      baseDialAddress,
      node.peerId.toString(),
      "Server listen address",
    );

  if (envDialTarget != null) {
    console.log(`Dial target loaded from .env: ${targetDialAddress}`);
  }

  const clientNode = await connectClientToServer(
    nodesToShutdown,
    targetDialAddress,
  );

  console.log(
    `libp2p client node started with peer id ${clientNode.peerId.toString()}`,
  );

  const shutdown = async () => {
    for (const libp2pNode of nodesToShutdown) {
      if (libp2pNode.status === "started") {
        console.log(`Stopping libp2p node ${libp2pNode.peerId.toString()}...`);
        await libp2pNode.stop();
        console.log(`libp2p node ${libp2pNode.peerId.toString()} stopped`);
      }
    }

    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });
  process.on("SIGTERM", () => {
    void shutdown();
  });

  if (
    shutdownDelayMs != null &&
    Number.isFinite(shutdownDelayMs) &&
    shutdownDelayMs > 0
  ) {
    setTimeout(() => {
      console.log(
        `Auto shutdown triggered after ${shutdownDelayMs}ms (LIBP2P_SHUTDOWN_MS)`,
      );
      void shutdown();
    }, shutdownDelayMs);
  }
}

main().catch((err) => {
  console.error("Encountered an error while running libp2p:", err);
  process.exit(1);
});
