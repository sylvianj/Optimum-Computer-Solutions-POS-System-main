import React from 'react';
import { KPICards } from '../KPICards';
import { Charts } from '../Charts';
import { DataTables } from '../DataTables';
import { QuickActions, type QuickActionId } from '../QuickActions';
import type { CompletedSale, DayBalance, POSProduct } from './POSPageEnhanced';
import type { UserRole } from '../../types/auth';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';
import { ExternalLink, Settings } from 'lucide-react';

import { formatCurrency } from '../utils/helpers';

interface DashboardProps {
  products: POSProduct[];
  completedSales: CompletedSale[];
  dayBalance: DayBalance;
  cashSalesToday: number;
  userRole: UserRole;
  onQuickAction: (action: QuickActionId) => void;
}

export function Dashboard({ products, completedSales, dayBalance, cashSalesToday, userRole, onQuickAction }: DashboardProps) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaySales = completedSales.filter(sale => new Date(sale.timestamp).toISOString().slice(0, 10) === todayKey);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
  const lowStockItems = products.filter(product => product.stock <= (product.reorderLevel || 10));
  
  // Fixed NaN issue by providing fallbacks
  const expectedCash = dayBalance.openingBalance || 0;
  const cashVariance = cashSalesToday - expectedCash;
  const hasCriticalAlerts = lowStockItems.length > 0 || cashVariance < 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">DASHBOARD OVERVIEW</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening with your store today.</p>
        </div>
        {userRole === 'super_admin' && (
          <a href="/admin/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
              <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
            </Button>
          </a>
        )}
      </div>

      {/* KPI Cards */}
      <KPICards
        products={products}
        completedSales={completedSales}
        dayBalance={dayBalance}
        cashSalesToday={cashSalesToday}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <Alert className={lowStockItems.length > 0 ? 'border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/30' : 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30'}>
          <AlertTitle className={lowStockItems.length > 0 ? 'text-orange-900 dark:text-orange-200' : 'text-green-900 dark:text-green-200'}>
            Stock Watch
          </AlertTitle>
          <AlertDescription className={lowStockItems.length > 0 ? 'text-orange-800 dark:text-orange-300' : 'text-green-800 dark:text-green-300'}>
            {lowStockItems.length > 0
              ? `${lowStockItems.length} product${lowStockItems.length === 1 ? '' : 's'} at or below reorder level.`
              : 'All visible products are above reorder level.'}
          </AlertDescription>
        </Alert>

        <Alert className={cashVariance < 0 ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30' : 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30'}>
          <AlertTitle className={cashVariance < 0 ? 'text-red-900 dark:text-red-200' : 'text-blue-900 dark:text-blue-200'}>
            Cash Position
          </AlertTitle>
          <AlertDescription className={cashVariance < 0 ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'}>
            {cashVariance === 0
              ? 'Cash drawer matches expected cash.'
              : `${cashVariance > 0 ? 'Over' : 'Short'} by ${formatCurrency(Math.abs(cashVariance))}.`}
          </AlertDescription>
        </Alert>

        <Alert className={hasCriticalAlerts ? 'border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800' : 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/30'}>
          <AlertTitle className={hasCriticalAlerts ? 'text-slate-900 dark:text-white' : 'text-green-900 dark:text-green-200'}>
            Today
          </AlertTitle>
          <AlertDescription className={hasCriticalAlerts ? 'text-slate-700 dark:text-gray-300' : 'text-green-800 dark:text-green-300'}>
            <span>{todaySales.length} transactions</span>
            <Badge variant="secondary" className="ml-2 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 border border-transparent dark:border-gray-700">
              {formatCurrency(todayRevenue)}
            </Badge>
          </AlertDescription>
        </Alert>
      </div>

      {/* Charts Section */}
      <Charts completedSales={completedSales} products={products} />

      {/* Data Tables */}
      <DataTables products={products} completedSales={completedSales} />

      {/* Quick Actions and Staff Leaderboard */}
      <QuickActions completedSales={completedSales} userRole={userRole} onAction={onQuickAction} />
    </div>
  );
}