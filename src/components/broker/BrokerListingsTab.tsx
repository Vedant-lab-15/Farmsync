import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus } from 'lucide-react';

export const BrokerListingsTab = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['brokerListings'],
    queryFn: async () => {
      const res = await apiFetch('/api/market/listings');
      if (!res.ok) throw new Error('Failed to fetch listings');
      return res.json();
    },
  });

  const listings = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">My Listings</h2>
          <p className="text-muted-foreground">Manage your active produce listings</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> New Listing
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-muted-foreground">No listings yet.</p>
            <Button variant="link" className="text-green-600 mt-1">Create your first listing</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing: any) => (
            <Card key={listing.id || listing._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{listing.crop} — {listing.variety}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {listing.quantity}{listing.unit} • ₹{listing.price}/{listing.unit} • {listing.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Quality: {listing.quality}</p>
                  </div>
                  <Badge className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {listing.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
