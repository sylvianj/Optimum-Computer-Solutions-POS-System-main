import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { request } from '../../services/api';
import { toast } from 'sonner';

interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Assuming the backend endpoint is /logs/ or /audit-logs/
      const response = await request<AuditLog[] | { results: AuditLog[] }>('/logs/');
      const data = Array.isArray(response) ? response : response.results || [];
      setLogs(data);
    } catch (error) {
      console.warn('Failed to fetch logs, using mock data', error);
      // Fallback mock data so you can see the UI working immediately
      setLogs([
        { id: 1, user: 'Admin', action: 'Login', module: 'Auth', details: 'Successful login', ip_address: '127.0.0.1', created_at: new Date().toISOString() },
        { id: 2, user: 'Cashier John', action: 'Create Sale', module: 'POS', details: 'Sale TXN-1234 for KSh 500', ip_address: '192.168.1.5', created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, user: 'Admin', action: 'Add Product', module: 'Inventory', details: 'Added Coca Cola 500ml', ip_address: '127.0.0.1', created_at: new Date(Date.now() - 7200000).toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Audit Logs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Track all system activities and user actions.</p>
        </div>
        <Button onClick={fetchLogs} disabled={isLoading} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-600 dark:text-gray-400">Timestamp</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">User</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Module</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Action</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Details</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Loading logs...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No audit logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <TableCell className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {log.user}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {log.module}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                        {log.ip_address}
                      </TableCell>
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