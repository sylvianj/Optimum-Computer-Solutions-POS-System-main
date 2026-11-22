import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { AlertTriangle, Receipt } from 'lucide-react';
import { formatCurrency } from './utils/helpers';
import type { CompletedSale, POSProduct } from './pages/POSPageEnhanced';

interface DataTablesProps {
  products: POSProduct[];
  completedSales: CompletedSale[];
}

export function DataTables({ products, completedSales }: DataTablesProps) {
  const recentSales = completedSales.slice(0, 5);
  const lowStockItems = products
    .filter(product => product.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
     
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-600 dark:text-gray-400">Invoice #</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Customer</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Total</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.length === 0 ? (
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Receipt className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No transactions yet</p>
                        <p className="text-xs mt-1">Sales will appear here once you complete a checkout.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSales.map(sale => (
                    <TableRow key={sale.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <TableCell className="text-blue-600 dark:text-blue-400 font-medium">{sale.id}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{sale.customer}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                          {sale.method.split(':')[0]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

     
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-600 dark:text-gray-400">Item</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Quantity</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Reorder Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.length === 0 ? (
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableCell colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                          <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                        </div>
                        <p className="text-sm font-medium">Stock levels are healthy</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lowStockItems.map(item => (
                  <TableRow key={item.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <TableCell className="text-gray-600 dark:text-gray-300 font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className="text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                        {item.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 dark:text-gray-400">{item.reorderLevel || 10}</TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}