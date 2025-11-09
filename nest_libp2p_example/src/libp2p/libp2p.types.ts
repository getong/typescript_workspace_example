export type Libp2pLifecycleStatus = "stopped" | "starting" | "ready" | "error";

export interface ConnectionSummary {
  remotePeer: string;
  direction: string;
  streams: number;
}

export interface PeerSummary {
  peerId: string;
  status: string;
  addresses: string[];
  connections: ConnectionSummary[];
}

export interface Libp2pSummary {
  status: Libp2pLifecycleStatus;
  dialTarget?: string;
  lastError?: string;
  server?: PeerSummary;
  client?: PeerSummary;
}

export interface DialPeerRequest {
  multiaddr: string;
  peerId?: string;
}

export interface DialPeerResponse {
  dialTarget: string;
  resolvedPeerId: string;
}
