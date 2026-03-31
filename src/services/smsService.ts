// SMS service — integrates with backend SMS endpoint.
// In production the backend calls Twilio; here we proxy through the API.
import { apiFetch } from '@/lib/api';

export const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  if (!phoneNumber || !message) return false;
  try {
    const res = await apiFetch('/api/sms/send', {
      method: 'POST',
      body: JSON.stringify({ phone: phoneNumber, message }),
    });
    return res.ok;
  } catch (err) {
    console.error('Error sending SMS:', err);
    return false;
  }
};

export const sendPriceAlert = async (
  phoneNumber: string,
  cropName: string,
  price: number,
  market: string
): Promise<boolean> => {
  if (!phoneNumber || !cropName || !market) return false;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
  const message = `🔔 Price Alert! ${cropName} is now at ${formattedPrice}/kg in ${market}. Log in to FarmSync for more details.`;
  return sendSMS(phoneNumber, message);
};

export const sendOTP = async (
  phoneNumber: string,
  otp: string | { toString: () => string }
): Promise<boolean> => {
  if (!phoneNumber || !otp) return false;
  const otpString = typeof otp === 'string' ? otp : otp.toString();
  const formattedOTP = otpString.split('').join(' ');
  const message = `🔐 Your FarmSync verification code is: ${formattedOTP}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS(phoneNumber, message);
};

export const sendTransactionConfirmation = async (
  phoneNumber: string,
  amount: number,
  transactionId: string
): Promise<boolean> => {
  if (!phoneNumber || !transactionId) return false;
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
  const shortId =
    transactionId.length > 8
      ? `${transactionId.substring(0, 4)}...${transactionId.substring(transactionId.length - 4)}`
      : transactionId;
  const message = `✅ Transaction successful! Amount: ${formattedAmount}\nTxn ID: ${shortId}\nThank you for using FarmSync!`;
  return sendSMS(phoneNumber, message);
};

export const sendBrokerConnectionRequest = async (
  phoneNumber: string,
  brokerName: string
): Promise<boolean> => {
  if (!phoneNumber || !brokerName) return false;
  const message = `🤝 You have a new connection request from broker ${brokerName} on FarmSync. Log in to respond.`;
  return sendSMS(phoneNumber, message);
};

export const sendPaymentReminder = async (
  phoneNumber: string,
  amount: number,
  dueDate: string
): Promise<boolean> => {
  if (!phoneNumber || !dueDate) return false;
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
  const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const message = `⏰ Reminder: Payment of ${formattedAmount} is due on ${formattedDate}. Please pay to avoid service interruption. - FarmSync`;
  return sendSMS(phoneNumber, message);
};
