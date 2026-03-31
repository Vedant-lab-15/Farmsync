import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. A password reset link will be sent to your registered email address.'
  },
  {
    question: 'How do I update my profile information?',
    answer: 'You can update your profile information by going to the Settings page from the sidebar menu and editing the relevant fields.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can contact our support team by filling out the contact form on this page or by emailing support@farmsync.in.'
  },
  {
    question: 'How do I set up price alerts?',
    answer: 'Navigate to the Market Prices section and click on the "Set Alert" button next to any crop to set up price alerts.'
  },
  {
    question: 'How do I find brokers in my area?',
    answer: 'Go to the Brokers section to find and connect with brokers in your area. You can filter by location and rating.'
  },
];

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form to a support API
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're here to help. Find answers to common questions or contact our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle>FAQ</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse our frequently asked questions to find quick answers to common questions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <CardTitle>Email Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Send us an email at <a href="mailto:support@farmsync.in" className="text-primary hover:underline">support@farmsync.in</a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-primary" />
              <CardTitle>Call Us</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Call our support team at <a href="tel:+18005551234" className="text-primary hover:underline">+1 (800) 555-1234</a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">Available Monday to Friday, 9 AM to 5 PM EST</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Message sent successfully!</h3>
                      <p className="mt-1 text-sm text-green-700">We've received your message and will get back to you soon.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
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
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit">Send Message</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Browse through our most common questions and answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-medium mb-1">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-700">Emergency Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800 mb-3">
                For urgent issues requiring immediate assistance, please call our emergency support line:
              </p>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-yellow-700 mr-2" />
                <a href="tel:+18005559999" className="font-medium text-yellow-800 hover:underline">
                  +1 (800) 555-9999
                </a>
              </div>
              <p className="text-xs text-yellow-700 mt-2">24/7 Emergency Support</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
