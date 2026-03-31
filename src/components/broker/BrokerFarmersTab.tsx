import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Star, MapPin } from 'lucide-react';
import { useState } from 'react';

const MOCK_FARMERS = [
  { id: '1', name: 'Rajesh Kumar', location: 'Nashik, Maharashtra', crops: ['Tomato', 'Onion'], rating: 4.8, totalSales: 45, status: 'active' },
  { id: '2', name: 'Suresh Patil', location: 'Pune, Maharashtra', crops: ['Wheat', 'Rice'], rating: 4.5, totalSales: 32, status: 'active' },
  { id: '3', name: 'Anita Desai', location: 'Aurangabad, Maharashtra', crops: ['Mango', 'Grapes'], rating: 4.9, totalSales: 67, status: 'active' },
  { id: '4', name: 'Mohan Yadav', location: 'Solapur, Maharashtra', crops: ['Sugarcane', 'Jowar'], rating: 4.2, totalSales: 18, status: 'inactive' },
];

export const BrokerFarmersTab = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_FARMERS.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.crops.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Farmers</h2>
          <p className="text-muted-foreground">Manage your farmer network</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Users className="mr-2 h-4 w-4" /> Add Farmer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search farmers..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((farmer) => (
          <Card key={farmer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{farmer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {farmer.location}
                  </div>
                </div>
                <Badge className={farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {farmer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {farmer.crops.map((crop) => (
                  <span key={crop} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{crop}</span>
                ))}
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{farmer.rating}</span>
                </div>
                <span className="text-muted-foreground">{farmer.totalSales} sales</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Contact</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
