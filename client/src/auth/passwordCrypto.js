const HASH_ALGORITHM = 'PBKDF2-SHA256';
const PBKDF2_ITERATIONS = 210000;
const SALT_LENGTH_BYTES = 16;
const HASH_LENGTH_BITS = 256;

const encoder = new TextEncoder();

const bytesToBase64 = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCodePoint(byte);
  });
  return globalThis.btoa(binary);
};

const base64ToBytes = (base64) => {
  const binary = globalThis.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.codePointAt(index) ?? 0;
  }
  return bytes;
};

const timingSafeEqual = (leftBytes, rightBytes) => {
  if (leftBytes.length !== rightBytes.length) return false;

  let mismatch = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    mismatch |= leftBytes[index] ^ rightBytes[index];
  }

  return mismatch === 0;
};

const deriveHashBytes = async ({ password, saltBytes, iterations }) => {
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    HASH_LENGTH_BITS
  );

  return new Uint8Array(bits);
};

export const hashPassword = async (password) => {
  const saltBytes = globalThis.crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
  const hashBytes = await deriveHashBytes({
    password,
    saltBytes,
    iterations: PBKDF2_ITERATIONS,
  });

  return {
    algorithm: HASH_ALGORITHM,
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToBase64(saltBytes),
    hash: bytesToBase64(hashBytes),
  };
};

export const verifyPassword = async (password, passwordHash) => {
  if (!passwordHash?.salt || !passwordHash?.hash) return false;

  const iterations = Number(passwordHash.iterations) || PBKDF2_ITERATIONS;
  const saltBytes = base64ToBytes(passwordHash.salt);
  const expectedHashBytes = base64ToBytes(passwordHash.hash);

  const actualHashBytes = await deriveHashBytes({
    password,
    saltBytes,
    iterations,
  });

  return timingSafeEqual(actualHashBytes, expectedHashBytes);
};

