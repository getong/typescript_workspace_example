import { describe, it, expect } from 'vitest';
import { validateToken } from '../../src/utils/token-validator';

describe('Token Validator', () => {
  it('should validate the default valid token', () => {
    const result = validateToken('valid-token');
    expect(result).toEqual({
      id: 1,
      username: 'testuser'
    });
  });

  it('should validate tokens containing hyphens (like socket IDs)', () => {
    const socketId = 'mock-socket-id-123';
    const result = validateToken(socketId);
    expect(result).toEqual({
      id: socketId,
      username: 'user-mock-s'
    });
  });

  it('should throw an error for invalid tokens', () => {
    expect(() => validateToken('invalid')).toThrow('Invalid token');
    expect(() => validateToken('')).toThrow('Invalid token');
  });
});
