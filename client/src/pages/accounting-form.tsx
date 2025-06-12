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
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertAccountingTransactionSchema, AccountingTransaction, AccountingTransactionCategory, Person } from "@shared/schema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = insertAccountingTransactionSchema.extend({
  transaction_date: z.string().min(1, "Transaction date is required"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
}).omit({ id: true, business_id: true, created_at: true, updated_at: true, deleted_at: true });

type FormData = z.infer<typeof formSchema>;

export default function AccountingForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);

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
      description: "",
      amount: "",
      payment_method: "",
      transaction_date: format(new Date(), "yyyy-MM-dd"),
      reference_number: "",
      category_id: undefined,
      client_id: undefined,
      staff_id: undefined,
      notes: "",
      recurring: false,
    },
  });

  // Fetch transaction data for editing
  const { data: transaction, isLoading: isLoadingTransaction } = useQuery<AccountingTransaction>({
    queryKey: ["/api/accounting-transactions", transactionId],
    enabled: !!transactionId && isEdit,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: ["/api/accounting-transaction-categories"],
  });

  // Fetch clients (role ID 4)
  const { data: clients = [] } = useQuery<Person[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch staff (role ID 3)
  const { data: staff = [] } = useQuery<Person[]>({
    queryKey: ["/api/staff"],
  });

  // Set form values when editing
  useEffect(() => {
    if (transaction && isEdit) {
      form.reset({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        transaction_date: format(new Date(transaction.transaction_date), "yyyy-MM-dd"),
        reference_number: transaction.reference_number,
        category_id: transaction.category_id || undefined,
        client_id: transaction.client_id || undefined,
        staff_id: transaction.staff_id || undefined,
        notes: transaction.notes || "",
        recurring: transaction.recurring || false,
      });
    }
  }, [transaction, isEdit, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest("/api/accounting-transactions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      apiRequest(`/api/accounting-transactions/${transactionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
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

  if (isEdit && isLoadingTransaction) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading transaction...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/accounting")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Transaction" : "Add New Transaction"}
        </h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
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
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount *</FormLabel>
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
                    <FormLabel>Description *</FormLabel>
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
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
                      <FormLabel>Payment Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <FormLabel>Transaction Date *</FormLabel>
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
                      <FormLabel>Reference Number *</FormLabel>
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
                      <FormLabel>Client</FormLabel>
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
                      <FormLabel>Staff Member</FormLabel>
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
                    <FormLabel>Notes</FormLabel>
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
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Recurring Transaction</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this as a recurring transaction
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
                  {isPending ? "Saving..." : isEdit ? "Update Transaction" : "Create Transaction"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/accounting")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}