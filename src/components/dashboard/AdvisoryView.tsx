import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudRain, Bug, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  forecast: string;
  alerts: { type: string; message: string; severity: string }[];
}

interface PestAlert {
  id: string;
  crop: string;
  pest: string;
  risk: 'high' | 'medium' | 'low';
  message: string;
  recommendation: string;
}

interface Insight {
  id: string;
  type: string;
  title: string;
  message: string;
  action: string;
}

const riskColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export const AdvisoryView = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [wRes, pRes, iRes] = await Promise.all([
          apiFetch('/api/advisory/weather'),
          apiFetch('/api/advisory/pest'),
          apiFetch('/api/advisory/insights'),
        ]);
        if (wRes.ok) setWeather((await wRes.json()).data);
        if (pRes.ok) setPestAlerts((await pRes.json()).data);
        if (iRes.ok) setInsights((await iRes.json()).data);
      } catch (err) {
        console.error('Failed to fetch advisory data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Farm Advisory</h2>
        <p className="text-muted-foreground">Personalized recommendations for your farm</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Weather Card */}
        {weather && (
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-500" />
                Weather Advisory
              </CardTitle>
              <CardDescription>{weather.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="font-medium">{weather.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Humidity</span>
                <span className="font-medium">{weather.humidity}%</span>
              </div>
              <p className="text-sm border-t pt-3">{weather.forecast}</p>
              {weather.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Pest Alerts */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-orange-500" />
              Pest & Disease Alerts
            </CardTitle>
            <CardDescription>Current risks in your region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pestAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{alert.crop} — {alert.pest}</p>
                  <Badge className={riskColors[alert.risk]}>
                    {alert.risk.charAt(0).toUpperCase() + alert.risk.slice(1)} Risk
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <div className="flex items-start gap-2 mt-2 p-2 bg-green-50 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800">{alert.recommendation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Market Insights
          </CardTitle>
          <CardDescription>AI-powered recommendations for your farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <p className="font-medium text-sm mb-1">{insight.title}</p>
                <p className="text-sm text-muted-foreground mb-3">{insight.message}</p>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {insight.action}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
