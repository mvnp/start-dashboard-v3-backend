import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AccountingTransaction, AccountingTransactionCategory } from "@shared/schema";
import { format } from "date-fns";

export default function AccountingList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: transactions = [], isLoading } = useQuery<AccountingTransaction[]>({
    queryKey: ["/api/accounting-transactions"],
  });

  const { data: categories = [] } = useQuery<AccountingTransactionCategory[]>({
    queryKey: ["/api/accounting-transaction-categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/accounting-transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounting-transactions"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'N/A';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  };

  const getTotalsByType = () => {
    const revenue = transactions
      .filter(t => t.type === 'revenue')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return { revenue, expense, net: revenue - expense };
  };

  const totals = getTotalsByType();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Accounting Transactions</h1>
        <Button onClick={() => setLocation("/accounting-form")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totals.revenue.toString())}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totals.expense.toString())}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totals.net.toString())}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No transactions found</p>
              <Button onClick={() => setLocation("/accounting-form")}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Payment Method</th>
                    <th className="text-left p-2">Reference</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
                    .map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-2">
                        <Badge variant={transaction.type === 'revenue' ? 'default' : 'destructive'}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="p-2">{transaction.description}</td>
                      <td className="p-2">{getCategoryName(transaction.category_id)}</td>
                      <td className="p-2">
                        <span className={transaction.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'revenue' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="p-2">{transaction.payment_method}</td>
                      <td className="p-2">{transaction.reference_number}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/accounting-form/${transaction.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}