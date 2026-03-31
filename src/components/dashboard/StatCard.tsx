import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: ReactNode;
  isCurrency?: boolean;
}

export const StatCard = ({ title, value, change, icon, isCurrency = false }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isCurrency ? '₹' : ''}{value}
      </div>
      <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </p>
    </CardContent>
  </Card>
);
