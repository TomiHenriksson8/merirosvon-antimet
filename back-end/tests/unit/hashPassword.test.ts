import { hashPassword } from '../../src/utils/hashPassword';

describe('hashPassword', () => {
    it('should hash a password correctly', async () => {
      const plainTextPassword = 'password123';
      const hashedPassword = await hashPassword(plainTextPassword);
      expect(hashedPassword).not.toBe(plainTextPassword);
      expect(hashedPassword).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });