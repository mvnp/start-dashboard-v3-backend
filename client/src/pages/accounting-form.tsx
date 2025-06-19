import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AccountingTransaction, AccountingTransactionCategory, Person, Business } from "@shared/schema";
import { useBusinessContext } from "@/lib/business-context";
import { TranslatableText } from "@/components/translatable-text";
import { format } from "date-fns";

const formSchema = z.object({
  type: z.enum(["revenue", "expense"]),
  business_id: z.number().min(1, "Business is required"),
  category_id: z.number().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  payment_method: z.string().min(1, "Payment method is required"),
  transaction_date: z.string().min(1, "Transaction date is required"),
  reference_number: z.string().min(1, "Reference number is required"),
  client_id: z.number().optional().nullable(),
  staff_id: z.number().optional().nullable(),
  notes: z.string().optional(),
  is_recurring: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export default function AccountingForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const { selectedBusinessId } = useBusinessContext();

  // Get transaction ID from URL if editing
  useEffect(() => {
    const path = window.location.pathname;
    const matches = path.match(/\/accounting-form\/(\d+)/);
    if (matches) {
      setIsEdit(true);
      setTransactionId(parseInt(matches[1]));
    }
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "revenue",
      business_id: undefined,
      category_id: undefined,
      description: "",
      amount: "",
      payment_method: "",
      transaction_date: format(new Date(), "yyyy-MM-dd"),
      reference_number: "",
      client_id: undefined,
      staff_id: undefined,
      notes: "",
      is_recurring: false,
    },
  });

  // Fetch transaction data for editing
  const { data: transaction, isLoading: isLoadingTransaction, error: transactionError } = useQuery<AccountingTransaction>({
    queryKey: [`/api/accounting-transactions/${transactionId}`, selectedBusinessId],
    enabled: !!transactionId && isEdit,
    retry: 3,
    staleTime: 0, // Always fetch fresh data
  });

  // Fetch user businesses
  const { data: userBusinesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
  });

  // Fetch clients (role ID 4)
  const { data: clients = [] } = useQuery<Person[]>({
    queryKey: ["/api/clients", selectedBusinessId],
  });

  // Fetch staff (role ID 3)
  const { data: staff = [] } = useQuery<Person[]>({
    queryKey: ["/api/staff", selectedBusinessId],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: ["/api/accounting-transaction-categories", selectedBusinessId],
  });

  // Set form values when editing
  useEffect(() => {
    if (transaction && isEdit && !isLoadingTransaction && categories.length > 0) {
      // Add a small delay to ensure form is fully initialized
      const timer = setTimeout(() => {
        const formData = {
          type: transaction.type as "revenue" | "expense",
          business_id: transaction.business_id ?? undefined,
          category_id: transaction.category_id ?? undefined,
          description: transaction.description,
          amount: transaction.amount,
          payment_method: transaction.payment_method,
          transaction_date: transaction.transaction_date ? transaction.transaction_date.split('T')[0] : format(new Date(), "yyyy-MM-dd"),
          reference_number: transaction.reference_number,
          client_id: transaction.client_id ?? undefined,
          staff_id: transaction.staff_id ?? undefined,
          notes: transaction.notes || "",
          is_recurring: transaction.is_recurring || false,
        };
        
        // Reset form with transaction data
        form.reset(formData);
        
        // Force update each field value to ensure UI reflects the data
        form.setValue("type", formData.type);
        if (formData.business_id) form.setValue("business_id", formData.business_id);
        if (formData.category_id) form.setValue("category_id", formData.category_id);
        form.setValue("description", formData.description);
        form.setValue("amount", formData.amount);
        form.setValue("payment_method", formData.payment_method);
        form.setValue("transaction_date", formData.transaction_date);
        form.setValue("reference_number", formData.reference_number);
        if (formData.client_id) form.setValue("client_id", formData.client_id);
        if (formData.staff_id) form.setValue("staff_id", formData.staff_id);
        form.setValue("notes", formData.notes);
        form.setValue("is_recurring", formData.is_recurring);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [transaction, isEdit, isLoadingTransaction, categories, form]);

  // Auto-set business_id from selected business context
  useEffect(() => {
    if (selectedBusinessId && !isEdit && !form.getValues("business_id")) {
      form.setValue("business_id", selectedBusinessId);
    }
  }, [selectedBusinessId, form, isEdit]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest("POST", "/api/accounting-transactions", {
        ...data,
        business_id: selectedBusinessId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions", selectedBusinessId] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Transaction created successfully</TranslatableText>,
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: error.message || <TranslatableText>Failed to create transaction</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      apiRequest("PUT", `/api/accounting-transactions/${transactionId}`, {
        ...data,
        business_id: selectedBusinessId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions", selectedBusinessId] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Transaction updated successfully</TranslatableText>,
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: error.message || <TranslatableText>Failed to update transaction</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && (isLoadingTransaction || !transaction)) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-lg"><TranslatableText>Loading transaction data...</TranslatableText></div>
          </div>
        </div>
      </div>
    );
  }

  if (transactionError) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4"><TranslatableText>Failed to load transaction data</TranslatableText></p>
            <Button onClick={() => setLocation("/accounting")}>
              Back to Transactions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/accounting")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back to Transactions</TranslatableText>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-barber-primary rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <TranslatableText tag="h1" className="text-3xl font-bold">
              {isEdit ? "Edit Transaction" : "Add New Transaction"}
            </TranslatableText>
            <TranslatableText tag="p" className="text-slate-600">
              {isEdit ? "Update transaction details" : "Enter new transaction details"}
            </TranslatableText>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle><TranslatableText>Transaction Details</TranslatableText></CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Type *</TranslatableText></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transaction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business ID is automatically set from session context */}
                <input type="hidden" {...form.register("business_id")} />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Amount *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Description *</TranslatableText></FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Category *</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.description}
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
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Payment Method *</TranslatableText></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="transaction_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Transaction Date *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Reference Number *</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder="REF001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Client</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.first_name} {client.last_name}
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
                  name="staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Staff Member</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staff.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.first_name} {member.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Notes</TranslatableText></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this transaction"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel><TranslatableText>Recurring Transaction</TranslatableText></FormLabel>
                      <p className="text-sm text-muted-foreground">
                        <TranslatableText>Mark this as a recurring transaction</TranslatableText>
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1"
                >
                  <TranslatableText>
                  {isPending ? "Saving..." : isEdit ? "Update Transaction" : "Create Transaction"}
                </TranslatableText>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/accounting")}
                >
    <TranslatableText>Cancel</TranslatableText>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}