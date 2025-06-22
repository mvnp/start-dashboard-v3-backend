import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import type { AccountingTransaction, AccountingTransactionCategory, Person, Business } from "@shared/schema";

const formSchema = z.object({
  type: z.enum(['revenue', 'expense']),
  amount: z.string().min(1, "Amount is required").refine((val) => {
    // Allow decimal numbers with comma or dot as decimal separator
    const normalizedVal = val.replace(',', '.');
    const num = parseFloat(normalizedVal);
    return !isNaN(num) && num > 0;
  }, "Amount must be a valid decimal number greater than 0"),
  description: z.string().min(1, "Description is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  reference_number: z.string().min(1, "Reference number is required"),
  category_id: z.number().optional(),
  client_id: z.number().optional(),
  staff_id: z.number().optional(),
  business_id: z.number().min(1, "Business is required"),
  transaction_date: z.date({
    required_error: "Transaction date is required",
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AccountingForm() {
  const { transactionId, id } = useParams();
  const actualId = id || transactionId; // Support both routing patterns
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { selectedBusinessId } = useBusinessContext();
  const isEdit = !!actualId && actualId !== 'new';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'revenue',
      amount: '',
      description: '',
      payment_method: 'Cash',
      reference_number: '',
      notes: '',
      transaction_date: new Date(),
      business_id: 1,
    },
  });

  // Fetch transaction data for editing
  const { data: transaction, isLoading: isLoadingTransaction, error: transactionError } = useQuery<AccountingTransaction>({
    queryKey: [`/api/accounting-transactions/${actualId}`],
    enabled: !!actualId && isEdit,
    retry: 3,
    staleTime: 0,
  });

  // Fetch user businesses
  const { data: userBusinesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/user-businesses"],
  });

  // Fetch clients (role ID 4)
  const { data: clients = [] } = useQuery<Person[]>({
    queryKey: ["/api/clients"],
  });

  // Fetch staff (role ID 3)
  const { data: staff = [] } = useQuery<Person[]>({
    queryKey: ["/api/staff"],
  });

  // Fetch categories with business context
  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: ["/api/accounting-transaction-categories", selectedBusinessId],
    enabled: !!selectedBusinessId,
  });

  // Set form values when editing
  useEffect(() => {
    if (isEdit && transaction) {
      form.reset({
        type: transaction.type as 'revenue' | 'expense',
        amount: transaction.amount.toString(),
        description: transaction.description,
        payment_method: transaction.payment_method || 'Cash',
        reference_number: transaction.reference_number || '',
        category_id: transaction.category_id ?? undefined,
        client_id: transaction.client_id ?? undefined,
        staff_id: transaction.staff_id ?? undefined,
        business_id: transaction.business_id ?? undefined,
        transaction_date: new Date(transaction.transaction_date),
        notes: transaction.notes || '',
      });
    }
  }, [isEdit, transaction, form]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest("POST", "/api/accounting-transactions", {
        ...data,
        amount: parseFloat(data.amount.replace(',', '.')),
        transaction_date: data.transaction_date.toISOString().split('T')[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: t("Success"),
        description: t("Transaction created successfully"),
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.message || <TranslatableText>Failed to create transaction</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => 
      apiRequest("PUT", `/api/accounting-transactions/${actualId}`, {
        ...data,
        amount: parseFloat(data.amount.replace(',', '.')),
        transaction_date: data.transaction_date.toISOString().split('T')[0],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: t("Success"),
        description: t("Transaction updated successfully"),
      });
      setLocation("/accounting");
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
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

  if (isEdit && isLoadingTransaction) {
    return <div><TranslatableText>Loading...</TranslatableText></div>;
  }

  if (isEdit && transactionError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle><TranslatableText>Error</TranslatableText></CardTitle>
            <CardDescription>
              <TranslatableText>Failed to load transaction data</TranslatableText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation("/accounting")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <TranslatableText>Back</TranslatableText>
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? (
            <TranslatableText>Edit Transaction</TranslatableText>
          ) : (
            <TranslatableText>Add New Transaction</TranslatableText>
          )}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Transaction Details</TranslatableText>
          </CardTitle>
          <CardDescription>
            <TranslatableText>Fill in the transaction information below</TranslatableText>
          </CardDescription>
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
                      <FormLabel><TranslatableText>Type</TranslatableText></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select type</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="revenue"><TranslatableText>Revenue</TranslatableText></SelectItem>
                          <SelectItem value="expense"><TranslatableText>Expense</TranslatableText></SelectItem>
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
                      <FormLabel><TranslatableText>Amount</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder={t("Ex: 39.70 or 39,70")} {...field} />
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
                    <FormLabel><TranslatableText>Description</TranslatableText></FormLabel>
                    <FormControl>
                      <Input placeholder={<TranslatableText>Transaction description</TranslatableText>} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Payment Method</TranslatableText></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select payment method")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash"><TranslatableText>Cash</TranslatableText></SelectItem>
                          <SelectItem value="Credit Card"><TranslatableText>Credit Card</TranslatableText></SelectItem>
                          <SelectItem value="Debit Card"><TranslatableText>Debit Card</TranslatableText></SelectItem>
                          <SelectItem value="Bank Transfer"><TranslatableText>Bank Transfer</TranslatableText></SelectItem>
                          <SelectItem value="Check"><TranslatableText>Check</TranslatableText></SelectItem>
                          <SelectItem value="Digital Wallet"><TranslatableText>Digital Wallet</TranslatableText></SelectItem>
                          <SelectItem value="PIX"><TranslatableText>PIX</TranslatableText></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Reference Number</TranslatableText></FormLabel>
                      <FormControl>
                        <Input placeholder={t("Transaction reference or receipt number")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Business</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select business</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userBusinesses.map((business) => (
                            <SelectItem key={business.id} value={business.id.toString()}>
                              {business.name}
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
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Category</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === "0" ? undefined : Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select category</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0"><TranslatableText>No category</TranslatableText></SelectItem>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><TranslatableText>Client</TranslatableText></FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === "0" ? undefined : Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select client</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0"><TranslatableText>No client</TranslatableText></SelectItem>
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
                      <Select onValueChange={(value) => field.onChange(value === "0" ? undefined : Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={<TranslatableText>Select staff member</TranslatableText>} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0"><TranslatableText>No staff member</TranslatableText></SelectItem>
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
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel><TranslatableText>Transaction Date</TranslatableText></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span><TranslatableText>Pick a date</TranslatableText></span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslatableText>Notes</TranslatableText></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={<TranslatableText>Additional notes (optional)</TranslatableText>}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <TranslatableText>Saving...</TranslatableText>
                  ) : isEdit ? (
                    <TranslatableText>Update Transaction</TranslatableText>
                  ) : (
                    <TranslatableText>Create Transaction</TranslatableText>
                  )}
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