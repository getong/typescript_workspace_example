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
- `REDIS_URL` – optional connection string overriding the host/port/password
  values below.
- `REDIS_HOST` / `REDIS_PORT` – Redis host and port to connect to
  (`127.0.0.1:6379` by default).
- `REDIS_USERNAME` – ACL username the Redis client should authenticate as
  (`nestapp` in `.env-example`, matching the Dockerfile below).
- `REDIS_PASSWORD` / `REDIS_DB` – credentials and db index passed to the Redis
  client.
- `POSTGRES_HOST` / `POSTGRES_PORT` – Postgres host and port that TypeORM uses
  (`127.0.0.1:5432` by default).
- `POSTGRES_USER` / `POSTGRES_PASSWORD` – credentials that the Nest app uses
  for the TypeORM connection (`nestapp` / `supersecret` in `.env-example`).
- `POSTGRES_DB` – database that stores the `dial_requests` table
  (`nestlibp2p` by default).
- `POSTGRES_SYNCHRONIZE` – set to `false` in production if you prefer running
  migrations manually (defaults to `true`).
- `POSTGRES_LOGGING` – set to `true` to have TypeORM log SQL statements.
- `POSTGRES_SQL_FILE` – optional path to a `.sql` file that should be executed
  automatically on startup (defaults to `./sql/schema.sql`).

### Redis integration

The server caches libp2p peer summaries and health snapshots inside Redis.
This enables the new `/peers/cached` endpoint and enriches `/health` responses
with the last cached data even if libp2p is restarting. Point the Redis client
at your preferred instance via the environment variables above. For quick
local testing you can build and run the provided Redis image (credentials match
`.env-example`):

```bash
docker build -f Dockerfile.redis \
  -t nest-libp2p-redis \
  --build-arg REDIS_USERNAME="${REDIS_USERNAME:-nestapp}" \
  --build-arg REDIS_PASSWORD="${REDIS_PASSWORD:-supersecret}" \
  .

docker run -it --rm --name nest-redis -p 6379:6379 nest-libp2p-redis
```

If you need different credentials, pass new `--build-arg` values *and* update
the corresponding `REDIS_USERNAME` / `REDIS_PASSWORD` variables in your `.env`
file so the Nest app and Redis container stay in sync.

### Postgres + TypeORM

TypeORM is configured globally through `DatabaseModule`, so any Nest feature can
call `TypeOrmModule.forFeature` to register entities. The `PeersController`
stores every dial request inside a Postgres `dial_requests` table and exposes a
`GET /peers/dials` endpoint so you can inspect recent history when debugging
connectivity issues. The libp2p server also writes an entry to the
`node_join_logs` table each time an inbound connection succeeds, persisting the
timestamp, remote IP/port and peer id.

During bootstrap the server automatically reads `sql/schema.sql` (or the path
defined via `POSTGRES_SQL_FILE`) and executes every statement it contains. Use
this file to define tables, indexes, or seed data that need to exist before the
Nest modules start handling requests.

Build and run the accompanying Postgres image (matching `.env-example` defaults)
when you need a local database:

```bash
docker build -f Dockerfile.postgres \
  -t nest-libp2p-postgres \
  --build-arg POSTGRES_DB="${POSTGRES_DB:-nestlibp2p}" \
  --build-arg POSTGRES_USER="${POSTGRES_USER:-nestapp}" \
  --build-arg POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-supersecret}" \
  .

docker run -it --rm --name nest-postgres -p 5432:5432 nest-libp2p-postgres
```

Update the Postgres variables in your `.env` file if you choose different
credentials or ports so the Nest app and database stay in sync.

#### Helper script

Instead of running the commands manually, you can rebuild and launch both the
Redis and Postgres containers in one step:

```bash
./scripts/start-databases.sh
```

The script loads `.env` (when present) so the Docker build arguments and port
bindings stay aligned with your local configuration.
By default it disables Docker BuildKit (`DOCKER_BUILDKIT=0`) so it can run in
environments where pulling the `docker/dockerfile` frontend is blocked; override
this by exporting `DOCKER_BUILDKIT=1` before running the script if needed.
If `.env` is missing the script automatically copies `.env-example` so the Nest
app and containers share the same credentials.

## REST endpoints

- `GET /peers` – returns the libp2p lifecycle status, listen addresses, and
  current connections for both the server and the bundled client node.
- `GET /peers/cached` – returns the latest cached summary stored in Redis plus
  the timestamp it was recorded.
- `GET /peers/dials` – returns recent libp2p dial attempts stored in Postgres.
- `POST /peers/dial` – body `{ "multiaddr": "...", "peerId": "..." }` to
  instruct the client node to dial an additional peer.
- `GET /health` – lightweight readiness data enriched with the most recent
  cached summary and the previously recorded health snapshot from Redis.

The libp2p service keeps the original Bun example behavior (dial target
resolution, auto-shutdown handling, event logging) while making it accessible
from standard Nest modules and controllers.
