// Mock SMS service - in a real app, this would integrate with an SMS gateway like Twilio, MessageBird, etc.

// Mock function to simulate sending an SMS
export const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  try {
    // Basic validation
    if (!phoneNumber || !message) {
      console.error('Phone number and message are required');
      return false;
    }

    // In a real implementation, this would call an SMS gateway API
    console.log(`[SMS] Sending to ${phoneNumber}: ${message}`);
    
    // Simulate API call delay with a 1-2 second random delay
    const delay = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate occasional failures (10% chance of failure)
    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      console.error('[SMS] Simulated failure - message not delivered');
      return false;
    }
    
    console.log('[SMS] Message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

// Function to send price alert via SMS
export const sendPriceAlert = async (phoneNumber: string, cropName: string, price: number, market: string): Promise<boolean> => {
  try {
    if (!phoneNumber || !cropName || !market) {
      console.error('Missing required parameters for price alert');
      return false;
    }
    
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
    
    const message = `🔔 Price Alert! ${cropName} is now at ${formattedPrice}/kg in ${market}. Log in to your MarketStride account for more details.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending price alert:', error);
    return false;
  }
};

// Function to send OTP via SMS
export const sendOTP = async (phoneNumber: string, otp: string | { toString: () => string }): Promise<boolean> => {
  try {
    if (!phoneNumber || !otp) {
      console.error('Phone number and OTP are required');
      return false;
    }
    
    // Handle both string and number OTPs
    const otpString = typeof otp === 'string' ? otp : otp.toString();
    
    // Format OTP with spaces for better readability (e.g., 1 2 3 4 5 6)
    const formattedOTP = otpString.split('').join(' ');
    
    const message = `🔐 Your MarketStride verification code is: ${formattedOTP}. Valid for 10 minutes.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

// Function to send transaction confirmation
export const sendTransactionConfirmation = async (phoneNumber: string, amount: number, transactionId: string): Promise<boolean> => {
  try {
    if (!phoneNumber || !transactionId) {
      console.error('Phone number and transaction ID are required');
      return false;
    }
    
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
    
    const shortTransactionId = transactionId.length > 8 
      ? `${transactionId.substring(0, 4)}...${transactionId.substring(transactionId.length - 4)}`
      : transactionId;
    
    const message = `✅ Transaction successful! Amount: ${formattedAmount}\nTxn ID: ${shortTransactionId}\nThank you for using MarketStride!`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending transaction confirmation:', error);
    return false;
  }
};

// Function to send broker connection request
export const sendBrokerConnectionRequest = async (phoneNumber: string, brokerName: string): Promise<boolean> => {
  try {
    if (!phoneNumber || !brokerName) {
      console.error('Phone number and broker name are required');
      return false;
    }
    
    const message = `🤝 You have a new connection request from broker ${brokerName}. Log in to your MarketStride account to respond.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending connection request notification:', error);
    return false;
  }
};

// Function to send payment reminder
export const sendPaymentReminder = async (phoneNumber: string, amount: number, dueDate: string): Promise<boolean> => {
  try {
    if (!phoneNumber || !dueDate) {
      console.error('Phone number and due date are required');
      return false;
    }
    
    const formattedAmount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
    
    // Format the due date for better readability
    const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    const message = `⏰ Reminder: Payment of ${formattedAmount} is due on ${formattedDate}. Please make the payment to avoid service interruption.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return false;
  }
};
