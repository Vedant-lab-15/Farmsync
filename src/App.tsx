import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import { SMSProvider } from "@/contexts/SMSContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerProfile from "./pages/FarmerProfile";
import BrokerDashboard from "./pages/broker/Dashboard";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SMSProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Farmer Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Broker Routes */}
            <Route
              path="/broker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['broker']}>
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['farmer', 'broker']}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            
            {/* Help & Support Route */}
            <Route
              path="/help"
              element={
                <ProtectedRoute allowedRoles={['farmer', 'broker']}>
                  <HelpSupport />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SMSProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
