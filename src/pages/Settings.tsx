import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useSMS } from '@/contexts/SMSContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { 
    preferences, 
    updatePreferences,
    sendPriceAlert,
    sendOTP,
    sendTransactionConfirmation,
    sendBrokerConnectionRequest,
    sendPaymentReminder
  } = useSMS();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would update the user's settings via an API
      console.log('Updated settings:', { ...formData, preferences });
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };
  
  const handleTestSMS = async () => {
    if (!testMessage.trim()) {
      setTestResult({ success: false, message: 'Please enter a test message' });
      return;
    }
    
    try {
      // Use the sendOTP function as a general test message sender
      const success = await sendOTP(testMessage);
      
      if (success) {
        setTestResult({ 
          success: true, 
          message: 'Test SMS sent successfully! Please check your phone.' 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: 'Failed to send test SMS. Please check your phone number and try again.' 
        });
      }
    } catch (error) {
      console.error('Error sending test SMS:', error);
      setTestResult({ 
        success: false, 
        message: 'An error occurred while sending the test SMS.' 
      });
    }
    
    // Clear the test message
    setTestMessage('');
    
    // Clear the result after 5 seconds
    setTimeout(() => setTestResult(null), 5000);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        {showSuccess && (
          <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
            <CheckCircle className="h-5 w-5" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account's profile information and email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">SMS Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priceAlerts">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when crop prices change</p>
                  </div>
                  <Switch
                    id="priceAlerts"
                    checked={preferences.priceAlerts}
                    onCheckedChange={(checked) => 
                      updatePreferences({ priceAlerts: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified about your transactions</p>
                  </div>
                  <Switch
                    id="transactionAlerts"
                    checked={preferences.transactionAlerts}
                    onCheckedChange={(checked) => 
                      updatePreferences({ transactionAlerts: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="connectionRequests">Connection Requests</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new connection requests</p>
                  </div>
                  <Switch
                    id="connectionRequests"
                    checked={preferences.connectionRequests}
                    onCheckedChange={(checked) => 
                      updatePreferences({ connectionRequests: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentReminders">Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders for upcoming payments</p>
                  </div>
                  <Switch
                    id="paymentReminders"
                    checked={preferences.paymentReminders}
                    onCheckedChange={(checked) => 
                      updatePreferences({ paymentReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing">Marketing Messages</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => 
                      updatePreferences({ marketing: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="text-lg font-medium mb-4">Test SMS Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter a test message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleTestSMS}
                    disabled={!user?.phoneNumber}
                  >
                    Send Test SMS
                  </Button>
                </div>
                {testResult && (
                  <Alert variant={testResult.success ? 'default' : 'destructive'}>
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Info className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {testResult.success ? 'Success!' : 'Error'}
                    </AlertTitle>
                    <AlertDescription>
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
                {!user?.phoneNumber && (
                  <p className="text-sm text-yellow-600">
                    Please add a phone number to test SMS notifications.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
