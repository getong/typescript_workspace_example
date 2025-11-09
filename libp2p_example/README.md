# libp2p_example

This project boots a minimal [libp2p](https://www.npmjs.com/package/libp2p) node using Bun.

## Install dependencies

```bash
bun install
```

## Run the libp2p node

```bash
bun run start
```

You can also invoke the entry file directly with `bun run index.ts`.

The script prints the generated Peer ID along with every listen address. Use `Ctrl+C` to stop the node, or provide `LIBP2P_SHUTDOWN_MS` to have it exit automatically:

```bash
LIBP2P_SHUTDOWN_MS=5000 bun run index.ts
```

### Configure client dialing via `.env`

Bun automatically loads variables from `.env`. Leave `LIBP2P_REMOTE_MULTIADDR` and `LIBP2P_REMOTE_PEER_ID` empty (the default) to have the built-in client dial the server node started by this script. To connect to a different libp2p peer, copy its listen address (without `/p2p/<peerId>`) into `LIBP2P_REMOTE_MULTIADDR` and the Peer ID into `LIBP2P_REMOTE_PEER_ID`:

```
LIBP2P_REMOTE_MULTIADDR=/ip4/127.0.0.1/tcp/51540
LIBP2P_REMOTE_PEER_ID=12D3KooWGQN7xmeSw679ANRcf4tXUWRsFWrEXCb8AuoAgWR4Ymj4
```

If `LIBP2P_REMOTE_MULTIADDR` already contains the `/p2p/<peerId>` suffix you can leave `LIBP2P_REMOTE_PEER_ID` empty.

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
