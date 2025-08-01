import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Plus, Search, Trash2, Copy, Calculator, Wifi, WifiOff } from "lucide-react";
import { format } from "date-fns";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useAuth } from "@/lib/auth";
import { useWebSocket } from "@/hooks/use-websocket";
import type { AccountingTransaction, AccountingTransactionCategory } from "@shared/schema";

export default function AccountingList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const { selectedBusinessId } = useBusinessContext();
  const { user } = useAuth();
  const { isConnected } = useWebSocket();

  const { data: transactions = [], isLoading } = useQuery<AccountingTransaction[]>({
    queryKey: user?.isSuperAdmin ? ["/api/accounting-transactions"] : ["/api/accounting-transactions", selectedBusinessId],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: user?.isSuperAdmin ? ["/api/accounting-transaction-categories"] : ["/api/accounting-transaction-categories", selectedBusinessId],
    enabled: user?.isSuperAdmin || !!selectedBusinessId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/accounting-transactions/${id}`),
    onSuccess: () => {
      const queryKey = user?.isSuperAdmin ? ["/api/accounting-transactions"] : ["/api/accounting-transactions", selectedBusinessId];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: t("Success"),
        description: t("Transaction deleted successfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.message || <TranslatableText>Failed to delete transaction</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const cloneTransactionMutation = useMutation({
    mutationFn: async (transaction: AccountingTransaction) => {
      // Payment methods available
      const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check', 'PayPal'];
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Generate random date between a week ago and today
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const randomTime = weekAgo.getTime() + Math.random() * (today.getTime() - weekAgo.getTime());
      const randomDate = new Date(randomTime);
      const formattedDate = randomDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const clonedTransaction = {
        type: transaction.type,
        category_id: transaction.category_id,
        description: transaction.description,
        amount: transaction.amount,
        payment_method: randomPaymentMethod,
        transaction_date: formattedDate,
        notes: transaction.description, // Insert description into notes
        business_id: selectedBusinessId
      };
      
      return apiRequest("POST", "/api/accounting-transactions", clonedTransaction);
    },
    onSuccess: () => {
      const queryKey = user?.isSuperAdmin ? ["/api/accounting-transactions"] : ["/api/accounting-transactions", selectedBusinessId];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: t("Success"),
        description: t("Transaction cloned successfully"),
      });
    },
    onError: () => {
      toast({
        title: t("Error"),
        description: t("Failed to clone transaction"),
        variant: "destructive",
      });
    },
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = Array.isArray(transactions) ? transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "No category";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.description : "Unknown category";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalRevenue = Array.isArray(transactions) ? transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) : 0;

  const totalExpenses = Array.isArray(transactions) ? transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0) : 0;

  const netIncome = totalRevenue - totalExpenses;

  if (isLoading) {
    return <div><TranslatableText>Loading...</TranslatableText></div>;
  }

  return (
    <div className="w-full p-6">
      {/* Standard SaaS Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-barber-primary rounded-lg">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <TranslatableText>Accounting Transactions</TranslatableText>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              <TranslatableText>Track and manage your business revenue and expenses</TranslatableText>
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Real-time updates active</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span>Real-time updates disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
        <Button onClick={() => setLocation("/accounting-transactions/new")} className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          <TranslatableText>Add Transaction</TranslatableText>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              <TranslatableText>Total Revenue</TranslatableText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              <TranslatableText>Total Expenses</TranslatableText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <TranslatableText>Net Income</TranslatableText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={<TranslatableText>Search transactions...</TranslatableText>}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle><TranslatableText>Transactions</TranslatableText></CardTitle>
          <CardDescription>
            <TranslatableText>Manage your business income and expenses</TranslatableText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                <TranslatableText>No transactions found</TranslatableText>
              </p>
              <Button onClick={() => setLocation("/accounting-transactions/new")}>
                <Plus className="h-4 w-4 mr-2" />
                <TranslatableText>Add First Transaction</TranslatableText>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant={transaction.type === 'revenue' ? 'default' : 'destructive'}
                        className={transaction.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {transaction.type === 'revenue' ? <TranslatableText>Revenue</TranslatableText> : <TranslatableText>Expense</TranslatableText>}
                      </Badge>
                      <span className="font-medium">{transaction.description}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <TranslatableText>Category</TranslatableText>: {getCategoryName(transaction.category_id)} | 
                      <TranslatableText>Date</TranslatableText>: {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                      {transaction.notes && (
                        <>
                          {' | '}
                          <TranslatableText>Notes</TranslatableText>: {transaction.notes}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-semibold ${
                      transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(Math.abs(Number(transaction.amount)))}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/accounting-transactions/edit/${transaction.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(t("Are you sure you want to delete this transaction?"))) {
                            deleteMutation.mutate(transaction.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cloneTransactionMutation.mutate(transaction)}
                        disabled={cloneTransactionMutation.isPending}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}