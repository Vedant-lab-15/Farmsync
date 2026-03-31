import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package, Users, DollarSign, BarChart3, MessageSquare,
  Bell, Settings, LogOut as LogOutIcon, HelpCircle, Leaf,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { BrokerListingsTab } from '@/components/broker/BrokerListingsTab';
import { BrokerFarmersTab } from '@/components/broker/BrokerFarmersTab';
import { BrokerTransactionsTab } from '@/components/broker/BrokerTransactionsTab';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const BrokerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { id: 'overview', name: 'Dashboard', icon: BarChart3 },
    { id: 'listings', name: 'My Listings', icon: Package },
    { id: 'farmers', name: 'Farmers', icon: Users },
    { id: 'transactions', name: 'Transactions', icon: DollarSign },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'settings', name: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
    { id: 'help', name: 'Help & Support', icon: HelpCircle, onClick: () => navigate('/help') },
    { id: 'logout', name: 'Sign Out', icon: LogOutIcon, onClick: handleLogout },
  ];

  // Fetch broker overview from API
  const { data: overviewData } = useQuery({
    queryKey: ['brokerOverview'],
    queryFn: async () => {
      const res = await apiFetch('/api/users/overview');
      if (!res.ok) throw new Error('Failed to fetch overview');
      return res.json();
    },
    enabled: !!user,
  });

  const stats = overviewData?.data?.stats;

  const tabTitle: Record<string, string> = {
    overview: 'Dashboard',
    listings: 'My Listings',
    farmers: 'Farmers',
    transactions: 'Transactions',
    messages: 'Messages',
    notifications: 'Notifications',
    settings: 'Settings',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">FarmSync</h1>
                <p className="text-xs text-gray-500">Broker Portal</p>
              </div>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                  {user?.name?.charAt(0) || 'B'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Broker'}</p>
                  <p className="text-xs text-gray-500">ID: {user?.id?.substring(0, 8) || 'BROKER'}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick ? item.onClick : () => setActiveTab(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-green-500' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {tabTitle[activeTab] || activeTab}
            </h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                + New Listing
              </Button>
            </div>
          </div>
        </div>

        <main className="pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{(stats?.totalRevenue ?? 245000).toLocaleString('en-IN')}
                      </div>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.activeListings ?? 8}</div>
                      <p className="text-xs text-green-600">+2 from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87</div>
                      <p className="text-xs text-green-600">+5 from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹18,500</div>
                      <p className="text-xs text-green-600">+8% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent activities and notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { id: 1, message: 'New offer received for 50kg tomatoes', time: '2 hours ago' },
                          { id: 2, message: 'Price updated for onions', time: '5 hours ago' },
                          { id: 3, message: 'New message from Farmer Ramesh', time: '1 day ago' },
                        ].map((activity) => (
                          <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b last:border-0">
                            <div className="rounded-full bg-green-100 p-2 mr-3">
                              <Bell className="h-4 w-4 text-green-600" />
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
                          <Package className="mr-2 h-4 w-4" /> Create New Listing
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" /> Add New Farmer
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <DollarSign className="mr-2 h-4 w-4" /> Record Payment
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="mr-2 h-4 w-4" /> Send Bulk Message
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
                          <div className="text-3xl font-bold">{stats?.averageRating ?? 4.7}</div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(stats?.averageRating ?? 4.7) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Based on {stats?.totalShipments ?? 124} transactions
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'listings' && <BrokerListingsTab />}
            {activeTab === 'farmers' && <BrokerFarmersTab />}
            {activeTab === 'transactions' && <BrokerTransactionsTab />}

            {activeTab !== 'overview' && activeTab !== 'listings' && activeTab !== 'farmers' && activeTab !== 'transactions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tabTitle[activeTab] || activeTab}</CardTitle>
                  <CardDescription>This section is under development.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Content coming soon.</p>
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
