import { Bell, Menu, User, Search, LogOut, Settings, HelpCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  userRole?: 'farmer' | 'broker' | 'admin';
}

export const DashboardHeader = ({ onMenuClick, userRole = 'farmer' }: DashboardHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const roleLabels = {
    farmer: 'Farmer',
    broker: 'Broker',
    admin: 'Admin'
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">FarmSync</h1>
                <p className="text-xs text-muted-foreground">{roleLabels[userRole]} Dashboard</p>
              </div>
            </div>
          </div>

          {/* Center - Search and Quick Actions */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops, markets, or buyers..."
                className="pl-10 w-full bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                <span className="hidden sm:inline">Track Shipment</span>
                <span className="sm:hidden">Track</span>
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <span className="hidden sm:inline">Sell Produce</span>
                <span className="sm:hidden">Sell</span>
              </Button>
            </div>
          </div>

          {/* Right side - Notifications and User Menu */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {roleLabels[userRole]}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuGroup className="p-2">
                  <DropdownMenuItem className="rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                    <HelpCircle className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="rounded-md px-3 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops, brokers, or markets..."
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};