import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { mplex } from "@libp2p/mplex";
import { noise } from "@chainsafe/libp2p-noise";

async function main() {
  const shutdownDelayMs =
    process.env.LIBP2P_SHUTDOWN_MS != null &&
    process.env.LIBP2P_SHUTDOWN_MS.length > 0
      ? Number(process.env.LIBP2P_SHUTDOWN_MS)
      : undefined;

  const node = await createLibp2p({
    transports: [tcp()],
    streamMuxers: [mplex()],
    connectionEncrypters: [noise()],
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0"],
    },
  });

  node.addEventListener("peer:connect", (evt) => {
    console.log(`Connected to peer ${evt.detail.remotePeer.toString()}`);
  });

  console.log(`libp2p node started with peer id ${node.peerId.toString()}`);
  console.log("Listening on:");
  node.getMultiaddrs().forEach((addr) => {
    console.log(`  ${addr.toString()}`);
  });

  const shutdown = async () => {
    if (node.status === "started") {
      console.log("Stopping libp2p node...");
      await node.stop();
      console.log("libp2p node stopped");
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
