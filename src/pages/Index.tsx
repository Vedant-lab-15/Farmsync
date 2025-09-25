import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.role === 'broker') {
        navigate('/broker/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Only render Dashboard for farmers
  if (user.role === 'farmer') {
    return <Dashboard />;
  }

  // This should not be reached due to the redirects above
  return null;
};

export default Index;
