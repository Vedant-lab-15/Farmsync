import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSMS } from "@/contexts/SMSContext";
import { useAuth } from "@/contexts/AuthContext";
import RouteOptimizer from "@/components/RouteOptimizer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const crops = [
  { id: "tomato", name: "Tomato" },
  { id: "onion", name: "Onion" },
  { id: "potato", name: "Potato" },
  { id: "cabbage", name: "Cabbage" },
  { id: "wheat", name: "Wheat" },
];

const districts = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
  "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
  "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
  "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const communicationPreferences = [
  { id: "sms", label: "SMS" },
  { id: "voice", label: "Voice Call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "app_notification", label: "In-App Notifications" },
];

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(10, {
    message: "Please enter your complete address.",
  }),
  district: z.string({
    required_error: "Please select your district.",
  }),
  taluka: z.string().min(2, {
    message: "Please enter your taluka.",
  }),
  village: z.string().min(2, {
    message: "Please enter your village.",
  }),
  pincode: z.string().min(6, {
    message: "Please enter a valid pincode.",
  }),
  crops: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one crop.",
  }),
  landArea: z.string().min(1, {
    message: "Please enter your land area.",
  }),
  communicationPreferences: z.array(z.string()).min(1, {
    message: "Please select at least one communication preference.",
  }),
  languagePreference: z.string({
    required_error: "Please select your preferred language.",
  }),
});

export default function FarmerProfile() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendOTP } = useSMS();
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
      address: "",
      district: "",
      pincode: "",
      landArea: "",
      crops: [],
      communicationPreferences: ["sms", "app_notification"],
      languagePreference: "marathi",
    },
  });

  // Generate a 6-digit verification code
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Handle sending verification code
  const handleSendVerification = async (phoneNumber: string) => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Phone number is required for verification",
        variant: "destructive",
      });
      return false;
    }

    try {
      const code = generateVerificationCode();
      setVerificationCode(code);
      
      const success = await sendOTP(code);
      
      if (success) {
        setShowVerification(true);
        toast({
          title: "Verification code sent",
          description: `A 6-digit code has been sent to ${phoneNumber}`,
        });
        return true;
      } else {
        throw new Error("Failed to send verification code");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Check if phone number was changed and needs verification
      if (values.phoneNumber !== user?.phoneNumber) {
        const codeSent = await handleSendVerification(values.phoneNumber);
        if (!codeSent) return;
        
        // Wait for user to enter the verification code
        const isVerified = await new Promise<boolean>((resolve) => {
          const enteredCode = prompt('Enter the 6-digit verification code sent to your phone:');
          
          if (enteredCode === verificationCode) {
            resolve(true);
          } else {
            toast({
              title: "Invalid code",
              description: "The verification code you entered is incorrect. Please try again.",
              variant: "destructive",
            });
            resolve(false);
          }
        });
        
        if (!isVerified) {
          toast({
            title: "Verification required",
            description: "Please verify your new phone number to continue.",
            variant: "destructive",
          });
          return;
        }
      }
      
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send confirmation SMS if SMS notifications are enabled
      if (values.communicationPreferences?.includes('sms') && values.phoneNumber) {
        try {
          await sendOTP("update"); // Using sendOTP as a generic SMS sender for this example
        } catch (error) {
          console.error("Failed to send confirmation SMS:", error);
          // Don't fail the form submission if SMS fails
        }
      }
      
      toast({
        title: "Profile updated successfully",
        description: values.communicationPreferences?.includes('sms')
          ? "A confirmation has been sent to your phone."
          : "Your farmer profile has been updated.",
      });
      
      // Reset verification state
      setShowVerification(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
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
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder="+91 9876543210" 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          {field.value && field.value !== user?.phoneNumber && (
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => handleSendVerification(field.value)}
                              disabled={isSubmitting || showVerification}
                            >
                              {showVerification ? "Code Sent" : "Verify"}
                            </Button>
                          )}
                        </div>
                        <FormDescription>
                          We'll use this to send you important updates. {showVerification && "Check your phone for the verification code."}
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
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preferred language" />
                            </SelectTrigger>
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
                        <Textarea
                          placeholder="Enter your complete address"
                          className="resize-none"
                          {...field}
                        />
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
                            <SelectTrigger>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district} value={district.toLowerCase()}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taluka"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taluka</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your taluka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="village"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Village</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your village" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <FormDescription>
                          Select all the crops you grow on your farm
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {crops.map((crop) => (
                          <FormField
                            key={crop.id}
                            control={form.control}
                            name="crops"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={crop.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(crop.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, crop.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== crop.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {crop.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="landArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Land Area (acres)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Enter land area"
                              {...field}
                              className="pl-20"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              acres
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  How would you like to receive updates and notifications?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="communicationPreferences"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Notification Methods</FormLabel>
                        <FormDescription>
                          Select how you'd like to receive updates
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {communicationPreferences.map((pref) => (
                          <FormField
                            key={pref.id}
                            control={form.control}
                            name="communicationPreferences"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={pref.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(pref.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, pref.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== pref.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {pref.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Route Optimization Section */}
            <RouteOptimizer />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
              <div className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || (form.watch('phoneNumber') !== user?.phoneNumber && !showVerification)}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
                {form.watch('phoneNumber') !== user?.phoneNumber && !showVerification && (
                  <p className="text-sm text-yellow-600">
                    Please verify your new phone number before saving.
                  </p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
