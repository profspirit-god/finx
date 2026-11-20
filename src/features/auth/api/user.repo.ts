import { getDB } from '@/lib/db/idb';
import { generateSalt, hashSecret, verifySecret } from '@/lib/crypto/hash';
import { randomId } from '@/lib/crypto/random';
import type { User } from '@/types/user';
import type { SignupInput } from '../types';

const SINGLE_USER_KEY = 'primary';

export async function getUser(): Promise<User | null> {
  const db = await getDB();
  return (await db.get('users', SINGLE_USER_KEY)) ?? null;
}

export async function createUser(input: SignupInput): Promise<User> {
  const db = await getDB();
  const now = Date.now();
  const passwordSalt = generateSalt();
  const pinSalt = generateSalt();
  const [passwordHash, pinHash] = await Promise.all([
    hashSecret(input.password, passwordSalt),
    hashSecret(input.pin, pinSalt),
  ]);
  const user: User = {
    id: SINGLE_USER_KEY,
    displayName: input.displayName,
    passwordHash,
    passwordSalt,
    pinHash,
    pinSalt,
    createdAt: now,
    updatedAt: now,
  };
  await db.put('users', user);
  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return verifySecret(password, user.passwordSalt, user.passwordHash);
}

export async function verifyPin(user: User, pin: string): Promise<boolean> {
  return verifySecret(pin, user.pinSalt, user.pinHash);
}

export async function updatePin(user: User, newPin: string): Promise<User> {
  const db = await getDB();
  const pinSalt = generateSalt();
  const pinHash = await hashSecret(newPin, pinSalt);
  const updated: User = { ...user, pinSalt, pinHash, updatedAt: Date.now() };
  await db.put('users', updated);
  return updated;
}

export async function deleteUser(): Promise<void> {
  const db = await getDB();
  await db.delete('users', SINGLE_USER_KEY);
}