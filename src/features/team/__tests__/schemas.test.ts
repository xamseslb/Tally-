import { createUserSchema } from '../model/schemas';

const base = {
  fullName: 'Ahmed Ali',
  username: 'ahmed',
  password: 'pass123',
  role: 'worker' as const,
};

describe('createUserSchema', () => {
  it('accepts a valid user', () => {
    expect(createUserSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a short username', () => {
    expect(createUserSchema.safeParse({ ...base, username: 'ah' }).success).toBe(false);
  });

  it('rejects invalid username characters', () => {
    expect(createUserSchema.safeParse({ ...base, username: 'ah med!' }).success).toBe(false);
  });

  it('rejects a short password', () => {
    expect(createUserSchema.safeParse({ ...base, password: '123' }).success).toBe(false);
  });

  it('rejects an unknown role', () => {
    expect(createUserSchema.safeParse({ ...base, role: 'boss' }).success).toBe(false);
  });
});
