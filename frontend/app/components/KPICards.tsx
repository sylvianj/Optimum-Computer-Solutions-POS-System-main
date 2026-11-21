import React from 'react';
import { Card, CardContent } from './ui/card';
import { formatCurrency } from './utils/helpers';
import type { CompletedSale, DayBalance, POSProduct } from './pages/POSPageEnhanced';

interface KPICardsProps {
  products: POSProduct[];
  completedSales: CompletedSale[];
  dayBalance: DayBalance;
  cashSalesToday: number;
}

export function KPICards({ completedSales, dayBalance, cashSalesToday }: KPICardsProps) {
  const totalSales = completedSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalTransactions = completedSales.length;
  const expectedClosingBalance = dayBalance.openingBalance + cashSalesToday;

  const kpiData = [
    {
      title: 'Opening Balance',
      value: formatCurrency(dayBalance.openingBalance),
      change: dayBalance.status === 'open' ? 'Day open' : 'Open drawer',
      changeType: dayBalance.status === 'open' ? 'positive' : 'neutral'
    },
    {
      title: 'Expected Closing Balance',
      value: formatCurrency(expectedClosingBalance),
      change: `${formatCurrency(cashSalesToday)} sales - ${formatCurrency(0)} expenses`,
      changeType: expectedClosingBalance >= dayBalance.openingBalance ? 'positive' : 'neutral'
    },
    {
      title: 'Closing Balance',
      value: dayBalance.closingBalance === null ? 'Not closed' : formatCurrency(dayBalance.closingBalance),
      change: dayBalance.status === 'closed' && dayBalance.closingBalance !== null ? 'Day closed' : 'Pending close',
      changeType: dayBalance.status === 'closed' && dayBalance.closingBalance !== null ? 'positive' : 'neutral'
    },
    {
      title: 'Transactions Today',
      value: totalTransactions.toString(),
      change: formatCurrency(totalSales),
      changeType: totalTransactions > 0 ? 'positive' : 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {kpiData.map((item, index) => {
        return (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                <span
                  className={`max-w-[12rem] rounded-full px-2 py-1 text-right text-xs leading-snug ${
                    item.changeType === 'positive'
                      ? 'text-green-600 bg-green-400/10 dark:text-green-400 dark:bg-green-900/30'
                      : 'text-gray-500 bg-gray-400/10 dark:text-gray-400 dark:bg-gray-700/50'
                  }`}
                >
                  {item.change}
                </span>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}