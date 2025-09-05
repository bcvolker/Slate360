export interface SecurityEvent {
  id: string;
  type: 'authentication' | 'authorization' | 'data_access' | 'system' | 'security' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  event: string;
  description: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details: Record<string, any>;
  source: string;
  category: string;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: 'email' | 'sms' | 'webhook' | 'dashboard';
  status: 'pending' | 'sent' | 'failed';
  recipient: string;
  message: string;
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface ThreatIndicator {
  id: string;
  type: 'ip_address' | 'user_agent' | 'behavior' | 'pattern';
  value: string;
  confidence: number; // 0-100
  risk: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: string;
  lastSeen: string;
  occurrences: number;
  description: string;
  mitigation?: string;
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  conditions: SecurityCondition[];
  actions: SecurityAction[];
  isEnabled: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityCondition {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than' | 'in_range';
  value: any;
  threshold?: number;
}

export interface SecurityAction {
  type: 'alert' | 'block' | 'rate_limit' | 'log' | 'redirect';
  config: Record<string, any>;
}

export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private threatIndicators: ThreatIndicator[] = [];
  private rules: SecurityRule[] = [];
  private alertHandlers: Map<string, (alert: SecurityAlert) => Promise<void>> = new Map();

  constructor() {
    this.initializeDefaultRules();
    this.startMonitoring();
  }

  /**
   * Initialize default security rules
   */
  private initializeDefaultRules(): void {
    // Brute force detection
    this.addRule({
      name: 'Brute Force Detection',
      description: 'Detect multiple failed login attempts from the same IP',
      conditions: [
        { field: 'event', operator: 'equals', value: 'login_failure' },
        { field: 'ipAddress', operator: 'equals', value: '{{ip}}' }
      ],
      actions: [
        { type: 'alert', config: { severity: 'high', message: 'Potential brute force attack detected' } },
        { type: 'rate_limit', config: { duration: 300, maxAttempts: 5 } }
      ],
      isEnabled: true,
      priority: 1
    });

    // Suspicious user agent
    this.addRule({
      name: 'Suspicious User Agent',
      description: 'Detect suspicious or malicious user agents',
      conditions: [
        { field: 'userAgent', operator: 'regex', value: '(bot|crawler|scanner|sqlmap|nikto)' }
      ],
      actions: [
        { type: 'alert', config: { severity: 'medium', message: 'Suspicious user agent detected' } },
        { type: 'log', config: { level: 'warn' } }
      ],
      isEnabled: true,
      priority: 2
    });

    // Data access anomaly
    this.addRule({
      name: 'Data Access Anomaly',
      description: 'Detect unusual data access patterns',
      conditions: [
        { field: 'event', operator: 'equals', value: 'data_read' },
        { field: 'userId', operator: 'equals', value: '{{userId}}' }
      ],
      actions: [
        { type: 'alert', config: { severity: 'medium', message: 'Unusual data access pattern detected' } },
        { type: 'log', config: { level: 'info' } }
      ],
      isEnabled: true,
      priority: 3
    });
  }

  /**
   * Start monitoring
   */
  private startMonitoring(): void {
    // Monitor events every 5 seconds
    setInterval(() => {
      this.processEvents();
      this.cleanupOldData();
    }, 5000);

    // Generate threat intelligence every minute
    setInterval(() => {
      this.generateThreatIntelligence();
    }, 60000);
  }

  /**
   * Add security rule
   */
  addRule(rule: Omit<SecurityRule, 'id' | 'createdAt' | 'updatedAt'>): SecurityRule {
    const newRule: SecurityRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.rules.push(newRule);
    return newRule;
  }

  /**
   * Record security event
   */
  recordEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const newEvent: SecurityEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.events.push(newEvent);
    return newEvent;
  }

  /**
   * Process events and trigger rules
   */
  private processEvents(): void {
    for (const rule of this.rules.filter(r => r.isEnabled)) {
      for (const event of this.events) {
        if (this.evaluateRule(rule, event)) {
          this.executeActions(rule.actions, event);
        }
      }
    }
  }

  /**
   * Evaluate if an event matches a rule
   */
  private evaluateRule(rule: SecurityRule, event: SecurityEvent): boolean {
    return rule.conditions.every(condition => {
      const fieldValue = this.getFieldValue(event, condition.field);
      return this.evaluateCondition(condition, fieldValue);
    });
  }

  /**
   * Get field value from event
   */
  private getFieldValue(event: SecurityEvent, field: string): any {
    const fieldMap: Record<string, any> = {
      event: event.event,
      type: event.type,
      severity: event.severity,
      userId: event.userId,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      source: event.source,
      category: event.category
    };

    return fieldMap[field] || event.details[field];
  }

  /**
   * Evaluate a single condition
   */
  private evaluateCondition(condition: SecurityCondition, value: any): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return typeof value === 'string' && value.includes(condition.value);
      case 'regex':
        return typeof value === 'string' && new RegExp(condition.value, 'i').test(value);
      case 'greater_than':
        return typeof value === 'number' && value > condition.value;
      case 'less_than':
        return typeof value === 'number' && value < condition.value;
      case 'in_range':
        return typeof value === 'number' && 
               value >= condition.value && 
               value <= (condition.threshold || condition.value);
      default:
        return false;
    }
  }

  /**
   * Execute security actions
   */
  private async executeActions(actions: SecurityAction[], event: SecurityEvent): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'alert':
            await this.createAlert(event, action.config);
            break;
          case 'log':
            console.log(`[SECURITY] ${action.config.level?.toUpperCase()}: ${action.config.message || event.description}`);
            break;
          case 'rate_limit':
            // Implement rate limiting logic
            console.log(`[SECURITY] Rate limiting applied: ${action.config.duration}s, max: ${action.config.maxAttempts}`);
            break;
          case 'block':
            // Implement blocking logic
            console.log(`[SECURITY] Blocking applied for: ${event.ipAddress || event.userId}`);
            break;
          case 'redirect':
            // Implement redirect logic
            console.log(`[SECURITY] Redirect applied to: ${action.config.url}`);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  /**
   * Create security alert
   */
  private async createAlert(event: SecurityEvent, config: Record<string, any>): Promise<void> {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId: event.id,
      type: 'dashboard',
      status: 'pending',
      recipient: 'security-team',
      message: config.message || event.description,
      createdAt: new Date().toISOString()
    };

    this.alerts.push(alert);
    
    // Send alert
    try {
      await this.sendAlert(alert);
      alert.status = 'sent';
      alert.sentAt = new Date().toISOString();
    } catch (error) {
      alert.status = 'failed';
      alert.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  /**
   * Send security alert
   */
  private async sendAlert(alert: SecurityAlert): Promise<void> {
    // In a real implementation, this would send emails, SMS, webhooks, etc.
    console.log(`[ALERT] ${alert.message} - Event: ${alert.eventId}`);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Generate threat intelligence
   */
  private generateThreatIntelligence(): void {
    // Analyze recent events for patterns
    const recentEvents = this.events.filter(
      event => Date.now() - new Date(event.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    // IP-based threat indicators
    const ipThreats = this.analyzeIPThreats(recentEvents);
    ipThreats.forEach(threat => this.addThreatIndicator(threat));

    // Behavior-based threat indicators
    const behaviorThreats = this.analyzeBehaviorThreats(recentEvents);
    behaviorThreats.forEach(threat => this.addThreatIndicator(threat));
  }

  /**
   * Analyze IP-based threats
   */
  private analyzeIPThreats(events: SecurityEvent[]): ThreatIndicator[] {
    const ipCounts = new Map<string, number>();
    const ipEvents = new Map<string, SecurityEvent[]>();

    // Count events per IP
    events.forEach(event => {
      if (event.ipAddress) {
        ipCounts.set(event.ipAddress, (ipCounts.get(event.ipAddress) || 0) + 1);
        if (!ipEvents.has(event.ipAddress)) {
          ipEvents.set(event.ipAddress, []);
        }
        ipEvents.get(event.ipAddress)!.push(event);
      }
    });

    const threats: ThreatIndicator[] = [];

    for (const [ip, count] of ipCounts.entries()) {
      if (count > 100) { // Threshold for suspicious activity
        const ipEventsList = ipEvents.get(ip) || [];
        const highSeverityCount = ipEventsList.filter(e => e.severity === 'high' || e.severity === 'critical').length;
        
        threats.push({
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'ip_address',
          value: ip,
          confidence: Math.min(100, (count / 100) * 100),
          risk: highSeverityCount > 10 ? 'critical' : count > 200 ? 'high' : 'medium',
          firstSeen: ipEventsList[0]?.timestamp || new Date().toISOString(),
          lastSeen: ipEventsList[ipEventsList.length - 1]?.timestamp || new Date().toISOString(),
          occurrences: count,
          description: `Suspicious activity from IP ${ip}: ${count} events, ${highSeverityCount} high severity`
        });
      }
    }

    return threats;
  }

  /**
   * Analyze behavior-based threats
   */
  private analyzeBehaviorThreats(events: SecurityEvent[]): ThreatIndicator[] {
    const threats: ThreatIndicator[] = [];
    const userEvents = new Map<string, SecurityEvent[]>();

    // Group events by user
    events.forEach(event => {
      if (event.userId) {
        if (!userEvents.has(event.userId)) {
          userEvents.set(event.userId, []);
        }
        userEvents.get(event.userId)!.push(event);
      }
    });

    // Analyze user behavior patterns
    for (const [userId, userEventsList] of userEvents.entries()) {
      const failedLogins = userEventsList.filter(e => e.event === 'login_failure').length;
      const dataAccess = userEventsList.filter(e => e.event === 'data_read' || e.event === 'data_write').length;
      
      if (failedLogins > 5 || dataAccess > 1000) {
        threats.push({
          id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'behavior',
          value: userId,
          confidence: Math.min(100, Math.max(failedLogins * 10, dataAccess / 10)),
          risk: failedLogins > 10 ? 'critical' : failedLogins > 5 ? 'high' : 'medium',
          firstSeen: userEventsList[0]?.timestamp || new Date().toISOString(),
          lastSeen: userEventsList[userEventsList.length - 1]?.timestamp || new Date().toISOString(),
          occurrences: userEventsList.length,
          description: `Suspicious behavior for user ${userId}: ${failedLogins} failed logins, ${dataAccess} data access events`
        });
      }
    }

    return threats;
  }

  /**
   * Add threat indicator
   */
  private addThreatIndicator(threat: ThreatIndicator): void {
    // Check if threat already exists
    const existingThreat = this.threatIndicators.find(t => 
      t.type === threat.type && t.value === threat.value
    );

    if (existingThreat) {
      // Update existing threat
      existingThreat.occurrences += threat.occurrences;
      existingThreat.lastSeen = threat.lastSeen;
      existingThreat.confidence = Math.max(existingThreat.confidence, threat.confidence);
      
      // Upgrade risk level if necessary
      if (threat.risk === 'critical' && existingThreat.risk !== 'critical') {
        existingThreat.risk = 'critical';
      } else if (threat.risk === 'high' && existingThreat.risk === 'low' || existingThreat.risk === 'medium') {
        existingThreat.risk = 'high';
      }
    } else {
      // Add new threat
      this.threatIndicators.push(threat);
    }
  }

  /**
   * Clean up old data
   */
  private cleanupOldData(): void {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Clean up old events (keep last 7 days)
    this.events = this.events.filter(event => 
      new Date(event.timestamp).getTime() > oneWeekAgo
    );

    // Clean up old alerts (keep last day)
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.createdAt).getTime() > oneDayAgo
    );

    // Clean up old threat indicators (keep last week)
    this.threatIndicators = this.threatIndicators.filter(threat => 
      new Date(threat.lastSeen).getTime() > oneWeekAgo
    );
  }

  /**
   * Get security statistics
   */
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > oneHourAgo);
    const recentAlerts = this.alerts.filter(a => new Date(a.createdAt).getTime() > oneHourAgo);
    const recentThreats = this.threatIndicators.filter(t => new Date(t.lastSeen).getTime() > oneDayAgo);

    return {
      totalEvents: this.events.length,
      recentEvents: recentEvents.length,
      totalAlerts: this.alerts.length,
      recentAlerts: recentAlerts.length,
      totalThreats: this.threatIndicators.length,
      recentThreats: recentThreats.length,
      activeRules: this.rules.filter(r => r.isEnabled).length,
      eventTypes: this.getEventTypeDistribution(),
      severityDistribution: this.getSeverityDistribution(),
      topThreats: this.getTopThreats()
    };
  }

  /**
   * Get event type distribution
   */
  private getEventTypeDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    this.events.forEach(event => {
      distribution[event.type] = (distribution[event.type] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Get severity distribution
   */
  private getSeverityDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    this.events.forEach(event => {
      distribution[event.severity] = (distribution[event.severity] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Get top threats
   */
  private getTopThreats(): ThreatIndicator[] {
    return [...this.threatIndicators]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }
}

// Export default security monitor
export const securityMonitor = new SecurityMonitor();

// Export convenience functions
export const recordSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) =>
  securityMonitor.recordEvent(event);

export const addSecurityRule = (rule: Omit<SecurityRule, 'id' | 'createdAt' | 'updatedAt'>) =>
  securityMonitor.addRule(rule);

export const getSecurityStats = () => securityMonitor.getStats();
