import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  sendPriceAlert as sendPriceAlertService, 
  sendOTP as sendOTPService, 
  sendTransactionConfirmation as sendTransactionConfirmationService, 
  sendBrokerConnectionRequest as sendBrokerConnectionRequestService, 
  sendPaymentReminder as sendPaymentReminderService 
} from '@/services/smsService';

type UserRole = 'farmer' | 'broker' | null;

export type NotificationPreference = {
  priceAlerts: boolean;
  transactionAlerts: boolean;
  connectionRequests: boolean;
  paymentReminders: boolean;
  marketing: boolean;
  // Add any additional preferences here
};

const DEFAULT_PREFERENCES: NotificationPreference = {
  priceAlerts: true,
  transactionAlerts: true,
  connectionRequests: true,
  paymentReminders: true,
  marketing: false,
};

type SMSContextType = {
  // User preferences
  preferences: NotificationPreference;
  updatePreferences: (updates: Partial<NotificationPreference>) => void;
  resetPreferences: () => void;
  
  // SMS sending methods
  sendPriceAlert: (cropName: string, price: number, market: string) => Promise<boolean>;
  sendOTP: (otp: string | number) => Promise<boolean>;
  sendTransactionConfirmation: (amount: number, transactionId: string) => Promise<boolean>;
  sendBrokerConnectionRequest: (brokerName: string) => Promise<boolean>;
  sendPaymentReminder: (amount: number, dueDate: string) => Promise<boolean>;
  
  // Status and error handling
  isSending: boolean;
  lastError: string | null;
  clearError: () => void;
};

const STORAGE_KEY_PREFIX = 'market_stride_sms_prefs_';

const getStorageKey = (userId: string, role: UserRole) => {
  return `${STORAGE_KEY_PREFIX}${role}_${userId}`;
};

const loadPreferences = (userId: string, role: UserRole): NotificationPreference => {
  try {
    const key = getStorageKey(userId, role);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : { ...DEFAULT_PREFERENCES };
  } catch (error) {
    console.error('Failed to load SMS preferences', error);
    return { ...DEFAULT_PREFERENCES };
  }
};

const savePreferences = (userId: string, role: UserRole, prefs: NotificationPreference) => {
  try {
    const key = getStorageKey(userId, role);
    localStorage.setItem(key, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save SMS preferences', error);
  }
};

const SMSContext = createContext<SMSContextType | undefined>(undefined);

export const SMSProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference>(DEFAULT_PREFERENCES);
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load preferences when user changes
  useEffect(() => {
    if (user?.id && user.role) {
      const loadedPrefs = loadPreferences(user.id, user.role);
      setPreferences(loadedPrefs);
    } else {
      setPreferences({ ...DEFAULT_PREFERENCES });
    }
  }, [user?.id, user?.role]);

  // Save preferences when they change
  useEffect(() => {
    if (user?.id && user.role) {
      savePreferences(user.id, user.role, preferences);
    }
  }, [preferences, user?.id, user?.role]);

  const updatePreferences = useCallback((updates: Partial<NotificationPreference>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({ ...DEFAULT_PREFERENCES });
  }, []);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // Wrapper functions that check preferences before sending
  const sendPriceAlert = useCallback(async (cropName: string, price: number, market: string) => {
    if (!user?.phoneNumber) {
      setLastError('Phone number not found');
      return false;
    }
    
    if (!preferences.priceAlerts) {
      console.log('Price alerts are disabled in user preferences');
      return false;
    }
    
    try {
      setIsSending(true);
      setLastError(null);
      return await sendPriceAlertService(user.phoneNumber, cropName, price, market);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send price alert';
      setLastError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user?.phoneNumber, preferences.priceAlerts]);

  const sendOTP = useCallback(async (otp: string | number) => {
    if (!user?.phoneNumber) {
      setLastError('Phone number not found');
      return false;
    }
    
    try {
      setIsSending(true);
      setLastError(null);
      return await sendOTPService(user.phoneNumber, otp);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      setLastError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user?.phoneNumber]);

  const sendTransactionConfirmation = useCallback(async (amount: number, transactionId: string) => {
    if (!user?.phoneNumber) {
      setLastError('Phone number not found');
      return false;
    }
    
    if (!preferences.transactionAlerts) {
      console.log('Transaction alerts are disabled in user preferences');
      return false;
    }
    
    try {
      setIsSending(true);
      setLastError(null);
      return await sendTransactionConfirmationService(user.phoneNumber, amount, transactionId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send transaction confirmation';
      setLastError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user?.phoneNumber, preferences.transactionAlerts]);

  const sendBrokerConnectionRequest = useCallback(async (brokerName: string) => {
    if (!user?.phoneNumber) {
      setLastError('Phone number not found');
      return false;
    }
    
    if (!preferences.connectionRequests) {
      console.log('Connection request notifications are disabled in user preferences');
      return false;
    }
    
    try {
      setIsSending(true);
      setLastError(null);
      return await sendBrokerConnectionRequestService(user.phoneNumber, brokerName);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send connection request';
      setLastError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user?.phoneNumber, preferences.connectionRequests]);

  const sendPaymentReminder = useCallback(async (amount: number, dueDate: string) => {
    if (!user?.phoneNumber) {
      setLastError('Phone number not found');
      return false;
    }
    
    if (!preferences.paymentReminders) {
      console.log('Payment reminders are disabled in user preferences');
      return false;
    }
    
    try {
      setIsSending(true);
      setLastError(null);
      return await sendPaymentReminderService(user.phoneNumber, amount, dueDate);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send payment reminder';
      setLastError(errorMessage);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user?.phoneNumber, preferences.paymentReminders]);

  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
    sendPriceAlert,
    sendOTP,
    sendTransactionConfirmation,
    sendBrokerConnectionRequest,
    sendPaymentReminder,
    isSending,
    lastError,
    clearError,
  };

  return (
    <SMSContext.Provider value={value}>
      {children}
    </SMSContext.Provider>
  );
};

export const useSMS = (): SMSContextType => {
  const context = useContext(SMSContext);
  if (context === undefined) {
    throw new Error('useSMS must be used within an SMSProvider');
  }
  return context;
};

// Export the notification preference type for use in other components
export type { NotificationPreference };
