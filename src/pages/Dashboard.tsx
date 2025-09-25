import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  Bell,
  History,
  Settings,
  HelpCircle,
  TrendingUp,
  Wallet,
  User as UserIcon,
  LogOut as LogOutIcon,
  Package,
  Truck,
  Leaf,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Users as UsersIcon
} from "lucide-react";
import { format } from "date-fns";

interface MarketData {
  id: string;
  crop: string;
  price: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  market: string;
}

interface Shipment {
  id: string;
  from: string;
  to: string;
  status: 'processing' | 'in-transit' | 'delivered';
  progress: number;
  estimatedDelivery: string;
}

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [marketListings, setMarketListings] = useState<any[]>([]);
  const [shipmentHistory, setShipmentHistory] = useState<any[]>([]);
  const [userOverview, setUserOverview] = useState<any>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }

    // Handle window resize for mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, loading, navigate]);

  // Fetch market data from backend
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/market', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMarketData(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    if (user) {
      fetchMarketData();
    }
  }, [user]);

  // Fetch shipments from backend
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/shipments', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setShipments(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      }
    };

    if (user) {
      fetchShipments();
    }
  }, [user]);

  // Fetch marketplace listings
  useEffect(() => {
    const fetchMarketListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/market/listings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMarketListings(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch market listings:', error);
      }
    };

    if (user) {
      fetchMarketListings();
    }
  }, [user]);

  // Fetch shipment history
  useEffect(() => {
    const fetchShipmentHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/shipments/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setShipmentHistory(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch shipment history:', error);
      }
    };

    if (user) {
      fetchShipmentHistory();
    }
  }, [user]);

  // Fetch user overview
  useEffect(() => {
    const fetchUserOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/overview', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserOverview(data.data || {});
        }
      } catch (error) {
        console.error('Failed to fetch user overview:', error);
      }
    };

    if (user) {
      fetchUserOverview();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Navigation menu items
  const menuItems = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "marketplace", name: "Marketplace", icon: TrendingUp },
    { id: "shipments", name: "My Shipments", icon: Truck },
    { id: "transactions", name: "Transactions", icon: Wallet },
    { id: "traceability", name: "Traceability", icon: ShieldCheck },
    { id: "advisory", name: "Advisory", icon: AlertCircle },
    { id: "profile", name: "My Profile", icon: UserIcon },
    { id: "settings", name: "Settings", icon: Settings },
    { id: "help", name: "Help & Support", icon: HelpCircle },
    { id: "logout", name: "Logout", icon: LogOutIcon, onClick: handleLogout },
  ];

  // Render different content based on active tab
  const renderContent = () => {
    if (activeTab === "profile") {
      navigate("/profile");
      return null;
    }
    
    switch (activeTab) {
      case "marketplace":
        return <MarketplaceView marketData={marketData} marketListings={marketListings} />;
      case "shipments":
        return <ShipmentsView shipments={shipments} shipmentHistory={shipmentHistory} />;
      case "traceability":
        return <TraceabilityView />;
      case "advisory":
        return <AdvisoryView />;
      case "overview":
      default:
        return <OverviewView marketData={marketData} shipments={shipments} userOverview={userOverview} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">FarmSync</h2>
                <p className="text-xs text-muted-foreground">Farmer Dashboard</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.onClick) item.onClick();
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold leading-7 text-gray-900">FarmSync</h2>
                <p className="text-xs text-gray-500">Farmer Dashboard</p>
              </div>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                        activeTab === item.id
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.onClick) item.onClick();
                      }}
                    >
                      <Icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          activeTab === item.id ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name || 'Farmer'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userRole="farmer"
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}! 👋
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {renderContent()}
            
            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-700">FarmSync</span>
                  <span>© 2025 All rights reserved</span>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Help Center</a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, change, icon, isCurrency = false }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <div className="h-4 w-4 text-muted-foreground">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {isCurrency ? '₹' : ''}{value}
      </div>
      <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change} {!change.includes('%') && 'from last month'}
      </p>
    </CardContent>
  </Card>
);

// Overview View Component
const OverviewView = ({ marketData, shipments, userOverview }) => (
  <div className="space-y-6">
    {/* Quick Stats */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Listings"
        value={userOverview.stats?.activeListings || "0"}
        change={userOverview.stats?.totalListings ? `+${userOverview.stats.totalListings - userOverview.stats.activeListings}` : "+0"}
        icon={<Package className="h-4 w-4" />}
      />
      <StatCard
        title="Total Revenue"
        value={userOverview.stats?.totalRevenue ? userOverview.stats.totalRevenue.toLocaleString() : "0"}
        change={userOverview.stats?.monthlyRevenue ? `+${((userOverview.stats.totalRevenue - userOverview.stats.monthlyRevenue) / userOverview.stats.monthlyRevenue * 100).toFixed(1)}%` : "+0%"}
        isCurrency={true}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        title="Active Shipments"
        value={userOverview.stats?.totalShipments || String(shipments.length)}
        change={userOverview.stats?.completedShipments ? `+${userOverview.stats.totalShipments - userOverview.stats.completedShipments}` : "+0"}
        icon={<Truck className="h-4 w-4" />}
      />
      <StatCard
        title="Average Rating"
        value={userOverview.stats?.averageRating ? `${userOverview.stats.averageRating}/5` : "0/5"}
        change={userOverview.stats?.averageRating ? `⭐ ${userOverview.stats.averageRating}` : "⭐ 0"}
        icon={<ShieldCheck className="h-4 w-4" />}
      />
    </div>

    {/* Market Overview & Shipments */}
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
          <ShipmentList shipments={shipments} />
        </CardContent>
      </Card>
    </div>

    {/* Traceability & Advisory */}
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
                <p className="text-sm font-medium leading-none">Tomato Batch #T-7892</p>
                <p className="text-sm text-muted-foreground">Harvested: Sep 20, 2025</p>
              </div>
              <Button variant="outline" size="sm">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
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
                <p className="text-sm text-muted-foreground">High risk of fruit borer in tomatoes. Consider preventive measures.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Market Tip</p>
                <p className="text-sm text-muted-foreground">Tomato prices expected to rise by 15% next week.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Market Overview Component
const MarketOverview = ({ marketData }) => (
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
                <p className="text-sm text-muted-foreground">Avg. price</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{item.price}/{item.unit}</p>
                <p className={`text-xs ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}% {item.trend === 'up' ? '↑' : '↓'}
                </p>
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

// Shipment List Component
const ShipmentList = ({ shipments }) => (
  <div className="space-y-4">
    {shipments.map((shipment) => (
      <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Shipment #{shipment.id}</p>
            <p className="text-sm text-muted-foreground">
              {shipment.from} → {shipment.to}
            </p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            shipment.status === 'in-transit' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{shipment.progress}%</span>
          </div>
          <Progress value={shipment.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Est. delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-3">
          Track Shipment
        </Button>
      </div>
    ))}
    
    <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50">
      View All Shipments
    </Button>
  </div>
);

// Marketplace View Component
const MarketplaceView = ({ marketData, marketListings }) => (
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
                      listing.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
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
              <Button variant="link" className="text-green-600 p-0 h-auto">
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

// Shipments View Component
const ShipmentsView = ({ shipments, shipmentHistory }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold">Shipment Tracking</h2>
      <p className="text-muted-foreground">Monitor your produce in real-time from farm to market</p>
    </div>

    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments ({shipments.length})</CardTitle>
          <CardDescription>Track your current shipments in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <ShipmentList shipments={shipments} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipment History ({shipmentHistory.length})</CardTitle>
          <CardDescription>Your past shipments and deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          {shipmentHistory.length > 0 ? (
            <div className="space-y-4">
              {shipmentHistory.map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Shipment #{shipment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.from} → {shipment.to}
                      </p>
                      <p className="text-sm text-muted-foreground">{shipment.crop} - {shipment.quantity}{shipment.unit}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(shipment.actualDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Time</span>
                      <span className="font-medium">{shipment.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium">⭐ {shipment.rating}/5</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 p-2 bg-gray-50 rounded">
                      "{shipment.feedback}"
                    </p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-10 w-10 mb-2 text-gray-300" />
              <p>No shipment history found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);

// Traceability View Component
const TraceabilityView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold">Product Traceability</h2>
      <p className="text-muted-foreground">Track your products through the entire supply chain with blockchain technology</p>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle>Your Traceable Products</CardTitle>
        <CardDescription>Scan the QR code to view the complete journey of your products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Tomato Batch #{item}</h3>
                    <p className="text-sm text-muted-foreground">Harvested: Sep {20 + item}, 2025</p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Traceability Score</span>
                    <span className="font-medium">{(100 - item * 10)}% Complete</span>
                  </div>
                  <Progress value={100 - item * 10} className="h-2" />
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Current Status</span>
                    <span className="font-medium">
                      {item === 1 ? 'In Transit' : item === 2 ? 'At Warehouse' : 'At Farm'}
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Trace
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Advisory View Component
const AdvisoryView = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold">Farm Advisory</h2>
      <p className="text-muted-foreground">Personalized recommendations and insights for your farm</p>
    </div>
    
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather Alerts</CardTitle>
          <CardDescription>Current and upcoming weather conditions for your region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CloudRain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Rain Alert</h3>
                <p className="text-sm text-blue-700">
                  Heavy rainfall expected in your area tomorrow. Consider delaying harvest if possible.
                </p>
                <p className="text-xs text-blue-600 mt-1">Updated: Today at 9:30 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pest & Disease Alerts</CardTitle>
          <CardDescription>Current threats to your crops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-800">Tomato Leaf Miner</h4>
                <p className="text-sm text-amber-700">
                  High risk in your area. Consider applying neem oil as a preventive measure.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Healthy Crop</h4>
                <p className="text-sm text-green-700">
                  Your rice crop is currently healthy with no signs of major diseases.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Latest market trends and pricing for your crops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Tomato Prices Rising</h4>
                <p className="text-sm text-muted-foreground">
                  Tomato prices have increased by 15% in your region. Consider timing your next harvest for maximum profit.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">New Buyers in Your Area</h4>
                <p className="text-sm text-muted-foreground">
                  3 new buyers are looking for organic tomatoes in your region. Update your listings to attract them.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;