import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TranslatableText } from "@/components/translatable-text";

const tables = [
  { name: 'users', label: 'Users' },
  { name: 'businesses', label: 'Businesses' },
  { name: 'appointments', label: 'Appointments' },
  { name: 'services', label: 'Services' },
  { name: 'persons', label: 'Persons' },
  { name: 'roles', label: 'Roles' },
  { name: 'users_business', label: 'User-Business Relations' },
  { name: 'users_roles', label: 'User-Role Relations' },
  { name: 'accounting_transactions', label: 'Accounting Transactions' },
  { name: 'barber_plans', label: 'Barber Plans' },
  { name: 'payment_gateways', label: 'Payment Gateways' },
  { name: 'support_tickets', label: 'Support Tickets' },
  { name: 'whatsapp_instances', label: 'WhatsApp Instances' },
  { name: 'faqs', label: 'FAQs' }
];

export default function DatabaseViewer() {
  const [selectedTable, setSelectedTable] = useState<string>('users');
  
  const { data: tableData, isLoading, refetch } = useQuery({
    queryKey: [`/api/database/${selectedTable}`],
    enabled: !!selectedTable,
  });

  const { data: tableCount } = useQuery({
    queryKey: [`/api/database/${selectedTable}/count`],
    enabled: !!selectedTable,
  });

  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    if (tableData) {
      const csvContent = convertToCSV(tableData);
      downloadCSV(csvContent, `${selectedTable}_export.csv`);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle null, undefined, objects
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          // Escape commas and quotes
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ];
    return csvRows.join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">NULL</span>;
    }
    if (typeof value === 'boolean') {
      return <Badge variant={value ? "default" : "secondary"}>{String(value)}</Badge>;
    }
    if (typeof value === 'object') {
      return <span className="text-xs text-gray-600">{JSON.stringify(value)}</span>;
    }
    if (typeof value === 'string' && value.length > 50) {
      return <span title={value}>{value.substring(0, 50)}...</span>;
    }
    return String(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <TranslatableText>Database Viewer</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>Browse and export database tables</TranslatableText>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            <TranslatableText>Refresh</TranslatableText>
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" disabled={!tableData}>
            <Download className="w-4 h-4 mr-2" />
            <TranslatableText>Export CSV</TranslatableText>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle><TranslatableText>Table Selection</TranslatableText></CardTitle>
            {tableCount && (
              <Badge variant="secondary">
                {tableCount} <TranslatableText>records</TranslatableText>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Table:</label>
            <Select value={selectedTable} onValueChange={handleTableChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatableText>Table Data:</TranslatableText> {tables.find(t => t.name === selectedTable)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2"><TranslatableText>Loading table data...</TranslatableText></span>
            </div>
          ) : tableData && tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(tableData[0]).map((column) => (
                      <TableHead key={column} className="font-semibold">
                        {column}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row: any, index: number) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value: any, cellIndex: number) => (
                        <TableCell key={cellIndex} className="max-w-xs">
                          {formatCellValue(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TranslatableText>No data found in this table</TranslatableText>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}