'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react';
import styles from '@/styles/Contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <h1>Get in Touch</h1>
          <p>Have questions about Slate360? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {/* Contact Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                <span>Name *</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Your full name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className={styles.errorMessage}>
                  {errors.name}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <span>Email *</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="your.email@company.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className={styles.errorMessage}>
                  {errors.email}
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                <span>Message *</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder="Tell us about your project, questions, or how we can help..."
                disabled={isSubmitting}
                rows={6}
              />
              <div className={styles.characterCount}>
                {formData.message.length}/1000 characters
              </div>
              {errors.message && (
                <div className={styles.errorMessage}>
                  {errors.message}
                </div>
              )}
            </div>

            {/* Submit Status Messages */}
            {submitStatus === 'success' && (
              <div style={{ color: '#10B981', fontSize: '0.9rem', marginBottom: '1rem' }}>
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '1rem' }}>
                ⚠️ There was an error sending your message. Please try again.
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h3>Other Ways to Reach Us</h3>
            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <div className={styles.icon}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4>Email Support</h4>
                  <p>support@slate360.com</p>
                  <p>We typically respond within 24 hours</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.icon}>
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4>Live Chat</h4>
                  <p>Available in your dashboard</p>
                  <p>Get instant help from our support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
