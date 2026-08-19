import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return Buffer.from(key, 'hex');
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function shouldEncrypt(): boolean {
  return isProduction() && !!process.env.ENCRYPTION_KEY;
}

export interface EncryptedPayload {
  iv: string;
  tag: string;
  data: string;
}

export function encrypt(plaintext: string): EncryptedPayload {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted,
  };
}

export function decrypt(payload: EncryptedPayload): string {
  const key = getKey();
  const iv = Buffer.from(payload.iv, 'hex');
  const tag = Buffer.from(payload.tag, 'hex');
  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(payload.data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function wrapResponse(data: unknown): unknown {
  if (!shouldEncrypt()) {
    return data;
  }
  const json = JSON.stringify(data);
  const encrypted = encrypt(json);
  return { __encrypted: true, ...encrypted };
}

export function unwrapResponse(body: unknown): unknown {
  if (
    body &&
    typeof body === 'object' &&
    '__encrypted' in (body as Record<string, unknown>)
  ) {
    const payload = body as EncryptedPayload & { __encrypted: boolean };
    const json = decrypt({ iv: payload.iv, tag: payload.tag, data: payload.data });
    return JSON.parse(json);
  }
  return body;
}
