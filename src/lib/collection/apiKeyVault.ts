
import crypto from 'crypto';

/**
 * @fileOverview Secure AES-256-GCM encryption for user API keys.
 * Uses an environment-level master key to protect third-party credentials.
 */

const ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.COLLECTION_ENCRYPTION_KEY || 'default-dev-key-32-chars-length!!!'; // Must be 32 bytes

export function encryptApiKey(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(MASTER_KEY), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    content: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag
  };
}

export function decryptApiKey(encrypted: { content: string, iv: string, authTag: string }) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(MASTER_KEY), 
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
