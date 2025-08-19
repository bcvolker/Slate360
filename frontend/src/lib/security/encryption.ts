import crypto from 'crypto';

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  iterations: number;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
  algorithm: string;
  keyLength: number;
  iterations: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
  keySize: number;
}

export class EncryptionManager {
  private config: Required<EncryptionConfig>;
  private masterKey: string;

  constructor(config: Partial<EncryptionConfig> = {}, masterKey?: string) {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      saltLength: 32,
      iterations: 100000,
      ...config
    };

    this.masterKey = masterKey || process.env.ENCRYPTION_MASTER_KEY || 'default-master-key-change-in-production';
  }

  /**
   * Generate a random encryption key
   */
  generateKey(): string {
    return crypto.randomBytes(this.config.keyLength).toString('hex');
  }

  /**
   * Generate a random IV (Initialization Vector)
   */
  generateIV(): string {
    return crypto.randomBytes(this.config.ivLength).toString('hex');
  }

  /**
   * Generate a random salt
   */
  generateSalt(): string {
    return crypto.randomBytes(this.config.saltLength).toString('hex');
  }

  /**
   * Derive a key from a password using PBKDF2
   */
  deriveKey(password: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      this.config.iterations,
      this.config.keyLength,
      'sha512'
    );
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  encrypt(data: string, key?: string): EncryptedData {
    const encryptionKey = key || this.masterKey;
    const salt = this.generateSalt();
    const iv = this.generateIV();
    
    // Derive key from password and salt
    const derivedKey = this.deriveKey(encryptionKey, salt);
    
    // Create cipher
    const cipher = crypto.createCipher(this.config.algorithm, derivedKey);
    cipher.setAAD(Buffer.from('slate360', 'utf8')); // Additional authenticated data
    
    // Encrypt data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted: encrypted + authTag.toString('hex'),
      iv,
      salt,
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength,
      iterations: this.config.iterations
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  decrypt(encryptedData: EncryptedData, key?: string): string {
    const decryptionKey = key || this.masterKey;
    
    // Derive key from password and salt
    const derivedKey = this.deriveKey(decryptionKey, encryptedData.salt);
    
    // Extract authentication tag (last 16 bytes)
    const authTag = Buffer.from(encryptedData.encrypted.slice(-32), 'hex');
    const encrypted = encryptedData.encrypted.slice(0, -32);
    
    // Create decipher
    const decipher = crypto.createDecipher(encryptedData.algorithm, derivedKey);
    decipher.setAAD(Buffer.from('slate360', 'utf8'));
    decipher.setAuthTag(authTag);
    
    // Decrypt data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Generate RSA key pair
   */
  generateRSAKeyPair(keySize: number = 2048): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return {
      publicKey,
      privateKey,
      algorithm: 'RSA',
      keySize
    };
  }

  /**
   * Encrypt data with RSA public key
   */
  encryptWithRSA(data: string, publicKey: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    
    return encrypted.toString('base64');
  }

  /**
   * Decrypt data with RSA private key
   */
  decryptWithRSA(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    
    return decrypted.toString('utf8');
  }

  /**
   * Generate digital signature
   */
  sign(data: string, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    
    return sign.sign(privateKey, 'base64');
  }

  /**
   * Verify digital signature
   */
  verify(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    
    return verify.verify(publicKey, signature, 'base64');
  }

  /**
   * Hash data with salt
   */
  hash(data: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || this.generateSalt();
    const hash = crypto.pbkdf2Sync(
      data,
      generatedSalt,
      this.config.iterations,
      this.config.keyLength,
      'sha512'
    ).toString('hex');
    
    return { hash, salt: generatedSalt };
  }

  /**
   * Verify hash
   */
  verifyHash(data: string, hash: string, salt: string): boolean {
    const { hash: computedHash } = this.hash(data, salt);
    return computedHash === hash;
  }

  /**
   * Generate secure random string
   */
  generateSecureString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate UUID v4
   */
  generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Encrypt sensitive fields in an object
   */
  encryptObject(obj: Record<string, any>, sensitiveFields: string[], key?: string): Record<string, any> {
    const encrypted = { ...obj };
    
    for (const field of sensitiveFields) {
      if (obj[field] && typeof obj[field] === 'string') {
        const encryptedData = this.encrypt(obj[field], key);
        encrypted[field] = encryptedData;
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt sensitive fields in an object
   */
  decryptObject(obj: Record<string, any>, sensitiveFields: string[], key?: string): Record<string, any> {
    const decrypted = { ...obj };
    
    for (const field of sensitiveFields) {
      if (obj[field] && typeof obj[field] === 'object' && 'encrypted' in obj[field]) {
        try {
          decrypted[field] = this.decrypt(obj[field] as EncryptedData, key);
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          decrypted[field] = '[ENCRYPTED]';
        }
      }
    }
    
    return decrypted;
  }

  /**
   * Get encryption statistics
   */
  getStats() {
    return {
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength,
      ivLength: this.config.ivLength,
      saltLength: this.config.saltLength,
      iterations: this.config.iterations,
      hasMasterKey: !!this.masterKey && this.masterKey !== 'default-master-key-change-in-production'
    };
  }
}

// Field-level encryption for specific data types
export class FieldEncryption {
  private encryptionManager: EncryptionManager;

  constructor(encryptionManager?: EncryptionManager) {
    this.encryptionManager = encryptionManager || new EncryptionManager();
  }

  /**
   * Encrypt user personal information
   */
  encryptUserData(userData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ssn', 'passportNumber', 'driversLicense', 'creditCard', 'bankAccount'];
    return this.encryptionManager.encryptObject(userData, sensitiveFields);
  }

  /**
   * Decrypt user personal information
   */
  decryptUserData(userData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ssn', 'passportNumber', 'driversLicense', 'creditCard', 'bankAccount'];
    return this.encryptionManager.decryptObject(userData, sensitiveFields);
  }

  /**
   * Encrypt project financial data
   */
  encryptProjectData(projectData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['budget', 'costs', 'financialNotes', 'clientPaymentInfo'];
    return this.encryptionManager.encryptObject(projectData, sensitiveFields);
  }

  /**
   * Decrypt project financial data
   */
  decryptProjectData(projectData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['budget', 'costs', 'financialNotes', 'clientPaymentInfo'];
    return this.encryptionManager.decryptObject(projectData, sensitiveFields);
  }

  /**
   * Encrypt audit log sensitive data
   */
  encryptAuditData(auditData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ipAddress', 'userAgent', 'requestBody', 'responseBody'];
    return this.encryptionManager.encryptObject(auditData, sensitiveFields);
  }

  /**
   * Decrypt audit log sensitive data
   */
  decryptAuditData(auditData: Record<string, any>): Record<string, any> {
    const sensitiveFields = ['ipAddress', 'userAgent', 'requestBody', 'responseBody'];
    return this.encryptionManager.decryptObject(auditData, sensitiveFields);
  }
}

// Export default instances
export const encryptionManager = new EncryptionManager();
export const fieldEncryption = new FieldEncryption(encryptionManager);

// Export convenience functions
export const encrypt = (data: string, key?: string) =>
  encryptionManager.encrypt(data, key);

export const decrypt = (encryptedData: EncryptedData, key?: string) =>
  encryptionManager.decrypt(encryptedData, key);

export const generateKey = () => encryptionManager.generateKey();
export const generateIV = () => encryptionManager.generateIV();
export const generateSalt = () => encryptionManager.generateSalt();
export const generateRSAKeyPair = (keySize?: number) => encryptionManager.generateRSAKeyPair(keySize);
export const hash = (data: string, salt?: string) => encryptionManager.hash(data, salt);
export const verifyHash = (data: string, hash: string, salt: string) => encryptionManager.verifyHash(data, hash, salt);
