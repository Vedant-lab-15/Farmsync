import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSMS } from '@/contexts/SMSContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import RouteOptimizer from '@/components/RouteOptimizer';
import { OTPVerificationDialog } from '@/components/OTPVerificationDialog';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const crops = [
  { id: 'tomato', name: 'Tomato' },
  { id: 'onion', name: 'Onion' },
  { id: 'potato', name: 'Potato' },
  { id: 'cabbage', name: 'Cabbage' },
  { id: 'wheat', name: 'Wheat' },
  { id: 'mango', name: 'Mango' },
  { id: 'rice', name: 'Rice' },
];

const districts = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
];

const communicationPreferences = [
  { id: 'sms', label: 'SMS' },
  { id: 'voice', label: 'Voice Call' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'app_notification', label: 'In-App Notifications' },
];

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  email: z.string().email('Please enter a valid email address.'),
  address: z.string().min(10, 'Please enter your complete address.'),
  district: z.string({ required_error: 'Please select your district.' }),
  taluka: z.string().min(2, 'Please enter your taluka.'),
  village: z.string().min(2, 'Please enter your village.'),
  pincode: z.string().min(6, 'Please enter a valid pincode.'),
  crops: z.array(z.string()).refine((v) => v.length > 0, 'Please select at least one crop.'),
  landArea: z.string().min(1, 'Please enter your land area.'),
  communicationPreferences: z.array(z.string()).min(1, 'Please select at least one preference.'),
  languagePreference: z.string({ required_error: 'Please select your preferred language.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function FarmerProfile() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendOTP } = useSMS();
  const { user } = useAuth();

  // OTP dialog state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [pendingOtp, setPendingOtp] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  // Store form values while waiting for OTP
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      email: user?.email || '',
      address: '',
      district: '',
      taluka: '',
      village: '',
      pincode: '',
      landArea: '',
      crops: [],
      communicationPreferences: ['sms', 'app_notification'],
      languagePreference: 'marathi',
    },
  });

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendVerification = async (phone: string): Promise<string | null> => {
    const code = generateOTP();
    const success = await sendOTP(code);
    if (!success) {
      toast({ title: 'Error', description: 'Failed to send verification code.', variant: 'destructive' });
      return null;
    }
    toast({ title: 'Code sent', description: `A 6-digit code was sent to ${phone}` });
    return code;
  };

  const saveProfile = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: values.fullName,
          phone: values.phoneNumber,
          location: `${values.village}, ${values.taluka}, ${values.district}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      toast({
        title: 'Profile updated',
        description: 'Your farmer profile has been saved successfully.',
      });
      setOtpVerified(false);
      setPendingValues(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const phoneChanged = values.phoneNumber !== user?.phoneNumber;

    if (phoneChanged && !otpVerified) {
      // Need to verify new phone first
      setPendingValues(values);
      setPendingPhone(values.phoneNumber);
      const code = await sendVerification(values.phoneNumber);
      if (!code) return;
      setPendingOtp(code);
      setOtpDialogOpen(true);
      return;
    }

    await saveProfile(values);
  };

  const handleOtpVerify = async (enteredCode: string) => {
    if (enteredCode !== pendingOtp) {
      toast({ title: 'Invalid code', description: 'The code you entered is incorrect.', variant: 'destructive' });
      return;
    }
    setOtpVerified(true);
    setOtpDialogOpen(false);
    if (pendingValues) {
      await saveProfile(pendingValues);
    }
  };

  const handleOtpResend = async () => {
    const code = await sendVerification(pendingPhone);
    if (code) setPendingOtp(code);
  };

  const phoneChanged = form.watch('phoneNumber') !== user?.phoneNumber;

  return (
    <div className="container mx-auto py-8 px-4">
      <OTPVerificationDialog
        open={otpDialogOpen}
        phoneNumber={pendingPhone}
        onVerify={handleOtpVerify}
        onCancel={() => { setOtpDialogOpen(false); setPendingValues(null); }}
        onResend={handleOtpResend}
      />

      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Profile</h1>
          <p className="text-muted-foreground">
            Update your personal and farm details to get the best recommendations.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormDescription>
                          {phoneChanged && !otpVerified
                            ? '⚠️ New number — you\'ll be asked to verify before saving.'
                            : otpVerified
                            ? '✅ Phone number verified.'
                            : 'We\'ll use this to send you important updates.'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languagePreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                            <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your complete address" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((d) => (
                              <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="taluka" render={({ field }) => (
                    <FormItem><FormLabel>Taluka</FormLabel><FormControl><Input placeholder="Enter taluka" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="village" render={({ field }) => (
                    <FormItem><FormLabel>Village</FormLabel><FormControl><Input placeholder="Enter village" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input type="number" placeholder="Pincode" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farm Details</CardTitle>
                <CardDescription>Tell us about your farm and crops.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="crops"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Crops Grown</FormLabel>
                        <FormDescription>Select all the crops you grow on your farm</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {crops.map((crop) => (
                          <FormField
                            key={crop.id}
                            control={form.control}
                            name="crops"
                            render={({ field }) => (
                              <FormItem key={crop.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(crop.id)}
                                    onCheckedChange={(checked) =>
                                      field.onChange(
                                        checked
                                          ? [...field.value, crop.id]
                                          : field.value.filter((v) => v !== crop.id)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{crop.name}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landArea"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Total Land Area</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" placeholder="0" {...field} className="pl-16" />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">acres</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>How would you like to receive updates?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="communicationPreferences"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {communicationPreferences.map((pref) => (
                          <FormField
                            key={pref.id}
                            control={form.control}
                            name="communicationPreferences"
                            render={({ field }) => (
                              <FormItem key={pref.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(pref.id)}
                                    onCheckedChange={(checked) =>
                                      field.onChange(
                                        checked
                                          ? [...field.value, pref.id]
                                          : field.value.filter((v) => v !== pref.id)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{pref.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <RouteOptimizer />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
