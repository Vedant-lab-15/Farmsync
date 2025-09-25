import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Truck, Clock, ArrowRight, AlertCircle, Map, RefreshCw } from "lucide-react";
import { loadGoogleMaps, calculateRoute, initMap } from "@/lib/googleMaps";
import { useToast } from "@/components/ui/use-toast";

// Google Maps API Key - Using mock data by default
// In production, set this in your environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Enable Google Maps API (set to false to use mock data)
const ENABLE_GOOGLE_MAPS = true; // Enabled to use real Google Maps data

// Debug info
if (import.meta.env.DEV) {
  console.log('Google Maps API Key configured:', GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');
  console.log('Google Maps API enabled:', ENABLE_GOOGLE_MAPS);
  
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('No Google Maps API key found. Using mock data.');
  }
}

// Mock data for demonstration
// Major agricultural markets in Maharashtra
const markets = [
  { 
    id: 'mumbai', 
    name: 'Mumbai APMC', 
    address: 'APMC Market, Vashi, Navi Mumbai, Maharashtra',
    coordinates: { lat: 19.0760, lng: 72.9986 },
  },
  { 
    id: 'pune', 
    name: 'Pune APMC', 
    address: 'Market Yard, Gultekdi, Pune, Maharashtra',
    coordinates: { lat: 18.4815, lng: 73.8643 },
  },
  { 
    id: 'nashik', 
    name: 'Nashik APMC', 
    address: 'Adgaon Naka, Nashik, Maharashtra',
    coordinates: { lat: 19.9975, lng: 73.7898 },
  },
  { 
    id: 'nagpur', 
    name: 'Kalamna Market', 
    address: 'Kalamna, Nagpur, Maharashtra',
    coordinates: { lat: 21.1458, lng: 79.0882 },
  },
];

const transportTypes = [
  { 
    id: 'truck', 
    name: 'Truck (10 Ton)', 
    rate: 15, // Base rate per km
    fuelEfficiency: 4, // km/liter
    driverCost: 2000, // per day
    maintenance: 0.5, // per km
  },
  { 
    id: 'mini_truck', 
    name: 'Mini Truck (5 Ton)', 
    rate: 12, 
    fuelEfficiency: 6, 
    driverCost: 1500, 
    maintenance: 0.4, 
  },
  { 
    id: 'pickup', 
    name: 'Pickup (2 Ton)', 
    rate: 10, 
    fuelEfficiency: 8, 
    driverCost: 1000, 
    maintenance: 0.3, 
  },
];

// Current fuel price (can be fetched from an API in production)
const FUEL_PRICE = 100; // ₹ per liter
const AVERAGE_SPEED = 40; // km/h

interface RouteDetails {
  id: string;
  name: string;
  address: string;
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  cost: {
    fuel: number;
    labor: number;
    maintenance: number;
    total: number;
    formatted: string;
  };
  steps?: Array<{
    instructions: string;
    distance: { text: string; value: number };
    duration: { text: string; value: number };
  }>;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function RouteOptimizer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [origin, setOrigin] = useState('');
  const [transport, setTransport] = useState('truck');
  const [routes, setRoutes] = useState<RouteDetails[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  // Generate routes using real or mock data
  const calculateRoutes = useCallback(async (origin: string, transport: TransportType): Promise<RouteDetails[]> => {
    // If Google Maps API is not available, use mock data
    if (!ENABLE_GOOGLE_MAPS || !window.google?.maps) {
      console.log('Using mock data - Google Maps API not available');
      return markets.map((market) => ({
        id: market.id,
        name: market.name,
        address: market.address,
        distance: {
          text: `${Math.floor(Math.random() * 200) + 50} km`,
          value: (Math.floor(Math.random() * 200) + 50) * 1000, // meters
        },
        duration: {
          text: `${Math.floor(Math.random() * 3) + 1} hours ${Math.floor(Math.random() * 60)} mins`,
          value: (Math.floor(Math.random() * 3) + 1) * 3600 + Math.floor(Math.random() * 60) * 60, // seconds
        },
        cost: calculateTransportCost(
          Math.floor(Math.random() * 200) + 50,
          transport
        ),
        coordinates: market.coordinates,
        origin: {
          query: origin,
          location: new window.google.maps.LatLng(18.5204, 73.8567), // Default to Pune
          address: origin
        },
        destination: {
          query: market.address,
          location: new window.google.maps.LatLng(market.coordinates.lat, market.coordinates.lng),
          address: market.address
        },
        overview_path: [],
        steps: []
      }));
    }

    // Use Google Maps Directions Service for real data
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      // First, geocode the origin address
      const originGeocode = await new Promise<google.maps.GeocoderResult>((resolve, reject) => {
        geocoder.geocode({ address: origin }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(new Error(`Could not find origin location: ${status}`));
          }
        });
      });

      const routePromises = markets.map(async (market) => {
        try {
          const route = await calculateRoute(origin, market.address);
          if (!route) return null;

          const cost = calculateTransportCost(route.distance.value / 1000, transport);
          
          return {
            id: market.id,
            name: market.name,
            address: market.address,
            origin: {
              ...originGeocode,
              query: origin,
              address: originGeocode.formatted_address || origin
            },
            destination: {
              query: market.address,
              location: new window.google.maps.LatLng(market.coordinates.lat, market.coordinates.lng),
              address: market.address
            },
            distance: route.distance,
            duration: route.duration,
            cost,
            steps: route.steps || [],
            coordinates: market.coordinates,
            overview_path: route.overview_path || []
          };
        } catch (error) {
          console.error(`Error calculating route to ${market.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(routePromises);
      return results.filter((route): route is RouteDetails => route !== null);
    } catch (error) {
      console.error('Error generating routes:', error);
      throw error;
    }
  }, [transport]);

  // Load Google Maps API or use mock data
  const loadMaps = useCallback(async () => {
    if (!ENABLE_GOOGLE_MAPS) {
      console.log('Using mock data for routes');
      setMapsLoaded(true);
      return;
    }

    try {
      console.log('Loading Google Maps API...');
      const loaded = await loadGoogleMaps(GOOGLE_MAPS_API_KEY);
      
      if (loaded) {
        console.log('Google Maps API loaded successfully');
        setMapsLoaded(true);
      } else {
        console.warn('Google Maps API failed to load, using mock data');
        toast({
          title: 'Using Demo Data',
          description: 'Google Maps API not available. Showing demo data.',
          variant: 'default',
        });
        setMapsLoaded(true); // Still show the UI with mock data
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      toast({
        title: 'Using Demo Data',
        description: 'Failed to load maps. Showing demo data instead.',
        variant: 'default',
      });
      setMapsLoaded(true); // Still show the UI with mock data
    }
  }, [toast]);

  useEffect(() => {
    if (ENABLE_GOOGLE_MAPS && !window.google?.maps) {
      loadMaps();
    } else {
      console.log('Google Maps already loaded or disabled');
      setMapsLoaded(true);
    }
  }, [loadMaps]);

  const calculateTransportCost = (distanceKm: number, transportType: TransportType) => {
    const fuelUsed = distanceKm / transportType.fuelEfficiency;
    const fuelCost = fuelUsed * FUEL_PRICE;
    const laborCost = (distanceKm / AVERAGE_SPEED) * (transportType.driverCost / 8); // Assuming 8-hour workday
    const maintenanceCost = distanceKm * transportType.maintenance;
    const totalCost = fuelCost + laborCost + maintenanceCost;

    return {
      fuel: Math.round(fuelCost),
      labor: Math.round(laborCost),
      maintenance: Math.round(maintenanceCost),
      total: Math.round(totalCost),
      formatted: `₹${Math.round(totalCost).toLocaleString()}`,
    };
  };

  const findOptimalRoutes = async () => {
    if (!origin) {
      toast({
        title: 'Origin required',
        description: 'Please enter your farm location',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    setRoutes([]);
    setSelectedRoute(null);

    try {
      const routes = await calculateRoutes(origin, transport);
      
      if (routes.length === 0) {
        throw new Error('No valid routes found');
      }
      
      // Sort by total cost (cheapest first)
      routes.sort((a, b) => a.cost.total - b.cost.total);
      setRoutes(routes);
      
      // Auto-select the first (cheapest) route
      if (routes.length > 0) {
        handleRouteSelect(routes[0]);
      }
      
    } catch (error) {
      console.error('Error finding routes:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate routes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (route: RouteDetails) => {
    if (selectedRoute === route.id) {
      setSelectedRoute(null);
      if (mapInstance.current) {
        // Clear the map when deselecting
        const map = mapInstance.current;
        map.setCenter({ lat: 18.5204, lng: 73.8567 }); // Default to Pune
        map.setZoom(7);
      }
      return;
    }

    setSelectedRoute(route.id);
    
    // Don't try to initialize map if we're using mock data
    if (!ENABLE_GOOGLE_MAPS || !window.google?.maps) {
      console.log('Using mock data - map visualization not available');
      return;
    }
    
    // Initialize or update the map with the selected route
    if (mapRef.current) {
      try {
        // Get the selected route data
        const route = routes.find(r => r.id === selectedRoute);
        if (!route) return;
        
        // Get origin and destination coordinates
        const originLocation = route.origin?.location || 
          new window.google.maps.LatLng(18.5204, 73.8567); // Default to Pune
        
        const destinationLocation = route.destination?.location || 
          new window.google.maps.LatLng(route.coordinates.lat, route.coordinates.lng);
        
        // Initialize the map if it doesn't exist
        if (!mapInstance.current) {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: originLocation,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });
        }
        
        // Initialize window objects if they don't exist
        if (!window.markers) window.markers = [];
        if (!window.polylines) window.polylines = [];
        
        // Clear existing markers and polylines
        window.markers.forEach(marker => marker.setMap(null));
        window.polylines.forEach(line => line.setMap(null));
        window.markers = [];
        window.polylines = [];
        
        // Add origin marker
        const originMarker = new window.google.maps.Marker({
          position: originLocation,
          map: mapInstance.current,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#34D399',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          },
        });
        window.markers.push(originMarker);
        
        // Add destination marker
        const destMarker = new window.google.maps.Marker({
          position: destinationLocation,
          map: mapInstance.current,
          title: route.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#EF4444',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
          },
        });
        window.markers.push(destMarker);
        
        // Draw route if we have path data
        if (route.overview_path && route.overview_path.length > 0) {
          // Use overview path if available
          const routeLine = new window.google.maps.Polyline({
            path: route.overview_path,
            geodesic: true,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 4,
          });
          
          routeLine.setMap(mapInstance.current);
          window.polylines.push(routeLine);
          
          // Fit bounds to show the entire route
          const bounds = new window.google.maps.LatLngBounds();
          route.overview_path.forEach(point => bounds.extend(point));
          mapInstance.current.fitBounds(bounds, { padding: 50 });
        } else if (route.steps && route.steps.length > 0) {
          // Fallback to steps if overview path is not available
          const path: google.maps.LatLng[] = [];
          
          route.steps.forEach(step => {
            if ('path' in step && Array.isArray(step.path)) {
              path.push(...step.path);
            } else if ('start_location' in step && 'end_location' in step) {
              path.push(step.start_location, step.end_location);
            }
          });
          
          if (path.length > 0) {
            const routeLine = new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            });
            
            routeLine.setMap(mapInstance.current);
            window.polylines.push(routeLine);
            
            // Fit bounds to show the entire route
            const bounds = new window.google.maps.LatLngBounds();
            path.forEach(point => bounds.extend(point));
            mapInstance.current.fitBounds(bounds, { padding: 50 });
          }    
        } else {
          // Fallback: Draw straight line if no detailed path is available
          const directLine = new window.google.maps.Polyline({
            path: [originLocation, destinationLocation],
            geodesic: true,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            strokeDashArray: [5, 5] // Dashed line for approximate route
          });
          directLine.setMap(mapInstance.current);
          window.polylines.push(directLine);
        }
        
        // Store markers for cleanup
        if (!window.markers) window.markers = [];
        window.markers.push(originMarker, destMarker);
        
        // Fit bounds to show both markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(originLocation);
        bounds.extend(destinationLocation);
        mapInstance.current.fitBounds(bounds, { padding: 50 });
        
        // Add a small delay to ensure the map renders before any animations
        setTimeout(() => {
          // Add a small animation to the destination marker
          if (destMarker) {
            destMarker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
              if (destMarker) destMarker.setAnimation(null);
            }, 1500);
          }
        }, 500);
        
        // Add a small delay to ensure the map is fully rendered
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 300);
      bounds.extend(route.coordinates);
      map.fitBounds(bounds, { padding: 50 });
      
      // Add a small delay to ensure the map renders before any animations
      setTimeout(() => {
        // Add a small animation to the destination marker
        if (destMarker) {
          destMarker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            if (destMarker) destMarker.setAnimation(null);
          }, 1500);
        }
      }, 500);
      
      // Add a small delay to ensure the map is fully rendered
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: 'Map Error',
          description: 'Could not load the map. Route details are still available.',
          variant: 'default',
        });
      }
    }
  };

  // Handle current location button click
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          if (window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              (results, status) => {
                setLoading(false);
                if (status === 'OK' && results?.[0]) {
                  setOrigin(results[0].formatted_address);
                } else {
                  toast({
                    title: 'Location found',
                    description: 'Enter your farm name or address for better accuracy',
                    variant: 'default',
                  });
                  setOrigin(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                }
              }
            );
          } else {
            setLoading(false);
            setOrigin(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        },
        (error) => {
          setLoading(false);
          console.error('Error getting location:', error);
          toast({
            title: 'Location access denied',
            description: 'Please enter your location manually',
            variant: 'destructive',
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex flex-col space-y-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="w-5 h-5 text-primary" />
            Route Optimization
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Find the most cost-effective route to your target markets
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin (Your Farm Location)</Label>
              <div className="relative">
                <Input
                  id="origin"
                  placeholder="Enter your farm address or click the location icon"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  disabled={loading}
                  title="Use current location"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <MapPin className="w-4 h-4 text-primary" />
                  )}
                </button>
              </div>
              {!mapsLoaded && (
                <div className="space-y-2">
                  <p className="text-sm text-yellow-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {window.google?.maps ? 'Initializing maps...' : 'Loading maps...'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadMaps}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry Loading Maps
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transport">Transport Type</Label>
              <Select value={transport} onValueChange={setTransport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                <SelectContent>
                  {transportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
                onClick={findOptimalRoutes}
                disabled={!origin || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Best Routes...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Find Best Routes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {routes.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-medium text-lg">Recommended Routes</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for cost and travel time
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">
                    {routes.length} market{routes.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3 lg:col-span-2">
                  {routes.map((route) => (
                  <div 
                    key={route.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoute === route.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleRouteSelect(route)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-medium">{route.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Truck className="w-4 h-4 mr-1" />
                          {route.distance.text} • {route.duration.text}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {route.cost.formatted}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(route.distance.value / 1000)} km
                        </div>
                      </div>
                    </div>
                    
                    {selectedRoute === route.id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="font-medium">Route Details</div>
                            <div className="space-y-1 text-muted-foreground">
                              <div className="flex items-start">
                                <MapPin className="w-4 h-4 mt-1 mr-2 flex-shrink-0" />
                                <div>
                                  <div className="font-medium">From:</div>
                                  <div className="text-foreground">{origin}</div>
                                  <div className="my-1 flex items-center text-primary">
                                    <ArrowRight className="w-4 h-4" />
                                  </div>
                                  <div className="font-medium">To:</div>
                                  <div className="text-foreground">{route.address}</div>
                                </div>
                              </div>
                              <div className="flex items-center pt-2">
                                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span>Estimated time: {route.duration.text}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium">Cost Breakdown</div>
                            <div className="space-y-1 text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Fuel Cost:</span>
                                <span>₹{route.cost.fuel.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Labor Cost:</span>
                                <span>₹{route.cost.labor.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Maintenance:</span>
                                <span>₹{route.cost.maintenance.toLocaleString()}</span>
                              </div>
                              <div className="border-t border-border pt-1 mt-1 flex justify-between font-medium text-foreground">
                                <span>Total Cost:</span>
                                <span>{route.cost.formatted}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="font-medium">Transport Details</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>
                                <span className="font-medium">Vehicle:</span>{" "}
                                {transportTypes.find(t => t.id === transport)?.name}
                              </div>
                              <div>
                                <span className="font-medium">Fuel Efficiency:</span>{" "}
                                {transportTypes.find(t => t.id === transport)?.fuelEfficiency} km/liter
                              </div>
                              <div>
                                <span className="font-medium">Fuel Cost:</span> ₹{FUEL_PRICE}/liter
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-end space-y-2">
                            <div className="flex space-x-2">
                              <Button variant="outline" className="flex-1">
                                <Map className="w-4 h-4 mr-2" />
                                View Full Route
                              </Button>
                              <Button className="flex-1">
                                <Truck className="w-4 h-4 mr-2" />
                                Book Transport
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                              Prices include all taxes and tolls
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
              
              {/* Map Container */}
              <div className="hidden lg:block">
                <div className="sticky top-4">
                  <div 
                    ref={mapRef} 
                    className="h-[500px] w-full rounded-lg border bg-muted"
                  >
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      {!selectedRoute ? (
                        <div className="text-center p-4">
                          <MapPin className="w-8 h-8 mx-auto mb-2" />
                          <p>Select a route to view on map</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedRoute && (
                    <div className="mt-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                <MapPin className="w-3 h-3 text-green-500" />
                <span>Your Location</span>
                <span className="mx-2">•</span>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Market</span>
              </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
