import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { tcp } from "@libp2p/tcp";
import { multiaddr, type Multiaddr } from "@multiformats/multiaddr";
import type { Libp2p } from "libp2p";

export const createLibp2pBaseConfig = () => ({
  transports: [tcp()],
  streamMuxers: [mplex()],
  connectionEncrypters: [noise()],
});

export const sanitizeDialAddress = (address: string): string => {
  if (address.includes("/ip4/0.0.0.0/")) {
    return address.replace("/ip4/0.0.0.0/", "/ip4/127.0.0.1/");
  }

  if (address.includes("/ip6/::/")) {
    return address.replace("/ip6/::/", "/ip6/::1/");
  }

  return address;
};

const LOOPBACK_IPV4 = "/ip4/127.0.0.1/";
const LOOPBACK_IPV6 = "/ip6/::1/";

const isLoopbackAddress = (address: string): boolean =>
  address.includes(LOOPBACK_IPV4) || address.includes(LOOPBACK_IPV6);

export const pickDialableAddress = (
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

export const getEnvDialAddress = (): string | undefined => {
  const value = process.env.LIBP2P_REMOTE_MULTIADDR;
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? sanitizeDialAddress(trimmed) : undefined;
};

export const getEnvPeerId = (): string | undefined => {
  const value = process.env.LIBP2P_REMOTE_PEER_ID;
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const BASE58_BTC_REGEX =
  /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

export const validatePeerIdFormat = (
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

export const extractPeerIdFromAddress = (
  address: string,
): string | undefined => {
  const segments = address.split("/").filter((segment) => segment.length > 0);
  const peerIndex = segments.findIndex((segment) => segment === "p2p");
  if (peerIndex === -1 || peerIndex + 1 >= segments.length) {
    return undefined;
  }

  return segments[peerIndex + 1];
};

export const ensurePeerIdOnAddress = (
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

  const sanitizedPeerId = validatePeerIdFormat(peerId, sourceDescription);

  return `${baseAddress}/p2p/${sanitizedPeerId}`;
};

export const parseMultiaddrOrThrow = (address: string): Multiaddr => {
  try {
    return multiaddr(address);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse multiaddr "${address}". ${message}`);
  }
};
