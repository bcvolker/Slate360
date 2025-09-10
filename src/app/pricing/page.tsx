'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import styles from '@/styles/Pricing.module.css';

const PRICING_TIERS = [
  {
    name: 'Basic',
    price: 49,
    description: 'Perfect for small teams getting started with construction technology',
    features: [
      'Up to 5 projects',
      'Basic BIM viewing',
      'Standard support',
      '1GB storage',
      'Basic reporting',
      'Email support'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonClass: 'subscribeButton'
  },
  {
    name: 'Pro',
    price: 299,
    description: 'Advanced features for growing construction teams',
    features: [
      'Up to 25 projects',
      'Advanced BIM tools',
      'Priority support',
      '10GB storage',
      'Advanced analytics',
      'Phone & email support',
      'Custom integrations',
      'Team collaboration tools'
    ],
    popular: true,
    buttonText: 'Upgrade to Pro',
    buttonClass: 'subscribeButton popularButton'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations',
    features: [
      'Unlimited projects',
      'Full BIM suite',
      'Dedicated support',
      'Unlimited storage',
      'Custom analytics',
      '24/7 phone support',
      'Custom integrations',
      'Advanced security',
      'SLA guarantees',
      'On-premise options'
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonClass: 'contactButton'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const getPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return isAnnual ? Math.round(price * 12 * 0.8) : price;
  };

  const getPeriod = () => {
    return isAnnual ? '/year' : '/month';
  };

  const getSavings = (price: number) => {
    if (typeof price === 'string') return null;
    return isAnnual ? `Save $${Math.round(price * 12 * 0.2)}/year` : null;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your construction team's needs</p>
        
        {/* Billing Toggle */}
        <div className={styles.billingToggle}>
          <span className={!isAnnual ? styles.active : ''}>Monthly</span>
          <div className={styles.toggleButton} onClick={toggleBilling}>
            <div className={`${styles.toggleSlider} ${isAnnual ? styles.sliderRight : ''}`}></div>
          </div>
          <span className={isAnnual ? styles.active : ''}>
            Annual
            <span className={styles.discount}>Save 20%</span>
          </span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className={styles.pricingGrid}>
        {PRICING_TIERS.map((tier, index) => (
          <div key={tier.name} className={`${styles.pricingCard} ${tier.popular ? styles.popular : ''}`}>
            {tier.popular && <div className={styles.popularBadge}>Most Popular</div>}
            
            <div className={styles.cardHeader}>
              <h2>{tier.name}</h2>
              <p className={styles.description}>{tier.description}</p>
              
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>{getPrice(tier.price)}</span>
                <span className={styles.period}>{typeof tier.price === 'number' ? getPeriod() : ''}</span>
              </div>
              
              {getSavings(tier.price as number) && (
                <p className={styles.savings}>{getSavings(tier.price as number)}</p>
              )}
            </div>

            <div className={styles.features}>
              <h3>What's included:</h3>
              <ul>
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <span className={styles.checkmark}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.cardActions}>
              <button className={`${styles[tier.buttonClass]} ${tier.popular ? styles.popularButton : ''}`}>
                {tier.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className={styles.featureComparison}>
        <h2>Feature Comparison</h2>
        <div className={styles.comparisonTable}>
          <div className={styles.tableHeader}>
            <div>Features</div>
            <div>Basic</div>
            <div>Pro</div>
            <div>Enterprise</div>
          </div>
          <div className={styles.tableRow}>
            <div>Projects</div>
            <div>5</div>
            <div>25</div>
            <div>Unlimited</div>
          </div>
          <div className={styles.tableRow}>
            <div>Storage</div>
            <div>1GB</div>
            <div>10GB</div>
            <div>Unlimited</div>
          </div>
          <div className={styles.tableRow}>
            <div>Support</div>
            <div>Email</div>
            <div>Phone & Email</div>
            <div>24/7 Dedicated</div>
          </div>
          <div className={styles.tableRow}>
            <div>Integrations</div>
            <div>Basic</div>
            <div>Advanced</div>
            <div>Custom</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>Can I change plans anytime?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Is there a free trial?</h3>
            <p>We offer a 14-day free trial for all plans. No credit card required to get started.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Do you offer custom pricing?</h3>
            <p>Yes, Enterprise plans are fully customizable based on your organization's specific needs.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2>Ready to transform your construction workflow?</h2>
        <p>Join thousands of construction teams already using Slate360 to build smarter, faster, and more efficiently.</p>
        <button className={styles.ctaButton}>
          Start Your Free Trial
        </button>
      </div>
    </div>
  );
}
