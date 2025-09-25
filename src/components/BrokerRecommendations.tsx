import { Star, Phone, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Broker {
  id: string;
  name: string;
  company: string;
  rating: number;
  reviewCount: number;
  distance: string;
  phone: string;
  specialties: string[];
  successRate: number;
  averagePrice: number;
  paymentTerms: string;
  verified: boolean;
}

const brokers: Broker[] = [
  {
    id: "1",
    name: "Raj Kumar Singh",
    company: "Singh Agro Traders",
    rating: 4.8,
    reviewCount: 124,
    distance: "2.5 km",
    phone: "+91 98765 43210",
    specialties: ["Rice", "Wheat", "Sugarcane"],
    successRate: 96,
    averagePrice: 2850,
    paymentTerms: "Payment within 24 hours",
    verified: true
  },
  {
    id: "2",
    name: "Priya Patel",
    company: "Green Valley Exports",
    rating: 4.6,
    reviewCount: 89,
    distance: "4.2 km",
    phone: "+91 87654 32109",
    specialties: ["Organic Crops", "Cotton", "Soybeans"],
    successRate: 94,
    averagePrice: 3200,
    paymentTerms: "Instant payment available",
    verified: true
  },
  {
    id: "3",
    name: "Mohammed Ali",
    company: "Ali Brothers Trading",
    rating: 4.5,
    reviewCount: 156,
    distance: "6.8 km",
    phone: "+91 76543 21098",
    specialties: ["Corn", "Wheat", "Barley"],
    successRate: 92,
    averagePrice: 2650,
    paymentTerms: "Weekly settlements",
    verified: true
  },
  {
    id: "4",
    name: "Sunita Sharma",
    company: "Sharma Commodity Hub",
    rating: 4.7,
    reviewCount: 67,
    distance: "3.1 km",
    phone: "+91 65432 10987",
    specialties: ["Pulses", "Oilseeds", "Spices"],
    successRate: 95,
    averagePrice: 3100,
    paymentTerms: "Flexible payment terms",
    verified: false
  }
];

export const BrokerRecommendations = () => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Recommended Brokers
          <Badge variant="secondary" className="ml-auto">Near You</Badge>
        </CardTitle>
        <CardDescription>
          Top-rated brokers in your area based on reviews and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brokers.map((broker) => (
            <div
              key={broker.id}
              className="border border-border rounded-lg p-4 hover:shadow-card transition-all hover:border-primary/20"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Broker Info */}
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={broker.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(broker.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {broker.name}
                          {broker.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{broker.company}</p>
                      </div>
                    </div>
                    
                    {/* Rating and Reviews */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{broker.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({broker.reviewCount} reviews)
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{broker.distance}</span>
                      </div>
                    </div>
                    
                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {broker.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <span className="ml-1 font-medium text-success">{broker.successRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Price:</span>
                        <span className="ml-1 font-medium">₹{broker.averagePrice.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-muted-foreground">Payment:</span>
                        <span className="ml-1 text-xs">{broker.paymentTerms}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 md:w-32">
                  <Button size="sm" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">View All Brokers</Button>
        </div>
      </CardContent>
    </Card>
  );
};