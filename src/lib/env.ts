export function validateEnv() {
  const required = [
    'CSRF_SECRET',
    'ENCRYPTION_MASTER_KEY', 
    'AWS_S3_BUCKET',
    'AWS_S3_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'MONGODB_URI',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file and ensure all required variables are set.');
    
    // In production, exit with error code
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('Continuing in development mode with missing environment variables...');
    }
  }
}

// Optional: Validate specific environment variables for specific features
export function validateFeatureEnv(feature: string) {
  const featureRequirements: Record<string, string[]> = {
    'auth': ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'],
    'database': ['MONGODB_URI'],
    'payments': ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY'],
    'fileUpload': ['AWS_S3_BUCKET', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
    'security': ['CSRF_SECRET', 'ENCRYPTION_MASTER_KEY']
  };
  
  const required = featureRequirements[feature] || [];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Feature '${feature}' requires these environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}
