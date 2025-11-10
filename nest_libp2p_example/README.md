# nest_libp2p_example

This project combines the libp2p sample located in
`/Users/gerald/personal_infos/typescript_workspace_example/libp2p_example`
with a multi-module Nest server. The Nest application bootstraps a libp2p
server node plus an internal libp2p client and exposes their state through
HTTP endpoints.

```
src/
├── app.module.ts            # Root module wiring together features
├── diagnostics/             # /health readiness + status endpoint
├── libp2p/                  # libp2p helpers, service & module
├── peers/                   # /peers REST API for summaries & dialing
└── workers/                 # worker_thread logging demo + module wiring
```

## Install dependencies

```bash
bun install
```

## Run the server

```bash
bun run start
```

This script compiles the TypeScript sources into `dist/` and then launches the
Nest HTTP server via Node. You can run `bun run build` separately if you only
need to generate the compiled output.

### Worker thread logging demo

On bootstrap the `WorkersModule` spawns two `worker_threads` (`alpha` and
`beta`). Each worker uses the shared Winston logger (`src/logger.ts`) via
`createContextLogger`, so every log line contains the worker name, thread id,
and PID metadata. Logs are emitted to both the console and `logs/app.log`, so
you can start the server and watch for entries similar to:

```
2024-01-01T00:00:00.000Z [pid:12345] info: [Worker:alpha] Worker alpha tick 1
```

Adjust `GROUPS` in `src/workers/worker-manager.service.ts` to experiment with
additional worker groups or different logging cadences.

### Environment loading

`.env` files are automatically loaded following this priority:

1. Path defined via `NEST_LIBP2P_ENV_FILE`
2. `./.env` inside this project
3. `../libp2p_example/.env` (the original sample)

This preserves the behavior of the Bun sample—dropping a `.env` file with
`LIBP2P_REMOTE_MULTIADDR` and `LIBP2P_REMOTE_PEER_ID` will make the embedded
client dial the specified peer automatically. The repository ships with a
checked-in `.env` that sets `HTTP_PORT=4100` so the Nest server avoids
conflicting with other services that may already bind port 3000. Feel free to
edit that value (or override via `NEST_LIBP2P_ENV_FILE`) to suit your local
environment.

Environment variables:

- `HTTP_HOST` / `HTTP_PORT` – override the Nest HTTP listener (defaults to
  `0.0.0.0:3000`).
- `LIBP2P_LISTEN_MULTIADDR` – optional multiaddr for the embedded libp2p server
  transport (defaults to `/ip4/127.0.0.1/tcp/0`).
- `NEST_LIBP2P_ENV_FILE` – optional override to point at a specific `.env`
  file when you want to load configuration from another location.
- `LIBP2P_REMOTE_MULTIADDR` – optional remote multiaddr to dial instead of the
  automatically selected server address.
- `LIBP2P_REMOTE_PEER_ID` – optional peer id used when the remote multiaddr
  does not include `/p2p/<peerId>`.
- `LIBP2P_SHUTDOWN_MS` – optionally auto-stop libp2p nodes after the specified
  number of milliseconds.

## REST endpoints

- `GET /peers` – returns the libp2p lifecycle status, listen addresses, and
  current connections for both the server and the bundled client node.
- `POST /peers/dial` – body `{ "multiaddr": "...", "peerId": "..." }` to
  instruct the client node to dial an additional peer.
- `GET /health` – lightweight readiness and diagnostic information suitable
  for probes or dashboards.

The libp2p service keeps the original Bun example behavior (dial target
resolution, auto-shutdown handling, event logging) while making it accessible
from standard Nest modules and controllers.
