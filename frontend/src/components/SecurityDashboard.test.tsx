import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard from './SecurityDashboard';

// Mock the security modules
jest.mock('@/lib/security', () => ({
  securityManager: {
    getStatus: jest.fn(() => ({
      csrf: true,
      headers: true,
      validation: true,
      rateLimit: true,
      session: true,
      logging: true,
      mfa: false,
      encryption: true,
      monitoring: true,
      fileUpload: true,
      errorHandling: true,
      apiSecurity: true
    })),
    healthCheck: jest.fn(() => Promise.resolve({
      status: 'warning',
      issues: ['MFA is not enabled for any users'],
      recommendations: ['Enable MFA for all admin users']
    }))
  }
}));

describe('SecurityDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders security dashboard with all tabs', () => {
    render(<SecurityDashboard />);
    
    expect(screen.getByText('Security Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Health Check')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Security Logs')).toBeInTheDocument();
  });

  it('shows security features status in overview tab', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('CSRF')).toBeInTheDocument();
      expect(screen.getByText('Headers')).toBeInTheDocument();
      expect(screen.getByText('Validation')).toBeInTheDocument();
      expect(screen.getByText('Rate Limit')).toBeInTheDocument();
    });
  });

  it('displays security statistics', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Security Score')).toBeInTheDocument();
      expect(screen.getByText('Active Threats')).toBeInTheDocument();
    });
  });

  it('shows health check results when run', async () => {
    render(<SecurityDashboard />);
    
    const healthCheckButton = screen.getByText('Run Health Check');
    fireEvent.click(healthCheckButton);
    
    await waitFor(() => {
      expect(screen.getByText('warning')).toBeInTheDocument();
      expect(screen.getByText('MFA is not enabled for any users')).toBeInTheDocument();
      expect(screen.getByText('Enable MFA for all admin users')).toBeInTheDocument();
    });
  });

  it('allows switching between tabs', async () => {
    render(<SecurityDashboard />);
    
    // Click on Health Check tab
    const healthTab = screen.getByText('Health Check');
    fireEvent.click(healthTab);
    
    await waitFor(() => {
      expect(screen.getByText('Issues Found')).toBeInTheDocument();
    });
    
    // Click on Configuration tab
    const configTab = screen.getByText('Configuration');
    fireEvent.click(configTab);
    
    await waitFor(() => {
      expect(screen.getByText('CSRF Protection')).toBeInTheDocument();
      expect(screen.getByText('Security Headers')).toBeInTheDocument();
    });
  });

  it('displays configuration toggles', async () => {
    render(<SecurityDashboard />);
    
    const configTab = screen.getByText('Configuration');
    fireEvent.click(configTab);
    
    await waitFor(() => {
      const csrfToggle = screen.getByRole('button', { name: /CSRF Protection Enabled/i });
      expect(csrfToggle).toBeInTheDocument();
    });
  });

  it('shows security logs information', async () => {
    render(<SecurityDashboard />);
    
    const logsTab = screen.getByText('Security Logs');
    fireEvent.click(logsTab);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Events:')).toBeInTheDocument();
      expect(screen.getByText('Security Alerts:')).toBeInTheDocument();
      expect(screen.getByText('Failed Logins:')).toBeInTheDocument();
    });
  });

  it('handles loading state correctly', () => {
    render(<SecurityDashboard />);
    
    // Initially shows loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays security score correctly', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  it('shows active threats count', async () => {
    render(<SecurityDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});
