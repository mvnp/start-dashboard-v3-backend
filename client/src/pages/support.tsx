import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Users,
  MessageSquare,
  Headphones
} from "lucide-react";
import { TranslatableText } from "@/components/translatable-text";

const supportFormSchema = z.object({
  name: z.string().min(2, <TranslatableText>Name must be at least 2 characters</TranslatableText>),
  email: z.string().email(<TranslatableText>Please enter a valid email address</TranslatableText>),
  phone: z.string().min(10, <TranslatableText>Please enter a valid phone number</TranslatableText>),
  urgency: z.string().min(1, <TranslatableText>Please select problem urgency</TranslatableText>),
  subject: z.string().min(5, <TranslatableText>Subject must be at least 5 characters</TranslatableText>),
  description: z.string().min(20, <TranslatableText>Please provide a detailed description (minimum 20 characters)</TranslatableText>)
});

type SupportFormData = z.infer<typeof supportFormSchema>;

export default function Support() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      urgency: "",
      subject: "",
      description: ""
    }
  });

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Support request submitted",
        description: "We'll get back to you within 24 hours based on your urgency level.",
      });
      form.reset();
    }, 1500);
  };

  const urgencyOptions = [
    { value: "low", label: "Low - General inquiry", color: "text-green-600" },
    { value: "medium", label: "Medium - Issue affecting work", color: "text-yellow-600" },
    { value: "high", label: "High - Business critical", color: "text-orange-600" },
    { value: "urgent", label: "Urgent - System down", color: "text-red-600" }
  ];

  const supportStats = [
    { icon: Clock, label: "Average Response", value: "< 2 hours", color: "bg-blue-500" },
    { icon: Users, label: "Support Team", value: "24/7", color: "bg-green-500" },
    { icon: MessageSquare, label: "Tickets Resolved", value: "98.5%", color: "bg-purple-500" },
    { icon: Headphones, label: "Satisfaction Rate", value: "4.9/5", color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Company Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-barber-primary rounded-xl flex items-center justify-center mr-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">BarberPro</h1>
                  <p className="text-lg text-slate-600">Professional Barbershop Management</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-5 h-5 text-barber-primary mr-3" />
                  <span>123 Business Avenue, Suite 500, New York, NY 10001</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-5 h-5 text-barber-primary mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Mail className="w-5 h-5 text-barber-primary mr-3" />
                  <span>support@barberpro.com</span>
                </div>
              </div>
            </div>

            {/* Support Stats */}
            <div className="grid grid-cols-2 gap-4">
              {supportStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mr-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Support Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            How can we help you today?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get the support you need from our expert team. We're here to help entrepreneurs and collaborators succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="w-6 h-6 text-barber-primary mr-2" />
                  Support Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                  <p className="text-slate-600 text-sm mb-2">For general inquiries and documentation</p>
                  <a href="mailto:support@barberpro.com" className="text-barber-primary hover:underline">
                    support@barberpro.com
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
                  <p className="text-slate-600 text-sm mb-2">For urgent issues and live assistance</p>
                  <a href="tel:+15551234567" className="text-barber-primary hover:underline">
                    +1 (555) 123-4567
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Available 24/7</p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Business Hours</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Monday - Friday: 8:00 AM - 8:00 PM EST</div>
                    <div>Saturday: 9:00 AM - 5:00 PM EST</div>
                    <div>Sunday: 10:00 AM - 4:00 PM EST</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Emergency Support</h4>
                  <p className="text-sm text-blue-700">
                    For system outages or critical issues affecting your business operations, 
                    call our emergency line available 24/7.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <p className="text-slate-600">
                  Fill out the form below and our support team will get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="urgency">Problem Urgency *</Label>
                      <Select onValueChange={(value) => form.setValue("urgency", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          {urgencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <span className={option.color}>{option.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.urgency && (
                        <p className="text-red-600 text-sm mt-1">{form.formState.errors.urgency.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      {...form.register("subject")}
                      placeholder="Brief description of your issue"
                      className="mt-1"
                    />
                    {form.formState.errors.subject && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Problem Description *</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      placeholder="Please provide detailed information about the issue you're experiencing. Include any error messages, steps to reproduce, and your browser/device information if relevant."
                      rows={6}
                      className="mt-1"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-600 text-sm mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Before submitting:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Check our FAQ section for common issues</li>
                      <li>• Include relevant screenshots or error messages</li>
                      <li>• Provide your account details or barbershop information</li>
                      <li>• Mention your operating system and browser version</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-barber-primary hover:bg-barber-secondary"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Support Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How do I reset my password?</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Click on "Forgot Password" on the login page and follow the instructions sent to your email.
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2">Can I export my appointment data?</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Yes, you can export your data from the Reports section in CSV or PDF format.
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2">How do I add new staff members?</h3>
                  <p className="text-slate-600 text-sm">
                    Navigate to Staff Management and click "Add New Staff" to create profiles for your team.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    We accept all major credit cards, PayPal, and bank transfers for subscription payments.
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2">Is my data secure?</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Yes, we use enterprise-grade encryption and security measures to protect your business data.
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2">Can I cancel my subscription anytime?</h3>
                  <p className="text-slate-600 text-sm">
                    Yes, you can cancel your subscription at any time from your account settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}