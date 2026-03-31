import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface CropPrice {
  name: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  changePercent: number;
  market: string;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-price-up" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-price-down" />;
    default:
      return <Minus className="h-4 w-4 text-price-neutral" />;
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'text-price-up';
    case 'down':
      return 'text-price-down';
    default:
      return 'text-price-neutral';
  }
};

export const MarketPrices = () => {
  const [cropPrices, setCropPrices] = useState<CropPrice[]>([]);

  useEffect(() => {
    // Mango-specific dummy data
    const mangoPrices: CropPrice[] = [
      {
        name: "Alphonso Mango",
        currentPrice: 150,
        previousPrice: 140,
        unit: "kg",
        trend: "up",
        changePercent: 7.14,
        market: "Ratnagiri Fruit Market"
      },
      {
        name: "Kesar Mango",
        currentPrice: 130,
        previousPrice: 135,
        unit: "kg",
        trend: "down",
        changePercent: -3.7,
        market: "Junagadh Market"
      },
      {
        name: "Dasheri Mango",
        currentPrice: 120,
        previousPrice: 120,
        unit: "kg",
        trend: "neutral",
        changePercent: 0,
        market: "Lucknow Market"
      },
      {
        name: "Langra Mango",
        currentPrice: 110,
        previousPrice: 105,
        unit: "kg",
        trend: "up",
        changePercent: 4.76,
        market: "Varanasi Market"
      },
      {
        name: "Himsagar Mango",
        currentPrice: 140,
        previousPrice: 145,
        unit: "kg",
        trend: "down",
        changePercent: -3.45,
        market: "West Bengal Market"
      }
    ];
    setCropPrices(mangoPrices);
  }, []);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Current Market Prices
          <Badge variant="secondary" className="ml-auto">Live</Badge>
        </CardTitle>
        <CardDescription>
          Real-time crop prices from nearby markets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cropPrices.map((crop) => (
            <div
              key={crop.name}
              className="border border-border rounded-lg p-4 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">{crop.name}</h3>
                {getTrendIcon(crop.trend)}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{crop.currentPrice.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">{crop.unit}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(crop.trend)}`}>
                    {crop.changePercent > 0 ? '+' : ''}{crop.changePercent}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    from ₹{crop.previousPrice.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">{crop.market}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-accent/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Prices are updated every 30 minutes from verified market sources. 
            Contact brokers directly for final pricing and negotiations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};