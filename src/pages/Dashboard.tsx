import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetch } from '@/lib/api';
import { DashboardHeader } from '@/components/DashboardHeader';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { MarketplaceView } from '@/components/dashboard/MarketplaceView';
import { ShipmentsView } from '@/components/dashboard/ShipmentsView';
import { TraceabilityView } from '@/components/dashboard/TraceabilityView';
import { AdvisoryView } from '@/components/dashboard/AdvisoryView';
import { MarketData } from '@/components/dashboard/MarketOverview';
import { Shipment } from '@/components/dashboard/ShipmentList';
import {
  BarChart3, TrendingUp, Truck, Wallet, User as UserIcon,
  LogOut as LogOutIcon, Package, ShieldCheck, AlertCircle,
  Settings, HelpCircle, Leaf,
} from 'lucide-react';

// Static mango market data (replace with API when available)
const MANGO_MARKET_DATA: MarketData[] = [
  { id: '1', crop: 'Alphonso Mango', price: 150, unit: 'kg', change: 7.14, trend: 'up', market: 'Ratnagiri Fruit Market' },
  { id: '2', crop: 'Kesar Mango', price: 130, unit: 'kg', change: -3.7, trend: 'down', market: 'Junagadh Market' },
  { id: '3', crop: 'Dasheri Mango', price: 120, unit: 'kg', change: 0, trend: 'neutral', market: 'Lucknow Market' },
  { id: '4', crop: 'Langra Mango', price: 110, unit: 'kg', change: 4.76, trend: 'up', market: 'Varanasi Market' },
  { id: '5', crop: 'Himsagar Mango', price: 140, unit: 'kg', change: -3.45, trend: 'down', market: 'West Bengal Market' },
];

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user, loading, navigate]);

  const { data: shipmentsData } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const res = await apiFetch('/api/shipments');
      if (!res.ok) throw new Error('Failed to fetch shipments');
      return res.json();
    },
    enabled: !!user,
  });

  const { data: shipmentHistoryData } = useQuery({
    queryKey: ['shipmentHistory'],
    queryFn: async () => {
      const res = await apiFetch('/api/shipments/history');
      if (!res.ok) throw new Error('Failed to fetch shipment history');
      return res.json();
    },
    enabled: !!user,
  });

  const { data: marketListingsData } = useQuery({
    queryKey: ['marketListings'],
    queryFn: async () => {
      const res = await apiFetch('/api/market/listings');
      if (!res.ok) throw new Error('Failed to fetch market listings');
      return res.json();
    },
    enabled: !!user,
  });

  const { data: userOverviewData } = useQuery({
    queryKey: ['userOverview'],
    queryFn: async () => {
      const res = await apiFetch('/api/users/overview');
      if (!res.ok) throw new Error('Failed to fetch user overview');
      return res.json();
    },
    enabled: !!user,
  });

  const shipments: Shipment[] = shipmentsData?.data || [];
  const shipmentHistory = shipmentHistoryData?.data || [];
  const marketListings = marketListingsData?.data || [];
  const userOverview = userOverviewData?.data || {};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'marketplace', name: 'Marketplace', icon: TrendingUp },
    { id: 'shipments', name: 'My Shipments', icon: Truck },
    { id: 'transactions', name: 'Transactions', icon: Wallet },
    { id: 'traceability', name: 'Traceability', icon: ShieldCheck },
    { id: 'advisory', name: 'Advisory', icon: AlertCircle },
    { id: 'profile', name: 'My Profile', icon: UserIcon, onClick: () => navigate('/profile') },
    { id: 'settings', name: 'Settings', icon: Settings, onClick: () => navigate('/settings') },
    { id: 'help', name: 'Help & Support', icon: HelpCircle, onClick: () => navigate('/help') },
    { id: 'logout', name: 'Logout', icon: LogOutIcon, onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <MarketplaceView marketData={MANGO_MARKET_DATA} marketListings={marketListings} />;
      case 'shipments':
        return <ShipmentsView shipments={shipments} shipmentHistory={shipmentHistory} />;
      case 'traceability':
        return <TraceabilityView />;
      case 'advisory':
        return <AdvisoryView />;
      case 'overview':
      default:
        return <OverviewView marketData={MANGO_MARKET_DATA} shipments={shipments} userOverview={userOverview} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  const SidebarNav = ({ onItemClick }: { onItemClick?: () => void }) => (
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
              if (item.onClick) {
                item.onClick();
              } else {
                setActiveTab(item.id);
              }
              onItemClick?.();
            }}
          >
            <Icon
              className={`mr-3 flex-shrink-0 h-5 w-5 ${
                activeTab === item.id ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.name}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-lg flex flex-col">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">FarmSync</h2>
                <p className="text-xs text-muted-foreground">Farmer Dashboard</p>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <SidebarNav onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold text-gray-900">FarmSync</h2>
                <p className="text-xs text-gray-500">Farmer Dashboard</p>
              </div>
            </div>
            <SidebarNav />
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Farmer'}</p>
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
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} userRole="farmer" />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}!
              </h1>
              <p className="text-muted-foreground">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {renderContent()}

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

export default Dashboard;
