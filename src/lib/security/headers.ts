export interface SecurityHeaders {
  key: string;
  value: string;
}

export const securityHeaders: SecurityHeaders[] = [
  // Prevent clickjacking attacks
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  
  // Prevent MIME type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  
  // Control referrer information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  },
  
  // Permissions Policy (formerly Feature Policy)
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', ')
  },
  
  // Prevent XSS attacks
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  
  // Strict Transport Security (HTTPS only)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  
  // Cross-Origin Resource Policy
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  },
  
  // Cross-Origin Opener Policy
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  
  // Cross-Origin Embedder Policy
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp'
  }
];

/**
 * Get security headers for Next.js configuration
 */
export const getSecurityHeaders = () => securityHeaders;

/**
 * Get security headers for API routes
 */
export const getAPISecurityHeaders = () => {
  const headers = new Headers();
  
  securityHeaders.forEach(({ key, value }) => {
    headers.set(key, value);
  });
  
  return headers;
};

/**
 * Apply security headers to a response
 */
export const applySecurityHeaders = (response: Response): Response => {
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  
  return response;
};

/**
 * Get CSP header value
 */
export const getCSPHeader = () => {
  return securityHeaders.find(header => header.key === 'Content-Security-Policy')?.value || '';
};

/**
 * Get nonce-based CSP for inline scripts
 */
export const getNonceCSP = (nonce: string) => {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
};
