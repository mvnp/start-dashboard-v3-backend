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
        title: <TranslatableText>Support request submitted</TranslatableText>,
        description: <TranslatableText>We'll get back to you within 24 hours based on your urgency level.</TranslatableText>,
      });
      form.reset();
    }, 1500);
  };

  const urgencyOptions = [
    { value: "low", label: <TranslatableText>Low - General inquiry</TranslatableText>, color: "text-green-600" },
    { value: "medium", label: <TranslatableText>Medium - Issue affecting work</TranslatableText>, color: "text-yellow-600" },
    { value: "high", label: <TranslatableText>High - Business critical</TranslatableText>, color: "text-orange-600" },
    { value: "urgent", label: <TranslatableText>Urgent - System down</TranslatableText>, color: "text-red-600" }
  ];

  const supportStats = [
    { icon: Clock, label: <TranslatableText>Average Response</TranslatableText>, value: "< 2 hours", color: "bg-blue-500" },
    { icon: Users, label: <TranslatableText>Support Team</TranslatableText>, value: "24/7", color: "bg-green-500" },
    { icon: MessageSquare, label: <TranslatableText>Tickets Resolved</TranslatableText>, value: "98.5%", color: "bg-purple-500" },
    { icon: Headphones, label: <TranslatableText>Satisfaction Rate</TranslatableText>, value: "4.9/5", color: "bg-orange-500" }
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
                  <h1 className="text-3xl font-bold text-slate-900"><TranslatableText>BarberPro</TranslatableText></h1>
                  <p className="text-lg text-slate-600"><TranslatableText>Professional Barbershop Management</TranslatableText></p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-slate-700">
                  <MapPin className="w-5 h-5 text-barber-primary mr-3" />
                  <span><TranslatableText>123 Business Avenue, Suite 500, New York, NY 10001</TranslatableText></span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Phone className="w-5 h-5 text-barber-primary mr-3" />
                  <span><TranslatableText>+1 (555) 123-4567</TranslatableText></span>
                </div>
                <div className="flex items-center text-slate-700">
                  <Mail className="w-5 h-5 text-barber-primary mr-3" />
                  <span><TranslatableText>support@barberpro.com</TranslatableText></span>
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
            <TranslatableText>How can we help you today?</TranslatableText>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            <TranslatableText>Get the support you need from our expert team. We're here to help entrepreneurs and collaborators succeed.</TranslatableText>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="w-6 h-6 text-barber-primary mr-2" />
                  <TranslatableText>Support Channels</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Email Support</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-2"><TranslatableText>For general inquiries and documentation</TranslatableText></p>
                  <a href="mailto:support@barberpro.com" className="text-barber-primary hover:underline">
                    <TranslatableText>support@barberpro.com</TranslatableText>
                  </a>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Phone Support</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-2"><TranslatableText>For urgent issues and live assistance</TranslatableText></p>
                  <a href="tel:+15551234567" className="text-barber-primary hover:underline">
                    <TranslatableText>+1 (555) 123-4567</TranslatableText>
                  </a>
                  <p className="text-xs text-slate-500 mt-1"><TranslatableText>Available 24/7</TranslatableText></p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Business Hours</TranslatableText></h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div><TranslatableText>Monday - Friday: 8:00 AM - 8:00 PM EST</TranslatableText></div>
                    <div><TranslatableText>Saturday: 9:00 AM - 5:00 PM EST</TranslatableText></div>
                    <div><TranslatableText>Sunday: 10:00 AM - 4:00 PM EST</TranslatableText></div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2"><TranslatableText>Emergency Support</TranslatableText></h4>
                  <p className="text-sm text-blue-700">
                    <TranslatableText>For system outages or critical issues affecting your business operations, </TranslatableText>
                    <TranslatableText>call our emergency line available 24/7.</TranslatableText>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle><TranslatableText>Submit a Support Request</TranslatableText></CardTitle>
                <p className="text-slate-600">
                  <TranslatableText>Fill out the form below and our support team will get back to you as soon as possible.</TranslatableText>
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name"><TranslatableText>Full Name *</TranslatableText></Label>
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
                      <Label htmlFor="email"><TranslatableText>Email Address *</TranslatableText></Label>
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
                      <Label htmlFor="phone"><TranslatableText>Phone Number *</TranslatableText></Label>
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
                      <Label htmlFor="urgency"><TranslatableText>Problem Urgency *</TranslatableText></Label>
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
                    <Label htmlFor="subject"><TranslatableText>Subject *</TranslatableText></Label>
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
                    <Label htmlFor="description"><TranslatableText>Problem Description *</TranslatableText></Label>
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
                    <h4 className="font-medium text-yellow-800 mb-2"><TranslatableText>Before submitting:</TranslatableText></h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li><TranslatableText>• Check our FAQ section for common issues</TranslatableText></li>
                      <li><TranslatableText>• Include relevant screenshots or error messages</TranslatableText></li>
                      <li><TranslatableText>• Provide your account details or barbershop information</TranslatableText></li>
                      <li><TranslatableText>• Mention your operating system and browser version</TranslatableText></li>
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
              <CardTitle><TranslatableText>Frequently Asked Questions</TranslatableText></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>How do I reset my password?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-4">
                    <TranslatableText>Click on "Forgot Password" on the login page and follow the instructions sent to your email.</TranslatableText>
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Can I export my appointment data?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-4">
                    <TranslatableText>Yes, you can export your data from the Reports section in CSV or PDF format.</TranslatableText>
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>How do I add new staff members?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm">
                    <TranslatableText>Navigate to Staff Management and click "Add New Staff" to create profiles for your team.</TranslatableText>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>What payment methods do you accept?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-4">
                    <TranslatableText>We accept all major credit cards, PayPal, and bank transfers for subscription payments.</TranslatableText>
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Is my data secure?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm mb-4">
                    <TranslatableText>Yes, we use enterprise-grade encryption and security measures to protect your business data.</TranslatableText>
                  </p>

                  <h3 className="font-semibold text-slate-900 mb-2"><TranslatableText>Can I cancel my subscription anytime?</TranslatableText></h3>
                  <p className="text-slate-600 text-sm">
                    <TranslatableText>Yes, you can cancel your subscription at any time from your account settings.</TranslatableText>
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