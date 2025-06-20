import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { useBusinessContext } from "@/hooks/use-business-context";
import type { AccountingTransaction, AccountingTransactionCategory } from "@shared/schema";

export default function AccountingList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { selectedBusinessId } = useBusinessContext();

  const { data: transactions = [], isLoading } = useQuery<AccountingTransaction[]>({
    queryKey: ["/api/accounting-transactions", selectedBusinessId],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!selectedBusinessId,
  });

  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: ["/api/accounting-transaction-categories", selectedBusinessId],
    enabled: !!selectedBusinessId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/accounting-transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions", selectedBusinessId] });
      toast({
        title: <TranslatableText>Success</TranslatableText>,
        description: <TranslatableText>Transaction deleted successfully</TranslatableText>,
      });
    },
    onError: (error: any) => {
      toast({
        title: <TranslatableText>Error</TranslatableText>,
        description: error.message || <TranslatableText>Failed to delete transaction</TranslatableText>,
        variant: "destructive",
      });
    },
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const totalRevenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const netIncome = totalRevenue - totalExpenses;

  if (isLoading) {
    return <div><TranslatableText>Loading...</TranslatableText></div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"><TranslatableText>Accounting Transactions</TranslatableText></h1>
        <Button onClick={() => setLocation("/accounting/new")}>
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
              <Button onClick={() => setLocation("/accounting/new")}>
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
                        onClick={() => setLocation(`/accounting/${transaction.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(<TranslatableText>Are you sure you want to delete this transaction?</TranslatableText>)) {
                            deleteMutation.mutate(transaction.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
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