import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AccountingTransaction, Staff, Client } from "@shared/schema";
import { ArrowLeft, Save, DollarSign } from "lucide-react";

const accountingFormSchema = z.object({
  type: z.enum(["revenue", "expense"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  payment_method: z.string().min(1, "Payment method is required"),
  reference_number: z.string().optional(),
  client_id: z.number().optional(),
  staff_id: z.number().optional(),
  transaction_date: z.string().min(1, "Transaction date is required"),
  notes: z.string().optional(),
  is_recurring: z.boolean().default(false)
});

interface AccountingFormData {
  type: "revenue" | "expense";
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  reference_number?: string;
  client_id?: number;
  staff_id?: number;
  transaction_date: string;
  notes?: string;
  is_recurring: boolean;
}

export default function AccountingForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const transactionId = params.id ? parseInt(params.id) : null;
  const isEditing = !!transactionId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AccountingFormData>({
    resolver: zodResolver(accountingFormSchema),
    defaultValues: {
      type: "revenue",
      category: "",
      description: "",
      amount: 0,
      payment_method: "",
      reference_number: "",
      client_id: undefined,
      staff_id: undefined,
      transaction_date: new Date().toISOString().split('T')[0],
      notes: "",
      is_recurring: false
    }
  });

  // Load transaction data for editing
  const { data: transaction } = useQuery({
    queryKey: ["/api/accounting-transactions", transactionId],
    enabled: isEditing,
    select: (data: AccountingTransaction) => data,
  });

  // Load staff and clients for dropdowns
  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
    select: (data: Staff[]) => data,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    select: (data: Client[]) => data,
  });

  // Populate form when editing
  useEffect(() => {
    if (transaction && isEditing) {
      form.reset({
        type: transaction.type as "revenue" | "expense",
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount / 100, // Convert from cents to dollars
        payment_method: transaction.payment_method,
        reference_number: transaction.reference_number || "",
        client_id: transaction.client_id || undefined,
        staff_id: transaction.staff_id || undefined,
        transaction_date: transaction.transaction_date,
        notes: transaction.notes || "",
        is_recurring: transaction.is_recurring
      });
    }
  }, [transaction, isEditing, form]);

  const createMutation = useMutation({
    mutationFn: (data: AccountingFormData) => {
      const payload = {
        ...data,
        amount: Math.round(data.amount * 100), // Convert to cents
        client_id: data.client_id || null,
        staff_id: data.staff_id || null,
        reference_number: data.reference_number || null,
        notes: data.notes || null
      };
      return apiRequest("POST", "/api/accounting-transactions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: "Transaction created",
        description: "The accounting transaction has been successfully created.",
      });
      setLocation("/accounting");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create the transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AccountingFormData) => {
      const payload = {
        ...data,
        amount: Math.round(data.amount * 100), // Convert to cents
        client_id: data.client_id || null,
        staff_id: data.staff_id || null,
        reference_number: data.reference_number || null,
        notes: data.notes || null
      };
      return apiRequest("PUT", `/api/accounting-transactions/${transactionId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: "Transaction updated",
        description: "The accounting transaction has been successfully updated.",
      });
      setLocation("/accounting");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AccountingFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Predefined categories
  const revenueCategories = [
    "Haircut Services",
    "Beard Services", 
    "Special Services",
    "Product Sales",
    "Gift Cards",
    "Membership Fees",
    "Other Revenue"
  ];

  const expenseCategories = [
    "Rent",
    "Utilities",
    "Supplies",
    "Equipment",
    "Marketing",
    "Insurance",
    "Professional Services",
    "Staff Salaries",
    "Maintenance",
    "Other Expenses"
  ];

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Check",
    "Digital Wallet",
    "Other"
  ];

  const selectedType = form.watch("type");
  const categories = selectedType === "revenue" ? revenueCategories : expenseCategories;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/accounting")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Accounting
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEditing ? "Edit Transaction" : "New Transaction"}
            </h1>
            <p className="text-slate-600">
              {isEditing ? "Update transaction details" : "Add a new revenue or expense transaction"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="type">Transaction Type *</Label>
                <Select 
                  value={form.watch("type")} 
                  onValueChange={(value: "revenue" | "expense") => {
                    form.setValue("type", value);
                    form.setValue("category", ""); // Reset category when type changes
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={form.watch("category")} onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>
            </div>

            {/* Description and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  {...form.register("description")}
                  placeholder="Transaction description"
                  className="mt-1"
                />
                {form.formState.errors.description && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Amount ($) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register("amount", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="mt-1"
                />
                {form.formState.errors.amount && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.amount.message}</p>
                )}
              </div>
            </div>

            {/* Payment Method and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select value={form.watch("payment_method")} onValueChange={(value) => form.setValue("payment_method", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.payment_method && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.payment_method.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="transaction_date">Transaction Date *</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  {...form.register("transaction_date")}
                  className="mt-1"
                />
                {form.formState.errors.transaction_date && (
                  <p className="text-red-600 text-sm mt-1">{form.formState.errors.transaction_date.message}</p>
                )}
              </div>
            </div>

            {/* Reference Number and Client/Staff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="reference_number">Reference Number</Label>
                <Input
                  id="reference_number"
                  {...form.register("reference_number")}
                  placeholder="REV-001, EXP-001, etc."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="client_id">Client (Optional)</Label>
                <Select 
                  value={form.watch("client_id")?.toString() || "none"} 
                  onValueChange={(value) => form.setValue("client_id", value === "none" ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.first_name} {client.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="staff_id">Staff (Optional)</Label>
                <Select 
                  value={form.watch("staff_id")?.toString() || "none"} 
                  onValueChange={(value) => form.setValue("staff_id", value === "none" ? undefined : parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No staff</SelectItem>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes and Recurring */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Additional notes about this transaction..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_recurring"
                  checked={form.watch("is_recurring")}
                  onCheckedChange={(checked) => form.setValue("is_recurring", !!checked)}
                />
                <Label htmlFor="is_recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  This is a recurring transaction
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/accounting")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-barber-primary hover:bg-barber-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Saving..." : isEditing ? "Update Transaction" : "Create Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}