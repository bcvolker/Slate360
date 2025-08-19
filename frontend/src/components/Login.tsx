'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';

interface LoginProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function Login({ onClose, isModal = true }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        // Redirect to dashboard on successful login
        if (isModal && onClose) {
          onClose();
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Redirect to password reset page
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    if (isModal && onClose) {
      onClose();
    }
    router.push('/signup');
  };

  if (isModal) {
    return (
      <div className={styles.modal}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Welcome Back</h2>
            <p>Sign in to your Slate360 account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className={styles.googleButton}
            disabled={isLoading}
          >
            <img src="/google-icon.svg" alt="Google" className={styles.googleIcon} />
            Continue with Google
          </button>

          <div className={styles.footer}>
            <button
              onClick={handleForgotPassword}
              className={styles.linkButton}
              type="button"
            >
              Forgot password?
            </button>
            <button
              onClick={handleSignUp}
              className={styles.linkButton}
              type="button"
            >
              Don't have an account? Sign up
            </button>
          </div>

          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>

          <p className={styles.disclaimer}>
            By signing in, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  // Non-modal version for standalone login page
  return (
    <div className={styles.standalone}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Sign In to Slate360</h1>
          <p>Access your construction workflow platform</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className={styles.googleButton}
          disabled={isLoading}
        >
          <img src="/google-icon.svg" alt="Google" className={styles.googleIcon} />
          Continue with Google
        </button>

        <div className={styles.footer}>
          <button
            onClick={handleForgotPassword}
            className={styles.linkButton}
            type="button"
          >
            Forgot password?
          </button>
          <button
            onClick={handleSignUp}
            className={styles.linkButton}
            type="button"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <p className={styles.disclaimer}>
          By signing in, you agree to our{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
