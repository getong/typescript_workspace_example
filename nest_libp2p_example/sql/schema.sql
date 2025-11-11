-- Schema definitions for libp2p dial logging

CREATE TABLE IF NOT EXISTS dial_requests (
  id SERIAL PRIMARY KEY,
  multiaddr VARCHAR(512) NOT NULL,
  peer_id VARCHAR(128),
  dial_target VARCHAR(512) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dial_requests_created_at_idx
  ON dial_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS node_join_logs (
  id SERIAL PRIMARY KEY,
  node_name VARCHAR(128) NOT NULL,
  remote_multiaddr VARCHAR(512) NOT NULL,
  peer_id VARCHAR(128),
  ip VARCHAR(128),
  port INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS node_join_logs_created_at_idx
  ON node_join_logs (created_at DESC);
