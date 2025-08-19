import crypto from 'crypto';
import { authenticator } from 'otplib';

export interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'email';
  name: string;
  secret?: string;
  phoneNumber?: string;
  email?: string;
  isEnabled: boolean;
  isVerified: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

export interface MFASession {
  id: string;
  userId: string;
  methodId: string;
  isVerified: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface MFABackupCode {
  id: string;
  userId: string;
  code: string;
  isUsed: boolean;
  usedAt?: Date;
  createdAt: Date;
}

export class MFAManager {
  private mfaMethods = new Map<string, MFAMethod>();
  private mfaSessions = new Map<string, MFASession>();
  private backupCodes = new Map<string, MFABackupCode>();

  /**
   * Generate TOTP secret for a user
   */
  generateTOTPSecret(userId: string, methodName: string): { secret: string; qrCode: string } {
    const secret = authenticator.generateSecret();
    const appName = 'Slate360';
    const qrCode = authenticator.keyuri(userId, appName, secret);
    
    return { secret, qrCode };
  }

  /**
   * Verify TOTP token
   */
  verifyTOTPToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (error) {
      console.error('TOTP verification error:', error);
      return false;
    }
  }

  /**
   * Generate backup codes
   */
  generateBackupCodes(userId: string, count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const code = this.generateBackupCode();
      codes.push(code);
      
      // Store backup code
      const backupCode: MFABackupCode = {
        id: `backup_${Date.now()}_${i}`,
        userId,
        code: this.hashBackupCode(code),
        isUsed: false,
        createdAt: new Date()
      };
      
      this.backupCodes.set(backupCode.id, backupCode);
    }
    
    return codes;
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(userId: string, code: string): boolean {
    const hashedCode = this.hashBackupCode(code);
    
    for (const backupCode of this.backupCodes.values()) {
      if (backupCode.userId === userId && 
          backupCode.code === hashedCode && 
          !backupCode.isUsed) {
        
        // Mark as used
        backupCode.isUsed = true;
        backupCode.usedAt = new Date();
        this.backupCodes.set(backupCode.id, backupCode);
        
        return true;
      }
    }
    
    return false;
  }

  /**
   * Add MFA method
   */
  addMFAMethod(
    userId: string,
    type: MFAMethod['type'],
    name: string,
    secret?: string,
    phoneNumber?: string,
    email?: string
  ): MFAMethod {
    const method: MFAMethod = {
      id: `mfa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      name,
      secret,
      phoneNumber,
      email,
      isEnabled: false,
      isVerified: false,
      createdAt: new Date()
    };

    this.mfaMethods.set(method.id, method);
    return method;
  }

  /**
   * Enable MFA method
   */
  enableMFAMethod(methodId: string): boolean {
    const method = this.mfaMethods.get(methodId);
    if (!method) return false;

    method.isEnabled = true;
    this.mfaMethods.set(methodId, method);
    return true;
  }

  /**
   * Disable MFA method
   */
  disableMFAMethod(methodId: string): boolean {
    const method = this.mfaMethods.get(methodId);
    if (!method) return false;

    method.isEnabled = false;
    this.mfaMethods.set(methodId, method);
    return true;
  }

  /**
   * Verify MFA method
   */
  verifyMFAMethod(methodId: string): boolean {
    const method = this.mfaMethods.get(methodId);
    if (!method) return false;

    method.isVerified = true;
    this.mfaMethods.set(methodId, method);
    return true;
  }

  /**
   * Get MFA methods for user
   */
  getUserMFAMethods(userId: string): MFAMethod[] {
    return Array.from(this.mfaMethods.values())
      .filter(method => method.userId === userId);
  }

  /**
   * Check if user has MFA enabled
   */
  isMFAEnabled(userId: string): boolean {
    const methods = this.getUserMFAMethods(userId);
    return methods.some(method => method.isEnabled && method.isVerified);
  }

  /**
   * Create MFA session
   */
  createMFASession(userId: string, methodId: string): MFASession {
    const session: MFASession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      methodId,
      isVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date()
    };

    this.mfaSessions.set(session.id, session);
    return session;
  }

  /**
   * Verify MFA session
   */
  verifyMFASession(sessionId: string): boolean {
    const session = this.mfaSessions.get(sessionId);
    if (!session) return false;

    if (new Date() > session.expiresAt) {
      this.mfaSessions.delete(sessionId);
      return false;
    }

    session.isVerified = true;
    this.mfaSessions.set(sessionId, session);
    return true;
  }

  /**
   * Get MFA session
   */
  getMFASession(sessionId: string): MFASession | null {
    const session = this.mfaSessions.get(sessionId);
    if (!session) return null;

    if (new Date() > session.expiresAt) {
      this.mfaSessions.delete(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions(): void {
    const now = new Date();
    
    for (const [sessionId, session] of this.mfaSessions.entries()) {
      if (now > session.expiresAt) {
        this.mfaSessions.delete(sessionId);
      }
    }
  }

  /**
   * Generate backup code
   */
  private generateBackupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Hash backup code for storage
   */
  private hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Get MFA statistics
   */
  getStats() {
    const totalMethods = this.mfaMethods.size;
    const enabledMethods = Array.from(this.mfaMethods.values())
      .filter(method => method.isEnabled).length;
    const verifiedMethods = Array.from(this.mfaMethods.values())
      .filter(method => method.isVerified).length;
    const activeSessions = Array.from(this.mfaSessions.values())
      .filter(session => !session.isVerified && new Date() < session.expiresAt).length;
    const totalBackupCodes = this.backupCodes.size;
    const usedBackupCodes = Array.from(this.backupCodes.values())
      .filter(code => code.isUsed).length;

    return {
      totalMethods,
      enabledMethods,
      verifiedMethods,
      activeSessions,
      totalBackupCodes,
      usedBackupCodes
    };
  }
}

// MFA middleware for API routes
export const mfaMiddleware = async (req: any, res: any, next: any) => {
  try {
    const session = req.session;
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      });
    }

    // Check if MFA is required
    const mfaManager = new MFAManager();
    if (mfaManager.isMFAEnabled(session.user.id)) {
      // Check if MFA session is verified
      const mfaSessionId = req.headers['x-mfa-session'];
      if (!mfaSessionId) {
        return res.status(403).json({
          error: 'MFA session required',
          code: 'MFA_REQUIRED'
        });
      }

      const mfaSession = mfaManager.getMFASession(mfaSessionId);
      if (!mfaSession || !mfaSession.isVerified) {
        return res.status(403).json({
          error: 'MFA verification required',
          code: 'MFA_VERIFICATION_REQUIRED'
        });
      }
    }

    next();
  } catch (error) {
    console.error('MFA middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'MFA_ERROR'
    });
  }
};

// Export default MFA manager
export const mfaManager = new MFAManager();

// Export convenience functions
export const generateTOTPSecret = (userId: string, methodName: string) =>
  mfaManager.generateTOTPSecret(userId, methodName);

export const verifyTOTPToken = (secret: string, token: string) =>
  mfaManager.verifyTOTPToken(secret, token);

export const generateBackupCodes = (userId: string, count?: number) =>
  mfaManager.generateBackupCodes(userId, count);

export const verifyBackupCode = (userId: string, code: string) =>
  mfaManager.verifyBackupCode(userId, code);

export const isMFAEnabled = (userId: string) =>
  mfaManager.isMFAEnabled(userId);
