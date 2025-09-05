import crypto from 'crypto';
import { z } from 'zod';

export interface FileValidationConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  scanForMalware: boolean;
  virusTotalApiKey?: string;
  clamAVEnabled: boolean;
  clamAVHost?: string;
  clamAVPort?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileHash: string;
  scanResult?: {
    isClean: boolean;
    threats: string[];
    scanProvider: string;
    scanTimestamp: string;
  };
}

export interface SecureUploadConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  encryption: 'AES256' | 'aws:kms';
  kmsKeyId?: string;
  presignedUrlExpiry: number;
  publicRead: boolean;
}

export class FileUploadSecurity {
  private config: Required<FileValidationConfig>;
  private uploadConfig: SecureUploadConfig;

  constructor(
    fileConfig: Partial<FileValidationConfig> = {},
    uploadConfig: SecureUploadConfig
  ) {
    this.config = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv'
      ],
      allowedExtensions: [
        '.jpg', '.jpeg', '.png', '.gif', '.webp',
        '.pdf', '.doc', '.docx', '.xls', '.xlsx',
        '.txt', '.csv'
      ],
      scanForMalware: true,
      virusTotalApiKey: process.env.VIRUS_TOTAL_API_KEY || '',
      clamAVEnabled: !!process.env.CLAMAV_HOST,
      clamAVHost: process.env.CLAMAV_HOST || 'localhost',
      clamAVPort: parseInt(process.env.CLAMAV_PORT || '3310'),
      ...fileConfig
    };

    this.uploadConfig = uploadConfig;
  }

  /**
   * Validate file before upload
   */
  async validateFile(file: File | Buffer, filename: string): Promise<FileValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let fileHash = '';

    try {
      // Check file size
      const fileSize = file instanceof File ? file.size : file.length;
      if (fileSize > this.config.maxFileSize) {
        errors.push(`File size (${this.formatBytes(fileSize)}) exceeds maximum allowed size (${this.formatBytes(this.config.maxFileSize)})`);
      }

      // Check file extension
      const extension = this.getFileExtension(filename);
      if (!this.config.allowedExtensions.includes(extension.toLowerCase())) {
        errors.push(`File extension '${extension}' is not allowed. Allowed extensions: ${this.config.allowedExtensions.join(', ')}`);
      }

      // Check MIME type
      if (file instanceof File) {
        if (!this.config.allowedMimeTypes.includes(file.type)) {
          errors.push(`File type '${file.type}' is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`);
        }
      }

      // Generate file hash
      fileHash = await this.generateFileHash(file);

      // Check for suspicious patterns
      const suspiciousPatterns = this.detectSuspiciousPatterns(filename, file);
      if (suspiciousPatterns.length > 0) {
        warnings.push(`Suspicious patterns detected: ${suspiciousPatterns.join(', ')}`);
      }

      // Malware scanning
      let scanResult;
      if (this.config.scanForMalware) {
        scanResult = await this.scanForMalware(file, fileHash);
        if (!scanResult.isClean) {
          errors.push(`Malware detected: ${scanResult.threats.join(', ')}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fileHash,
        scanResult
      };

    } catch (error) {
      errors.push(`File validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        errors,
        warnings,
        fileHash
      };
    }
  }

  /**
   * Generate secure file hash
   */
  private async generateFileHash(file: File | Buffer): Promise<string> {
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return crypto.createHash('sha256').update(buffer).digest('hex');
    } else {
      return crypto.createHash('sha256').update(file).digest('hex');
    }
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Detect suspicious patterns in filename and content
   */
  private detectSuspiciousPatterns(filename: string, file: File | Buffer): string[] {
    const patterns: string[] = [];

    // Check filename for suspicious patterns
    const suspiciousNames = [
      'cmd', 'bat', 'exe', 'scr', 'pif', 'com', 'vbs', 'js', 'jar', 'msi',
      'dll', 'sys', 'drv', 'scr', 'hta', 'wsf', 'wsh', 'ps1', 'psm1'
    ];

    const lowerFilename = filename.toLowerCase();
    for (const suspicious of suspiciousNames) {
      if (lowerFilename.includes(suspicious)) {
        patterns.push(`Suspicious filename pattern: ${suspicious}`);
      }
    }

    // Check for double extensions (e.g., document.pdf.exe)
    const extensionCount = (filename.match(/\./g) || []).length;
    if (extensionCount > 1) {
      patterns.push('Multiple file extensions detected');
    }

    // Check for very long filenames
    if (filename.length > 255) {
      patterns.push('Filename is unusually long');
    }

    // Check for special characters that might indicate encoding attacks
    const specialChars = /[^\w\s\-\.]/g;
    if (specialChars.test(filename)) {
      patterns.push('Filename contains special characters');
    }

    return patterns;
  }

  /**
   * Scan file for malware using multiple methods
   */
  private async scanForMalware(file: File | Buffer, fileHash: string): Promise<{
    isClean: boolean;
    threats: string[];
    scanProvider: string;
    scanTimestamp: string;
  }> {
    const threats: string[] = [];

    // VirusTotal scan (if API key available)
    if (this.config.virusTotalApiKey) {
      try {
        const vtResult = await this.scanWithVirusTotal(fileHash);
        if (!vtResult.isClean) {
          threats.push(...vtResult.threats);
        }
      } catch (error) {
        console.warn('VirusTotal scan failed:', error);
      }
    }

    // ClamAV scan (if enabled)
    if (this.config.clamAVEnabled) {
      try {
        const clamResult = await this.scanWithClamAV(file);
        if (!clamResult.isClean) {
          threats.push(...clamResult.threats);
        }
      } catch (error) {
        console.warn('ClamAV scan failed:', error);
      }
    }

    // Basic heuristic scanning
    const heuristicThreats = await this.performHeuristicScan(file);
    threats.push(...heuristicThreats);

    return {
      isClean: threats.length === 0,
      threats,
      scanProvider: 'Multi-engine scan',
      scanTimestamp: new Date().toISOString()
    };
  }

  /**
   * Scan with VirusTotal API
   */
  private async scanWithVirusTotal(fileHash: string): Promise<{
    isClean: boolean;
    threats: string[];
  }> {
    try {
      const response = await fetch(
        `https://www.virustotal.com/vtapi/v2/file/report?apikey=${this.config.virusTotalApiKey}&resource=${fileHash}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`VirusTotal API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response_code === 1) {
        const positives = data.positives || 0;
        const total = data.total || 0;
        
        if (positives > 0) {
          const detectedBy = Object.keys(data.scans || {})
            .filter(key => data.scans[key].detected)
            .map(key => `${key}: ${data.scans[key].result}`);
          
          return {
            isClean: false,
            threats: detectedBy
          };
        }
      }

      return { isClean: true, threats: [] };
    } catch (error) {
      console.error('VirusTotal scan error:', error);
      return { isClean: true, threats: [] }; // Fail open for now
    }
  }

  /**
   * Scan with ClamAV
   */
  private async scanWithClamAV(file: File | Buffer): Promise<{
    isClean: boolean;
    threats: string[];
  }> {
    try {
      // This is a simplified ClamAV integration
      // In production, you'd use a proper ClamAV client library
      const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
      
      // Simulate ClamAV scan (replace with actual implementation)
      const isClean = !this.detectClamAVThreats(buffer);
      
      return {
        isClean,
        threats: isClean ? [] : ['ClamAV: Potential threat detected']
      };
    } catch (error) {
      console.error('ClamAV scan error:', error);
      return { isClean: true, threats: [] }; // Fail open for now
    }
  }

  /**
   * Detect threats using ClamAV signatures (simplified)
   */
  private detectClamAVThreats(buffer: Buffer): boolean {
    // This is a simplified example - in production, use actual ClamAV
    const suspiciousPatterns = [
      'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*',
      'TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA4fug4AtAnNIbgBTM0hVGhpcyBwcm9ncmFtIGNhbm5vdCBiZSBydW4gaW4gRE9TIG1vZGUuDQ0KJAAAAAAAAABQRQAATAEDAFKmq1UAAAAAAAAAAOAAIiALgAAAAAABAAgAAAAAAEAAgAAAAAgAABAAAAAAAAAAGAAAAAAAAAACAAAAAAgAAAAAAAAMAYIUAABAAABAAAAAAEAAAEAAAAAAAABAAAAAAAAAAAAAAAGQEAABPAAAAAEAAAIgDAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAwAAADcQAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
    ];

    const fileContent = buffer.toString('utf8', 0, Math.min(buffer.length, 1000));
    return suspiciousPatterns.some(pattern => fileContent.includes(pattern));
  }

  /**
   * Perform basic heuristic scanning
   */
  private async performHeuristicScan(file: File | Buffer): Promise<string[]> {
    const threats: string[] = [];
    
    try {
      let buffer: Buffer;
      if (file instanceof File) {
        const arrayBuffer = await file.slice(0, 1024).arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else {
        buffer = file.slice(0, 1024);
      }
      
      // Check for executable signatures
      const executableSignatures = [
        Buffer.from([0x4D, 0x5A]), // MZ header (PE files)
        Buffer.from([0x7F, 0x45, 0x4C, 0x46]), // ELF header
        Buffer.from([0xFE, 0xED, 0xFA, 0xCE]), // Mach-O header
        Buffer.from([0xCF, 0xFA, 0xED, 0xFE])  // Mach-O header (reverse)
      ];

      for (const signature of executableSignatures) {
        if (buffer.includes(signature)) {
          threats.push('Heuristic: Executable file signature detected');
          break;
        }
      }

      // Check for script content
      const scriptPatterns = [
        /<script\b[^>]*>/i,
        /javascript:/i,
        /vbscript:/i,
        /on\w+\s*=/i,
        /eval\s*\(/i,
        /document\.write/i
      ];

      const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1000));
      for (const pattern of scriptPatterns) {
        if (pattern.test(content)) {
          threats.push('Heuristic: Script content detected');
          break;
        }
      }

    } catch (error) {
      console.warn('Heuristic scan failed:', error);
    }

    return threats;
  }

  /**
   * Generate secure S3 upload URL
   */
  async generateSecureUploadURL(
    filename: string,
    contentType: string,
    fileHash: string
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
    expiresAt: string;
  }> {
    // In production, this would integrate with AWS SDK
    const fileKey = `uploads/${fileHash}/${filename}`;
    const expiresAt = new Date(Date.now() + this.uploadConfig.presignedUrlExpiry * 1000).toISOString();
    
    // Simulate S3 presigned URL generation
    const uploadUrl = `https://${this.uploadConfig.bucket}.s3.${this.uploadConfig.region}.amazonaws.com/${fileKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${this.uploadConfig.accessKeyId}&X-Amz-Date=${new Date().toISOString().split('T')[0]}&X-Amz-Expires=${this.uploadConfig.presignedUrlExpiry}&X-Amz-SignedHeaders=host&X-Amz-Signature=signature`;

    return {
      uploadUrl,
      fileKey,
      expiresAt
    };
  }

  /**
   * Get file security statistics
   */
  getStats() {
    return {
      maxFileSize: this.formatBytes(this.config.maxFileSize),
      allowedMimeTypes: this.config.allowedMimeTypes.length,
      allowedExtensions: this.config.allowedExtensions.length,
      malwareScanning: this.config.scanForMalware,
      virusTotalEnabled: !!this.config.virusTotalApiKey,
      clamAVEnabled: this.config.clamAVEnabled,
      encryption: this.uploadConfig.encryption,
      presignedUrlExpiry: this.uploadConfig.presignedUrlExpiry
    };
  }
}

// Export default configuration
export const defaultFileUploadConfig: FileValidationConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv'
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.csv'],
  scanForMalware: true,
  virusTotalApiKey: process.env.VIRUS_TOTAL_API_KEY,
  clamAVEnabled: !!process.env.CLAMAV_HOST,
  clamAVHost: process.env.CLAMAV_HOST,
  clamAVPort: parseInt(process.env.CLAMAV_PORT || '3310')
};

// Export convenience functions
export const validateFile = (file: File | Buffer, filename: string, config?: Partial<FileValidationConfig>) => {
  const fileSecurity = new FileUploadSecurity(config || defaultFileUploadConfig, {
    bucket: process.env.AWS_S3_BUCKET || 'slate360-uploads',
    region: process.env.AWS_S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    encryption: 'AES256',
    presignedUrlExpiry: 3600,
    publicRead: false
  });
  
  return fileSecurity.validateFile(file, filename);
};

export const generateUploadURL = (filename: string, contentType: string, fileHash: string) => {
  const fileSecurity = new FileUploadSecurity(defaultFileUploadConfig, {
    bucket: process.env.AWS_S3_BUCKET || 'slate360-uploads',
    region: process.env.AWS_S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    encryption: 'AES256',
    presignedUrlExpiry: 3600,
    publicRead: false
  });
  
  return fileSecurity.generateSecureUploadURL(filename, contentType, fileHash);
};
