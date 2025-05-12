/**
 * Validates a token and returns user information
 * @param token The authentication token
 * @returns User information object
 */
export function validateToken(token: string): {
  id: string | number;
  username: string;
} {
  // This is just a simple example implementation
  if (token === "valid-token" || token.includes("-")) {
    // Accept "valid-token" or socket IDs (which contain hyphens)
    return {
      id: token === "valid-token" ? 1 : token,
      username:
        token === "valid-token" ? "testuser" : `user-${token.substring(0, 6)}`,
    };
  }
  throw new Error("Invalid token");
}
