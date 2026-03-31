import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN001', farmer: 'Rajesh Kumar', crop: 'Alphonso Mango', quantity: '300 kg', amount: 45000, date: '2025-09-28', status: 'completed' },
  { id: 'TXN002', farmer: 'Suresh Patil', crop: 'Wheat', quantity: '800 quintal', amount: 22400, date: '2025-09-25', status: 'completed' },
  { id: 'TXN003', farmer: 'Anita Desai', crop: 'Kesar Mango', quantity: '200 kg', amount: 26000, date: '2025-09-22', status: 'pending' },
  { id: 'TXN004', farmer: 'Mohan Yadav', crop: 'Sugarcane', quantity: '1500 quintal', amount: 5250, date: '2025-09-20', status: 'completed' },
  { id: 'TXN005', farmer: 'Rajesh Kumar', crop: 'Tomato', quantity: '500 kg', amount: 22500, date: '2025-09-18', status: 'completed' },
];

const statusStyle: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

export const BrokerTransactionsTab = () => {
  const total = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Transactions</h2>
        <p className="text-muted-foreground">Your complete transaction history</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">₹{pending.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{MOCK_TRANSACTIONS.length}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-sm">{txn.crop} — {txn.farmer}</p>
                  <p className="text-xs text-muted-foreground">{txn.quantity} • {txn.date} • #{txn.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₹{txn.amount.toLocaleString('en-IN')}</span>
                  <Badge className={statusStyle[txn.status]}>{txn.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
