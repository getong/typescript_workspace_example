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

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
