import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, MessageCircle, QrCode, Wifi, WifiOff, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertWhatsappInstanceSchema, type WhatsappInstance } from "@shared/schema";
import { TranslatableText } from "@/components/translatable-text";
import { z } from "zod";

interface WhatsappInstanceFormData {
  name: string;
  phone_number: string;
  webhook_url?: string;
}

const formSchema = insertWhatsappInstanceSchema;

export default function WhatsappForm() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/whatsapp/:id/edit");
  const [createMatch] = useRoute("/whatsapp/new");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const instanceId = params?.id ? parseInt(params.id) : null;
  const isEditing = !!match;
  const isCreating = !!createMatch;

  const form = useForm<WhatsappInstanceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      webhook_url: ""
    }
  });

  // Load instance data for editing
  const { data: instance } = useQuery({
    queryKey: ["/api/whatsapp-instances", instanceId],
    enabled: !isCreating && !!instanceId,
    select: (data: WhatsappInstance) => data,
  });

  // Update form when instance data is loaded
  useEffect(() => {
    if (instance) {
      form.reset({
        name: instance.name,
        phone_number: instance.phone_number,
        webhook_url: instance.webhook_url || ""
      });
      setQrCode(instance.qr_code);
      setIsConnecting(instance.status === "connecting");
    }
  }, [instance, form]);

  const createMutation = useMutation({
    mutationFn: (data: WhatsappInstanceFormData) => apiRequest("POST", "/api/whatsapp-instances", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances"] });
      toast({
        title: <TranslatableText>Instance created</TranslatableText>,
        description: <TranslatableText>The WhatsApp instance has been successfully created.</TranslatableText>,
      });
      setLocation("/whatsapp");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to create the WhatsApp instance. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: WhatsappInstanceFormData) => apiRequest("PUT", `/api/whatsapp-instances/${instanceId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances", instanceId] });
      toast({
        title: <TranslatableText>Instance updated</TranslatableText>,
        description: <TranslatableText>The WhatsApp instance has been successfully updated.</TranslatableText>,
      });
      setLocation("/whatsapp");
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to update the WhatsApp instance. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const generateQrMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/whatsapp-instances/${id}/generate-qr`);
      return response as { qr_code: string };
    },
    onSuccess: (data: { qr_code: string }) => {
      setQrCode(data.qr_code);
      setIsConnecting(true);
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances", instanceId] });
      toast({
        title: <TranslatableText>QR Code generated</TranslatableText>,
        description: <TranslatableText>QR code has been generated. Please scan it with your phone to connect.</TranslatableText>,
      });
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to generate QR code. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const connectMutation = useMutation({
    mutationFn: ({ id, sessionId }: { id: number; sessionId: string }) => 
      apiRequest("POST", `/api/whatsapp-instances/${id}/connect`, { session_id: sessionId }),
    onSuccess: () => {
      setQrCode(null);
      setIsConnecting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances"] });
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp-instances", instanceId] });
      toast({
        title: <TranslatableText>Instance connected</TranslatableText>,
        description: <TranslatableText>WhatsApp instance has been successfully connected.</TranslatableText>,
      });
    },
    onError: () => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: <TranslatableText>Failed to connect the instance. Please try again.</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WhatsappInstanceFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleGenerateQr = () => {
    if (instanceId) {
      generateQrMutation.mutate(instanceId);
    }
  };

  const handleConnect = () => {
    if (instanceId) {
      // Simulate successful connection (in real implementation, this would come from WhatsApp webhook)
      const sessionId = `session_${Date.now()}`;
      connectMutation.mutate({ id: instanceId, sessionId });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/whatsapp")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <TranslatableText>Back to WhatsApp Instances</TranslatableText>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditing ? <TranslatableText>Edit WhatsApp Instance</TranslatableText> : <TranslatableText>New WhatsApp Instance</TranslatableText>}
        </h1>
        <p className="text-slate-600">
          {isEditing ? <TranslatableText>Update instance details</TranslatableText> : <TranslatableText>Create a new WhatsApp business instance</TranslatableText>}
        </p>
        </div>
      </div>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle><TranslatableText>Instance Details</TranslatableText></CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Instance Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Instance Name *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Main Business WhatsApp"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Phone Number *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., +1234567890"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-slate-500">
                        <TranslatableText>Include country code (e.g., +1 for US, +55 for Brazil)</TranslatableText>
                        
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Webhook URL */}
                <FormField
                  control={form.control}
                  name="webhook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Webhook URL</TranslatableText></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://yourapi.com/webhook"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-slate-500">
                        Optional: URL to receive WhatsApp messages and events
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation("/whatsapp")}
                  >
    <TranslatableText>Cancel</TranslatableText>
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    <TranslatableText>
                      {isPending ? "Saving..." : isEditing ? "Update Instance" : "Create Instance"}
                    </TranslatableText>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Connection Status Card */}
        {isEditing && instance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Status */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50">
                  {instance.status === "connected" && <Wifi className="w-5 h-5 text-green-500" />}
                  {instance.status === "connecting" && <QrCode className="w-5 h-5 text-yellow-500" />}
                  {instance.status === "disconnected" && <WifiOff className="w-5 h-5 text-red-500" />}
                  <div>
                    <p className="font-medium capitalize">{instance.status}</p>
                    <p className="text-sm text-slate-600">
                      {instance.status === "connected" && "Instance is connected and ready"}
                      {instance.status === "connecting" && "Waiting for QR code scan"}
                      {instance.status === "disconnected" && "Instance needs to be connected"}
                    </p>
                  </div>
                </div>

                {/* Connection Actions */}
                {instance.status === "disconnected" && (
                  <Button 
                    onClick={handleGenerateQr}
                    disabled={generateQrMutation.isPending}
                    className="w-full"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {generateQrMutation.isPending ? "Generating..." : "Generate QR Code"}
                  </Button>
                )}

                {/* QR Code Display */}
                {(qrCode || instance.qr_code) && isConnecting && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-medium text-yellow-800">Scan QR Code</h4>
                      </div>
                      <p className="text-sm text-yellow-700 mb-4">
                        Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, 
                        and scan this QR code.
                      </p>
                      <div className="bg-white p-6 rounded border text-center">
                        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">QR Code</p>
                            <code className="text-xs text-gray-500 break-all mt-2 block">
                              {qrCode || instance.qr_code}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleConnect}
                      disabled={connectMutation.isPending}
                      variant="outline"
                      className="w-full"
                    >
                      {connectMutation.isPending ? "Connecting..." : "Simulate Connection"}
                    </Button>
                  </div>
                )}

                {/* Last Seen */}
                {instance.last_seen && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-600">
                      <strong>Last seen:</strong> {new Date(instance.last_seen).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>WhatsApp Instance Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <strong>1. Create Instance:</strong> Fill in the instance name and phone number. The phone number should include the country code.
            </div>
            <div>
              <strong>2. Generate QR Code:</strong> After creating the instance, click "Generate QR Code" to start the connection process.
            </div>
            <div>
              <strong>3. Scan QR Code:</strong> Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device, and scan the generated QR code.
            </div>
            <div>
              <strong>4. Webhook URL:</strong> Optional field where you can specify a URL to receive WhatsApp messages and events for this instance.
            </div>
            <div>
              <strong>5. Connection Status:</strong> Monitor the connection status. Once connected, your instance will be ready to send and receive messages.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}