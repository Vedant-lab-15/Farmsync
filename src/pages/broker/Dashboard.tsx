import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  DollarSign, 
  BarChart3, 
  MessageSquare,
  Bell,
  Settings,
  LogOut as LogOutIcon,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - in a real app, this would come from an API
const mockBrokerData = {
  name: "Rajesh Kumar",
  rating: 4.7,
  totalTransactions: 124,
  activeListings: 8,
  totalEarnings: 245000,
  recentActivity: [
    { id: 1, type: 'new_offer', message: 'New offer received for 50kg tomatoes', time: '2 hours ago' },
    { id: 2, type: 'price_update', message: 'Price updated for onions', time: '5 hours ago' },
    { id: 3, type: 'new_message', message: 'New message from Farmer Ramesh', time: '1 day ago' },
  ],
  marketStats: {
    totalFarmers: 87,
    activeDeals: 12,
    pendingPayments: 2,
    avgTransactionValue: 18500,
  }
};

const BrokerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login?role=broker');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-primary">Broker Portal</h1>
            </div>
            <div className="px-4 mt-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-medium text-lg">
                      {user?.name?.charAt(0) || 'B'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Broker'}</p>
                  <p className="text-xs text-gray-500">Broker ID: {user?.id?.substring(0, 8) || 'BROKER'}</p>
                </div>
              </div>
            </div>
            <nav className="mt-6 flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick ? item.onClick : () => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                    (activeTab === item.id || activeTab === item.tab)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 mt-4 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOutIcon className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8
           flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'listings' && 'My Listings'}
              {activeTab === 'farmers' && 'Farmers'}
              {activeTab === 'transactions' && 'Transactions'}
              {activeTab === 'messages' && 'Messages'}
              {activeTab === 'notifications' && 'Notifications'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Button>
              <Button size="sm" onClick={() => navigate('/broker/listings/new')}>
                + New Listing
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Earnings
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{mockBrokerData.totalEarnings.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockBrokerData.activeListings}</div>
                      <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockBrokerData.marketStats.totalFarmers}</div>
                      <p className="text-xs text-muted-foreground">+5 from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{mockBrokerData.marketStats.avgTransactionValue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your recent activities and notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockBrokerData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start pb-4 last:pb-0">
                            <div className="rounded-full bg-primary/10 p-2 mr-3">
                              <Bell className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.message}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks at your fingertips</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          Create New Listing
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Add New Farmer
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Record Payment
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Bulk Message
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance</CardTitle>
                        <CardDescription>Your broker rating and stats</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <div className="text-3xl font-bold">{mockBrokerData.rating}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(mockBrokerData.rating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Based on {mockBrokerData.totalTransactions} transactions
                        </p>
                        <Button variant="link" className="mt-4 p-0 h-auto text-sm">
                          View detailed stats
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeTab !== 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeTab}</CardTitle>
                  <CardDescription>
                    {`This is the ${activeTab} section. Content will be added soon.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This section is under development. Please check back later for updates.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BrokerDashboard;
