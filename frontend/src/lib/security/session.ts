import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

export interface SessionConfig {
  maxAge: number; // Session timeout in milliseconds
  maxConcurrentSessions: number; // Maximum concurrent sessions per user
  deviceFingerprinting: boolean; // Enable device fingerprinting
  activityTimeout: number; // Activity timeout in milliseconds
}

export interface SessionInfo {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  deviceFingerprint: string;
  lastActivity: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
}

export class SessionManager {
  private config: Required<SessionConfig>;
  private sessions = new Map<string, SessionInfo>();

  constructor(config: Partial<SessionConfig> = {}) {
    this.config = {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxConcurrentSessions: 3,
      deviceFingerprinting: true,
      activityTimeout: 30 * 60 * 1000, // 30 minutes
      ...config
    };
  }

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    userAgent: string,
    ipAddress: string,
    deviceFingerprint?: string
  ): Promise<SessionInfo> {
    // Check concurrent session limit
    const activeSessions = this.getActiveSessions(userId);
    if (activeSessions.length >= this.config.maxConcurrentSessions) {
      // Remove oldest session
      const oldestSession = activeSessions.sort((a, b) => 
        a.lastActivity.getTime() - b.lastActivity.getTime()
      )[0];
      if (oldestSession) {
        await this.removeSession(oldestSession.id);
      }
    }

    const session: SessionInfo = {
      id: this.generateSessionId(),
      userId,
      userAgent,
      ipAddress,
      deviceFingerprint: deviceFingerprint || this.generateDeviceFingerprint(userAgent),
      lastActivity: new Date(),
      createdAt: new Date(),
      isActive: true
    };

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Validate and update session
   */
  async validateSession(sessionId: string): Promise<SessionInfo | null> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive) {
      return null;
    }

    // Check session timeout
    if (Date.now() - session.createdAt.getTime() > this.config.maxAge) {
      await this.removeSession(sessionId);
      return null;
    }

    // Check activity timeout
    if (Date.now() - session.lastActivity.getTime() > this.config.activityTimeout) {
      await this.removeSession(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * Remove session
   */
  async removeSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  /**
   * Remove all sessions for a user
   */
  async removeUserSessions(userId: string): Promise<void> {
    const userSessions = Array.from(this.sessions.values())
      .filter(session => session.userId === userId);
    
    userSessions.forEach(session => {
      this.sessions.delete(session.id);
    });
  }

  /**
   * Get active sessions for a user
   */
  getActiveSessions(userId: string): SessionInfo[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId && session.isActive);
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    const expiredSessions = Array.from(this.sessions.values())
      .filter(session => 
        now - session.createdAt.getTime() > this.config.maxAge ||
        now - session.lastActivity.getTime() > this.config.activityTimeout
      );

    expiredSessions.forEach(session => {
      this.sessions.delete(session.id);
    });
  }

  /**
   * Generate device fingerprint
   */
  private generateDeviceFingerprint(userAgent: string): string {
    // Simple fingerprinting - in production, use more sophisticated methods
    const hash = userAgent
      .split('')
      .reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  /**
   * Get session statistics
   */
  getStats() {
    const totalSessions = this.sessions.size;
    const activeSessions = Array.from(this.sessions.values())
      .filter(session => session.isActive).length;
    
    return {
      total: totalSessions,
      active: activeSessions,
      expired: totalSessions - activeSessions
    };
  }
}

// Enhanced NextAuth configuration with session security
export const enhancedAuthOptions = {
  ...authOptions,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    ...authOptions.callbacks,
    async jwt({ token, user, account }: any) {
      if (user) {
        token.lastActivity = Date.now();
        token.deviceFingerprint = token.deviceFingerprint || 'default';
        token.sessionId = token.sessionId || `session_${Date.now()}`;
      }

      // Check session timeout
      if (token.lastActivity && Date.now() - token.lastActivity > 24 * 60 * 60 * 1000) {
        throw new Error('Session expired');
      }

      // Update last activity
      token.lastActivity = Date.now();
      
      return token;
    },
    async session({ session, token }: any) {
      // Add security information to session
      session.lastActivity = token.lastActivity;
      session.deviceFingerprint = token.deviceFingerprint;
      session.sessionId = token.sessionId;
      
      return session;
    }
  },
  events: {
    async signIn({ user, account, profile, isNewUser }: any) {
      // Log successful sign-in
      console.log(`User ${user.email} signed in successfully`);
    },
    async signOut({ session, token }: any) {
      // Log sign-out
      console.log(`User ${session?.user?.email} signed out`);
    },
    async session({ session, token }: any) {
      // Validate session on each request
      if (token.lastActivity && Date.now() - token.lastActivity > 30 * 60 * 1000) {
        throw new Error('Session inactive for too long');
      }
    }
  }
};

// Session middleware for API routes
export const sessionMiddleware = async (req: any, res: any, next: any) => {
  try {
    const session = await getServerSession(enhancedAuthOptions);
    
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      });
    }

    // Check session activity
    if (session.lastActivity && Date.now() - session.lastActivity > 30 * 60 * 1000) {
      return res.status(401).json({
        error: 'Session expired',
        code: 'SESSION_EXPIRED'
      });
    }

    // Add session to request
    req.session = session;
    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'SESSION_ERROR'
    });
  }
};

// Device fingerprinting utility
export const generateClientFingerprint = (): DeviceFingerprint => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      screenResolution: '',
      timezone: '',
      language: '',
      platform: '',
      cookieEnabled: false,
      doNotTrack: false
    };
  }

  return {
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1'
  };
};

// Export default session manager
export const sessionManager = new SessionManager();
