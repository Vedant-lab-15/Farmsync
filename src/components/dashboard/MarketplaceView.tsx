import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { MarketOverview, MarketData } from './MarketOverview';

interface Listing {
  id: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  status: string;
}

interface MarketplaceViewProps {
  marketData: MarketData[];
  marketListings: Listing[];
}

export const MarketplaceView = ({ marketData, marketListings }: MarketplaceViewProps) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-bold">FarmSync Marketplace</h2>
        <p className="text-muted-foreground">Connect directly with buyers and sell your produce at the best prices</p>
      </div>
      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="mr-2 h-4 w-4" /> List New Product
      </Button>
    </div>

    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Listings ({marketListings.length})</CardTitle>
          <CardDescription>Manage your current product listings</CardDescription>
        </CardHeader>
        <CardContent>
          {marketListings.length > 0 ? (
            <div className="space-y-4">
              {marketListings.map((listing) => (
                <div key={listing.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{listing.crop} - {listing.variety}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.quantity}{listing.unit} • ₹{listing.price}/{listing.unit}
                      </p>
                      <p className="text-sm text-muted-foreground">{listing.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-10 w-10 mb-2 text-gray-300" />
              <p>You don't have any active listings yet.</p>
              <Button variant="link" className="text-green-600 p-0 h-auto mt-1">
                Create your first listing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Trends</CardTitle>
          <CardDescription>Current market prices for your region</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketOverview marketData={marketData} />
        </CardContent>
      </Card>
    </div>
  </div>
);
