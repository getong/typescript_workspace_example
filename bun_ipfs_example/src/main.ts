import { create } from "ipfs-http-client";

async function main() {
  try {
    // Connect to the local IPFS daemon
    const ipfs = create({
      host: "localhost",
      port: 5001,
      protocol: "http",
    });

    // Example: Add data to IPFS
    const data = "Hello, IPFS!";
    const { cid } = await ipfs.add(data);
    console.log("Added data with CID:", cid.toString());

    // Example: Retrieve data from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const content = new TextDecoder().decode(
      Uint8Array.from(chunks.flatMap((chunk) => [...chunk])),
    );
    console.log("Retrieved data:", content);

    // Handle node info with dedicated try-catch to deal with webrtc-direct error
    try {
      // Example: Get node info
      const nodeInfo = await ipfs.id();
      console.log("IPFS Node ID:", nodeInfo.id.toString());
    } catch (idError) {
      console.log(
        "Could not retrieve complete node info due to protocol error",
      );
      console.log("Error details:", idError.message);

      // Alternative way to get basic version info
      try {
        const version = await ipfs.version();
        console.log("IPFS Version:", version.version);
      } catch (versionError) {
        console.error("Failed to get version info:", versionError);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
