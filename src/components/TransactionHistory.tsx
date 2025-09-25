import { Calendar, Download, Filter, Search, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  date: string;
  cropName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  brokerName: string;
  brokerCompany: string;
  status: 'completed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  market: string;
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    date: "2024-01-20",
    cropName: "Rice",
    quantity: 50,
    unit: "quintals",
    pricePerUnit: 2800,
    totalAmount: 140000,
    brokerName: "Raj Kumar Singh",
    brokerCompany: "Singh Agro Traders",
    status: 'completed',
    paymentStatus: 'paid',
    market: "Main Market"
  },
  {
    id: "TXN-002",
    date: "2024-01-18",
    cropName: "Wheat",
    quantity: 30,
    unit: "quintals",
    pricePerUnit: 2200,
    totalAmount: 66000,
    brokerName: "Priya Patel",
    brokerCompany: "Green Valley Exports",
    status: 'completed',
    paymentStatus: 'paid',
    market: "Grain Market"
  },
  {
    id: "TXN-003",
    date: "2024-01-15",
    cropName: "Soybeans",
    quantity: 25,
    unit: "quintals",
    pricePerUnit: 4200,
    totalAmount: 105000,
    brokerName: "Mohammed Ali",
    brokerCompany: "Ali Brothers Trading",
    status: 'pending',
    paymentStatus: 'pending',
    market: "Commodity Market"
  },
  {
    id: "TXN-004",
    date: "2024-01-12",
    cropName: "Cotton",
    quantity: 15,
    unit: "quintals",
    pricePerUnit: 5500,
    totalAmount: 82500,
    brokerName: "Sunita Sharma",
    brokerCompany: "Sharma Commodity Hub",
    status: 'cancelled',
    paymentStatus: 'pending',
    market: "Textile Market"
  },
  {
    id: "TXN-005",
    date: "2024-01-10",
    cropName: "Corn",
    quantity: 40,
    unit: "quintals",
    pricePerUnit: 1850,
    totalAmount: 74000,
    brokerName: "Raj Kumar Singh",
    brokerCompany: "Singh Agro Traders",
    status: 'completed',
    paymentStatus: 'overdue',
    market: "Local Market"
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-success text-success-foreground">Paid</Badge>;
    case 'pending':
      return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const TransactionHistory = () => {
  const totalEarnings = transactions
    .filter(t => t.status === 'completed' && t.paymentStatus === 'paid')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const pendingAmount = transactions
    .filter(t => t.paymentStatus === 'pending' || t.paymentStatus === 'overdue')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Track all your crop sales and payments
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-gradient-success rounded-lg text-success-foreground">
            <h3 className="text-sm font-medium opacity-90">Total Earnings</h3>
            <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gradient-earth rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Payments</h3>
            <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by crop, broker, or transaction ID..."
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Transactions Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Crop & Quantity</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.cropName}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.quantity} {transaction.unit}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.brokerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.brokerCompany}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{transaction.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        @₹{transaction.pricePerUnit.toLocaleString()}/{transaction.unit.slice(0, -1)}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  
                  <TableCell>
                    {getPaymentBadge(transaction.paymentStatus)}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No transactions yet</h3>
            <p className="text-sm text-muted-foreground">
              Your crop sales and transaction history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};