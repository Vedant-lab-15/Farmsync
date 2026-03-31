import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useSMS } from '@/contexts/SMSContext';
import { apiFetch } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, Loader2 } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences, sendOTP } = useSMS();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestSending, setIsTestSending] = useState(false);

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phoneNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save settings');

      // Update local storage with new name
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...parsed, name: formData.name }));
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSMS = async () => {
    if (!testMessage.trim()) {
      setTestResult({ success: false, message: 'Please enter a test message' });
      return;
    }
    setIsTestSending(true);
    try {
      const success = await sendOTP(testMessage);
      setTestResult({
        success,
        message: success
          ? 'Test SMS sent successfully! Check your phone.'
          : 'Failed to send. Check your phone number and try again.',
      });
    } catch {
      setTestResult({ success: false, message: 'An error occurred while sending.' });
    } finally {
      setIsTestSending(false);
      setTestMessage('');
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const handleDeleteAccount = () => {
    // In production: call DELETE /api/users/me, then logout
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      logout();
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        {showSuccess && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md text-sm">
            <CheckCircle className="h-4 w-4" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Changes are saved to your account immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {saveError && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{saveError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SMS Notification Preferences</CardTitle>
          <CardDescription>Control which notifications you receive via SMS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'priceAlerts' as const, label: 'Price Alerts', desc: 'Receive alerts when crop prices change' },
            { key: 'transactionAlerts' as const, label: 'Transaction Alerts', desc: 'Get notified about your transactions' },
            { key: 'connectionRequests' as const, label: 'Connection Requests', desc: 'Get notified about new connection requests' },
            { key: 'paymentReminders' as const, label: 'Payment Reminders', desc: 'Get reminders for upcoming payments' },
            { key: 'marketing' as const, label: 'Marketing Messages', desc: 'Receive promotional offers and updates' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <Label htmlFor={key}>{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                id={key}
                checked={preferences[key]}
                onCheckedChange={(checked) => updatePreferences({ [key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test SMS</CardTitle>
          <CardDescription>Send a test message to verify your SMS setup.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a test message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              disabled={!user?.phoneNumber || isTestSending}
            />
            <Button
              type="button"
              onClick={handleTestSMS}
              disabled={!user?.phoneNumber || isTestSending}
            >
              {isTestSending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </div>
          {!user?.phoneNumber && (
            <p className="text-sm text-yellow-600">Add a phone number above to test SMS.</p>
          )}
          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Info className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? 'Sent!' : 'Failed'}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
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
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
