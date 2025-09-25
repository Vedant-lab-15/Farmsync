import { Bell, Plus, Trash2, Edit, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface PriceAlert {
  id: string;
  cropName: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  market: string;
  createdDate: string;
  triggered: boolean;
}

const priceAlerts: PriceAlert[] = [
  {
    id: "1",
    cropName: "Rice",
    targetPrice: 3000,
    currentPrice: 2800,
    condition: 'above',
    isActive: true,
    market: "Main Market",
    createdDate: "2024-01-15",
    triggered: false
  },
  {
    id: "2",
    cropName: "Wheat",
    targetPrice: 2500,
    currentPrice: 2200,
    condition: 'above',
    isActive: true,
    market: "Grain Market",
    createdDate: "2024-01-12",
    triggered: false
  },
  {
    id: "3",
    cropName: "Cotton",
    targetPrice: 5000,
    currentPrice: 5500,
    condition: 'below',
    isActive: false,
    market: "Textile Market",
    createdDate: "2024-01-10",
    triggered: true
  },
  {
    id: "4",
    cropName: "Soybeans",
    targetPrice: 4500,
    currentPrice: 4200,
    condition: 'above',
    isActive: true,
    market: "Commodity Market",
    createdDate: "2024-01-08",
    triggered: false
  }
];

export const PriceAlerts = () => {
  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggered) return 'triggered';
    if (!alert.isActive) return 'inactive';
    
    const isConditionMet = alert.condition === 'above' 
      ? alert.currentPrice >= alert.targetPrice
      : alert.currentPrice <= alert.targetPrice;
    
    return isConditionMet ? 'ready' : 'monitoring';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'triggered':
        return <Badge className="bg-warning text-warning-foreground">Triggered</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'ready':
        return <Badge className="bg-success text-success-foreground">Ready</Badge>;
      default:
        return <Badge variant="outline">Monitoring</Badge>;
    }
  };

  const getProgressPercentage = (alert: PriceAlert) => {
    if (alert.condition === 'above') {
      return Math.min((alert.currentPrice / alert.targetPrice) * 100, 100);
    } else {
      return Math.min(((alert.targetPrice - alert.currentPrice) / alert.targetPrice) * 100, 100);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Price Alerts
            </CardTitle>
            <CardDescription>
              Get notified when crop prices hit your target levels
            </CardDescription>
          </div>
          <Button size="sm" className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceAlerts.map((alert) => {
            const status = getAlertStatus(alert);
            const progress = getProgressPercentage(alert);
            
            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 transition-all ${
                  status === 'triggered' 
                    ? 'border-warning bg-warning/5' 
                    : status === 'ready'
                    ? 'border-success bg-success/5'
                    : 'border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.cropName}</h3>
                      {getStatusBadge(status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Alert when price goes {alert.condition} ₹{alert.targetPrice.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium">₹{alert.currentPrice.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">({alert.market})</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch checked={alert.isActive} />
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress to target</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        status === 'triggered' || status === 'ready'
                          ? 'bg-success'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                
                {status === 'triggered' && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-warning-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Alert triggered! Check your notifications.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {priceAlerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No price alerts set</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create alerts to get notified when prices reach your targets
            </p>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Alert
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};