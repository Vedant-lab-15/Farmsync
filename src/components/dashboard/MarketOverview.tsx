import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export interface MarketData {
  id: string;
  crop: string;
  price: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  market: string;
}

interface MarketOverviewProps {
  marketData: MarketData[];
}

export const MarketOverview = ({ marketData }: MarketOverviewProps) => (
  <div className="space-y-4">
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All Crops</TabsTrigger>
        <TabsTrigger value="favorites">My Crops</TabsTrigger>
        <TabsTrigger value="trending">Trending</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <div className="space-y-3">
          {marketData.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium">{item.crop}</p>
                <p className="text-sm text-muted-foreground">{item.market}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{item.price}/{item.unit}</p>
                <p className={`text-xs ${item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}% {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                </p>
              </div>
            </div>
          ))}
          {marketData.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No market data available.</p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="favorites" className="mt-4">
        <p className="text-center text-muted-foreground py-4">Mark crops as favorites to see them here.</p>
      </TabsContent>
      <TabsContent value="trending" className="mt-4">
        <div className="space-y-3">
          {marketData
            .filter((item) => item.trend === 'up')
            .map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{item.crop}</p>
                  <p className="text-sm text-muted-foreground">{item.market}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.price}/{item.unit}</p>
                  <p className="text-xs text-green-600">+{item.change}% ↑</p>
                </div>
              </div>
            ))}
        </div>
      </TabsContent>
    </Tabs>
    <Button variant="outline" className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50">
      View Full Market Report
    </Button>
  </div>
);
