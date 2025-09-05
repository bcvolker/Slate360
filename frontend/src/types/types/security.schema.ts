import { z } from 'zod';

// Security Event schema
export const SecurityEventSchema = z.object({
  id: z.string().min(1, 'Security event ID is required'),
  userId: z.string().optional(), // Optional for system-wide events
  action: z.enum([
    'create', 'update', 'delete', 'login', 'logout', 'login_failed', 'password_change',
    'mfa_enabled', 'mfa_disabled', 'mfa_verification', 'mfa_failed', 'session_created',
    'session_expired', 'session_invalidated', 'permission_granted', 'permission_revoked',
    'file_upload', 'file_download', 'api_access', 'api_denied', 'data_export',
    'data_import', 'backup_created', 'restore_performed', 'admin_action', 'system_alert'
  ]),
  resource: z.string().min(1, 'Resource is required'),
  resourceId: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  category: z.enum([
    'authentication', 'authorization', 'data_access', 'data_modification',
    'system', 'file_operations', 'api_operations', 'session_management',
    'mfa_operations', 'admin_operations', 'security_events', 'other'
  ]).default('other'),
  outcome: z.enum(['success', 'failure', 'pending', 'blocked']).default('success'),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  location: z.object({
    country: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }).optional(),
  deviceInfo: z.object({
    deviceId: z.string().optional(),
    deviceType: z.enum(['desktop', 'mobile', 'tablet', 'unknown']).optional(),
    browser: z.string().optional(),
    os: z.string().optional(),
    fingerprint: z.string().optional(),
  }).optional(),
  metadata: z.record(z.any()).default({}),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  expiresAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
});

// MFA Method schema
export const MFAMethodSchema = z.object({
  id: z.string().min(1, 'MFA method ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['totp', 'sms', 'email', 'backup_codes', 'hardware_key']),
  name: z.string().min(1, 'MFA method name is required'),
  secret: z.string().optional(), // For TOTP
  phoneNumber: z.string().optional(), // For SMS
  email: z.string().email().optional(), // For email
  isEnabled: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  lastUsed: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  updatedAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  metadata: z.record(z.any()).default({}),
});

// MFA Session schema
export const MFASessionSchema = z.object({
  id: z.string().min(1, 'MFA session ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  methodId: z.string().min(1, 'MFA method ID is required'),
  isVerified: z.boolean().default(false),
  expiresAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.any()).default({}),
});

// MFA Backup Code schema
export const MFABackupCodeSchema = z.object({
  id: z.string().min(1, 'Backup code ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  code: z.string().min(8, 'Backup code must be at least 8 characters'),
  isUsed: z.boolean().default(false),
  usedAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  expiresAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val).optional(),
});

// Security Rule schema
export const SecurityRuleSchema = z.object({
  id: z.string().min(1, 'Security rule ID is required'),
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  type: z.enum([
    'rate_limit', 'ip_whitelist', 'ip_blacklist', 'user_agent_block',
    'geographic_restriction', 'time_restriction', 'permission_required',
    'mfa_required', 'session_timeout', 'password_policy', 'file_upload_restriction',
    'api_access_control', 'data_access_control', 'custom'
  ]),
  priority: z.number().min(1).max(100).default(50),
  isEnabled: z.boolean().default(true),
  isGlobal: z.boolean().default(false), // Applies to all users
  appliesTo: z.enum(['all', 'authenticated', 'unauthenticated', 'specific_roles', 'specific_users']).default('all'),
  targetRoles: z.array(z.string()).default([]),
  targetUsers: z.array(z.string()).default([]),
  conditions: z.object({
    // Rate limiting conditions
    maxRequests: z.number().min(1).optional(),
    timeWindow: z.number().min(1).optional(), // in seconds
    
    // IP conditions
    allowedIPs: z.array(z.string().ip()).default([]),
    blockedIPs: z.array(z.string().ip()).default([]),
    allowedCountries: z.array(z.string()).default([]),
    blockedCountries: z.array(z.string()).default([]),
    
    // Time conditions
    allowedHours: z.object({
      start: z.number().min(0).max(23).optional(),
      end: z.number().min(0).max(23).optional(),
    }).optional(),
    allowedDays: z.array(z.number().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]), // 0 = Sunday
    
    // User agent conditions
    blockedUserAgents: z.array(z.string()).default([]),
    allowedUserAgents: z.array(z.string()).default([]),
    
    // Resource conditions
    resources: z.array(z.string()).default([]),
    actions: z.array(z.string()).default([]),
    
    // Custom conditions
    customExpression: z.string().optional(),
  }).default({}),
  actions: z.object({
    // What happens when rule is triggered
    block: z.boolean().default(false),
    redirect: z.string().url().optional(),
    requireMFA: z.boolean().default(false),
    requirePermission: z.string().optional(),
    logEvent: z.boolean().default(true),
    notifyAdmin: z.boolean().default(false),
    customAction: z.string().optional(),
  }).default({}),
  metadata: z.record(z.any()).default({}),
  createdAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  updatedAt: z.date().or(z.string()).transform((val) => typeof val === 'string' ? new Date(val) : val),
  createdBy: z.string().optional(),
});

// Security Configuration schema
export const SecurityConfigSchema = z.object({
  csrf: z.object({
    secret: z.string().min(32, 'CSRF secret must be at least 32 characters'),
    enabled: z.boolean().default(true),
    cookieOptions: z.object({
      httpOnly: z.boolean().default(true),
      secure: z.boolean().default(true),
      sameSite: z.enum(['strict', 'lax', 'none']).default('strict'),
    }).default({}),
  }).default({}),
  headers: z.object({
    enabled: z.boolean().default(true),
    strictMode: z.boolean().default(false),
    customHeaders: z.record(z.string()).default({}),
  }).default({}),
  validation: z.object({
    enabled: z.boolean().default(true),
    sanitization: z.boolean().default(true),
    strictMode: z.boolean().default(false),
  }).default({}),
  rateLimit: z.object({
    enabled: z.boolean().default(true),
    strictMode: z.boolean().default(false),
    redisEnabled: z.boolean().default(false),
    defaultLimits: z.object({
      windowMs: z.number().min(1000).default(15 * 60 * 1000), // 15 minutes
      maxRequests: z.number().min(1).default(100),
    }).default({}),
  }).default({}),
  session: z.object({
    timeout: z.number().min(1000).default(24 * 60 * 60 * 1000), // 24 hours
    maxConcurrent: z.number().min(1).default(3),
    deviceFingerprinting: z.boolean().default(true),
    secureCookies: z.boolean().default(true),
  }).default({}),
  logging: z.object({
    enabled: z.boolean().default(true),
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    securityEvents: z.boolean().default(true),
    auditTrail: z.boolean().default(true),
    retentionDays: z.number().min(1).default(90),
  }).default({}),
  mfa: z.object({
    enabled: z.boolean().default(true),
    required: z.boolean().default(false),
    backupCodes: z.boolean().default(true),
    maxAttempts: z.number().min(1).default(3),
    lockoutDuration: z.number().min(1000).default(15 * 60 * 1000), // 15 minutes
  }).default({}),
  encryption: z.object({
    enabled: z.boolean().default(true),
    algorithm: z.string().default('aes-256-gcm'),
    keyRotation: z.boolean().default(false),
    keyRotationInterval: z.number().min(1).default(90), // days
  }).default({}),
  monitoring: z.object({
    enabled: z.boolean().default(true),
    realTime: z.boolean().default(true),
    alerting: z.boolean().default(true),
    thresholds: z.object({
      failedLogins: z.number().min(1).default(5),
      suspiciousActivity: z.number().min(1).default(10),
    }).default({}),
  }).default({}),
  fileUpload: z.object({
    enabled: z.boolean().default(true),
    maxFileSize: z.number().min(1).default(10 * 1024 * 1024), // 10MB
    malwareScanning: z.boolean().default(true),
    virusTotalEnabled: z.boolean().default(false),
    clamAVEnabled: z.boolean().default(false),
    allowedTypes: z.array(z.string()).default([]),
    blockedTypes: z.array(z.string()).default([]),
  }).default({}),
  errorHandling: z.object({
    enabled: z.boolean().default(true),
    sanitizeErrors: z.boolean().default(true),
    logAllErrors: z.boolean().default(true),
    showDetails: z.boolean().default(false),
  }).default({}),
  apiSecurity: z.object({
    enabled: z.boolean().default(true),
    requireAuth: z.boolean().default(true),
    requireCSRF: z.boolean().default(true),
    rateLimit: z.boolean().default(true),
    validateInput: z.boolean().default(true),
  }).default({}),
});

// Inferred TypeScript types
export type SecurityEvent = z.infer<typeof SecurityEventSchema>;
export type MFAMethod = z.infer<typeof MFAMethodSchema>;
export type MFASession = z.infer<typeof MFASessionSchema>;
export type MFABackupCode = z.infer<typeof MFABackupCodeSchema>;
export type SecurityRule = z.infer<typeof SecurityRuleSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;

// Partial schemas for updates
export const SecurityEventUpdateSchema = SecurityEventSchema.partial().omit({ id: true, createdAt: true });
export const MFAMethodUpdateSchema = MFAMethodSchema.partial().omit({ id: true, createdAt: true });
export const SecurityRuleUpdateSchema = SecurityRuleSchema.partial().omit({ id: true, createdAt: true });

export type SecurityEventUpdate = z.infer<typeof SecurityEventUpdateSchema>;
export type MFAMethodUpdate = z.infer<typeof MFAMethodUpdateSchema>;
export type SecurityRuleUpdate = z.infer<typeof SecurityRuleUpdateSchema>;

// Create schemas (without id and timestamps)
export const SecurityEventCreateSchema = SecurityEventSchema.omit({ 
  id: true, 
  createdAt: true,
  expiresAt: true 
});
export const MFAMethodCreateSchema = MFAMethodSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const SecurityRuleCreateSchema = SecurityRuleSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type SecurityEventCreate = z.infer<typeof SecurityEventCreateSchema>;
export type MFAMethodCreate = z.infer<typeof MFAMethodCreateSchema>;
export type SecurityRuleCreate = z.infer<typeof SecurityRuleCreateSchema>;

// Validation functions
export const validateSecurityEvent = (data: unknown): SecurityEvent => {
  return SecurityEventSchema.parse(data);
};

export const validateMFAMethod = (data: unknown): MFAMethod => {
  return MFAMethodSchema.parse(data);
};

export const validateSecurityRule = (data: unknown): SecurityRule => {
  return SecurityRuleSchema.parse(data);
};

export const validateSecurityConfig = (data: unknown): SecurityConfig => {
  return SecurityConfigSchema.parse(data);
};
