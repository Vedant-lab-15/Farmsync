import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { ShipmentList, Shipment } from './ShipmentList';

interface ShipmentHistory {
  id: string;
  from: string;
  to: string;
  crop: string;
  quantity: number;
  unit: string;
  actualDelivery: string;
  deliveryTime: string;
  rating: number;
  feedback: string;
}

interface ShipmentsViewProps {
  shipments: Shipment[];
  shipmentHistory: ShipmentHistory[];
}

export const ShipmentsView = ({ shipments, shipmentHistory }: ShipmentsViewProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold">Shipment Tracking</h2>
      <p className="text-muted-foreground">Monitor your produce in real-time from farm to market</p>
    </div>

    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments ({shipments.length})</CardTitle>
          <CardDescription>Track your current shipments in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <ShipmentList shipments={shipments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipment History ({shipmentHistory.length})</CardTitle>
          <CardDescription>Your past shipments and deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          {shipmentHistory.length > 0 ? (
            <div className="space-y-4">
              {shipmentHistory.map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Shipment #{shipment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.from} → {shipment.to}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.crop} - {shipment.quantity}{shipment.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(shipment.actualDelivery).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Time</span>
                      <span className="font-medium">{shipment.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium">⭐ {shipment.rating}/5</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 p-2 bg-gray-50 rounded">
                      "{shipment.feedback}"
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-10 w-10 mb-2 text-gray-300" />
              <p>No shipment history found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
