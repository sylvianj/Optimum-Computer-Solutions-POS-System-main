import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trophy } from 'lucide-react';

import { formatCurrency } from './utils/helpers';
import type { CompletedSale } from './pages/POSPageEnhanced';
import type { UserRole } from '../types/auth';
import { canUseQuickAction } from '../services/permissions';

export type QuickActionId = 'new-sale' | 'add-product' | 'add-customer' | 'quick-invoice';

interface QuickActionsProps {
  completedSales: CompletedSale[];
  userRole: UserRole;
  onAction: (action: QuickActionId) => void;
}

const quickActions: Array<{
  id: QuickActionId;
  label: string;
  className: string;
}> = [
  {
    id: 'new-sale',
    label: 'New Sale',
    className: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500'
  },
  {
    id: 'add-product',
    label: 'Add Product',
    className: 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-500'
  },
  {
    id: 'add-customer',
    label: 'Add Customer',
    className: 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-500'
  },
  {
    id: 'quick-invoice',
    label: 'Quick Invoice',
    className: 'bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-600 dark:hover:bg-orange-500'
  }
];

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getTopSellersForToday = (completedSales: CompletedSale[]) => {
  const todayKey = getTodayKey();
  const sellerMap = new Map<string, { name: string; salesAmount: number; transactions: number }>();

  completedSales
    .filter(sale => sale.timestamp.toISOString().slice(0, 10) === todayKey)
    .forEach(sale => {
      const sellerName = sale.cashier || 'John Cashier';
      const current = sellerMap.get(sellerName) ?? {
        name: sellerName,
        salesAmount: 0,
        transactions: 0
      };

      current.salesAmount += sale.amount;
      current.transactions += 1;
      sellerMap.set(sellerName, current);
    });

  return Array.from(sellerMap.values())
    .sort((a, b) => b.salesAmount - a.salesAmount || b.transactions - a.transactions)
    .slice(0, 5)
    .map((seller, index) => ({
      ...seller,
      rank: index + 1
    }));
};

export function QuickActions({ completedSales, userRole, onAction }: QuickActionsProps) {
  const staffData = getTopSellersForToday(completedSales);
  const availableActions = quickActions.filter(action => canUseQuickAction(action.id, userRole));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Action Buttons */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableActions.map((action) => (
            <Button
              key={action.id}
              className={`w-full justify-center active:scale-95 transition-transform ${action.className}`}
              onClick={() => onAction(action.id)}
            >
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Staff Leaderboard */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Today's Top Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          {staffData.length > 0 ? (
            <div className="space-y-3">
              {staffData.map((staff) => (
                <div key={staff.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-transparent dark:border-gray-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      staff.rank === 1
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : staff.rank === 2
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : staff.rank === 3
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {staff.rank}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{staff.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{staff.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 dark:text-green-400 font-bold text-lg">{formatCurrency(staff.salesAmount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
              <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-300">No sellers ranked yet today</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Complete a sale and this leaderboard will update automatically.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}