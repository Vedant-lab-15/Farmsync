import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, Truck, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { StatCard } from './StatCard';
import { MarketOverview, MarketData } from './MarketOverview';
import { ShipmentList, Shipment } from './ShipmentList';

interface UserOverviewStats {
  activeListings?: number;
  totalListings?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  totalShipments?: number;
  completedShipments?: number;
  averageRating?: number;
}

interface OverviewViewProps {
  marketData: MarketData[];
  shipments: Shipment[];
  userOverview: { stats?: UserOverviewStats };
}

export const OverviewView = ({ marketData, shipments, userOverview }: OverviewViewProps) => {
  const stats = userOverview.stats;

  const revenueChange = stats?.totalRevenue && stats?.monthlyRevenue
    ? `+${(((stats.totalRevenue - stats.monthlyRevenue) / stats.monthlyRevenue) * 100).toFixed(1)}%`
    : '+0%';

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Listings"
          value={stats?.activeListings ?? 0}
          change={stats?.totalListings ? `+${stats.totalListings - (stats.activeListings ?? 0)} total` : '+0'}
          icon={<Package className="h-4 w-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
          change={revenueChange}
          isCurrency
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Active Shipments"
          value={stats?.totalShipments ?? shipments.length}
          change={stats?.completedShipments ? `+${(stats.totalShipments ?? 0) - stats.completedShipments} active` : '+0'}
          icon={<Truck className="h-4 w-4" />}
        />
        <StatCard
          title="Average Rating"
          value={stats?.averageRating ? `${stats.averageRating}/5` : '0/5'}
          change={stats?.averageRating ? `⭐ ${stats.averageRating}` : '⭐ 0'}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Real-time prices for your crops</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketOverview marketData={marketData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Active Shipments</CardTitle>
            <CardDescription>Track your produce in transit</CardDescription>
          </CardHeader>
          <CardContent>
            <ShipmentList shipments={shipments.filter((s) => s.status !== 'delivered')} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Traceability</CardTitle>
            <CardDescription>View your product journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Mango Batch #M-7892</p>
                  <p className="text-sm text-muted-foreground">Harvested: Sep 20, 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '75%' }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Harvested</span>
                <span>In Transit</span>
                <span>Market</span>
                <span>Sold</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Farm Advisory</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pest Alert</p>
                  <p className="text-sm text-muted-foreground">
                    High risk of fruit borer in tomatoes. Consider preventive measures.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2 border-t">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Market Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Tomato prices expected to rise by 15% next week.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
