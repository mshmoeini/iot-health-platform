export interface NotificationSettings {
  caregiverName: string;
  caregiverPhone: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  smsAlertsEnabled: boolean;
  emergencyEscalationEnabled: boolean;

  preferredMethod: 'sms' | 'email' | 'both';

  lastNotificationSent: string;
  lastNotificationStatus: string;

  customHeartRateThreshold: number;
  customSpo2Threshold: number;
  customTempThreshold: number;

  notifyOnDisconnect: boolean;
  notifyOnLowBattery: boolean;
}
