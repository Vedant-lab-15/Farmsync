import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package } from 'lucide-react';

export interface Shipment {
  id: string;
  from: string;
  to: string;
  status: 'processing' | 'in-transit' | 'delivered';
  progress: number;
  estimatedDelivery: string;
}

interface ShipmentListProps {
  shipments: Shipment[];
}

const statusStyles: Record<string, string> = {
  'in-transit': 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
};

export const ShipmentList = ({ shipments }: ShipmentListProps) => {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Package className="mx-auto h-10 w-10 mb-2 text-gray-300" />
        <p>No active shipments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => (
        <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Shipment #{shipment.id}</p>
              <p className="text-sm text-muted-foreground">
                {shipment.from} → {shipment.to}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[shipment.status] || 'bg-gray-100 text-gray-800'}`}>
              {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('-', ' ')}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{shipment.progress}%</span>
            </div>
            <Progress value={shipment.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Est. delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN')}
            </p>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Track Shipment
          </Button>
        </div>
      ))}
      <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50">
        View All Shipments
      </Button>
    </div>
  );
};
