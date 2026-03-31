import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface TraceStage {
  stage: string;
  location: string;
  date: string;
  status: string;
  details: string;
}

interface TraceRecord {
  productId: string;
  farm: string;
  farmer: string;
  harvestDate: string;
  quality: string;
  certifications: string[];
  supplyChain: TraceStage[];
  tests: { type: string; result: string; date: string }[];
}

const SAMPLE_PRODUCTS = [
  { id: 'MANGO-2025-001', name: 'Alphonso Mango Batch #1', harvestDate: 'Sep 21, 2025' },
  { id: 'MANGO-2025-002', name: 'Kesar Mango Batch #2', harvestDate: 'Sep 25, 2025' },
  { id: 'MANGO-2025-003', name: 'Dasheri Mango Batch #3', harvestDate: 'Oct 01, 2025' },
];

export const TraceabilityView = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [record, setRecord] = useState<TraceRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrace = async (productId: string) => {
    setLoading(true);
    setSelected(productId);
    try {
      const res = await apiFetch(`/api/traceability/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setRecord(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch traceability:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Product Traceability</h2>
        <p className="text-muted-foreground">
          Track your products through the entire supply chain
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SAMPLE_PRODUCTS.map((product) => (
          <Card
            key={product.id}
            className={`cursor-pointer transition-all hover:shadow-md ${selected === product.id ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => fetchTrace(product.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm">{product.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Harvested: {product.harvestDate}</p>
              <Button variant="link" className="p-0 h-auto text-xs text-green-600 mt-1">
                View Journey <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
        </div>
      )}

      {record && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Journey — {record.productId}</CardTitle>
            <CardDescription>
              Farm: {record.farm} | Farmer: {record.farmer} | Quality: {record.quality}
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {record.certifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="bg-green-100 text-green-800">
                  {cert}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Supply Chain Stages</h4>
              <div className="relative">
                {record.supplyChain.map((stage, idx) => (
                  <div key={idx} className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      {idx < record.supplyChain.length - 1 && (
                        <div className="w-0.5 h-full bg-green-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm">{stage.stage}</p>
                      <p className="text-xs text-muted-foreground">{stage.location}</p>
                      <p className="text-xs text-muted-foreground">{stage.date}</p>
                      <p className="text-xs mt-1">{stage.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Quality Tests</h4>
              <div className="grid gap-2 md:grid-cols-3">
                {record.tests.map((test, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-xs font-medium">{test.type}</p>
                    <p className="text-sm font-bold text-green-700">{test.result}</p>
                    <p className="text-xs text-muted-foreground">{test.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
