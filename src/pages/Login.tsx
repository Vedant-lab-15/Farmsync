import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type UserRole = 'farmer' | 'broker';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(email, password, role);
      if (user) {
        navigate(role === 'farmer' ? '/' : '/broker/dashboard');
      }
    } catch (err) {
      // Error is already handled in the AuthContext
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">FarmSync</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Empowering farmers with market intelligence
          </p>
        </div>

        <Tabs 
          defaultValue="farmer" 
          className="w-full"
          onValueChange={(value) => setRole(value as UserRole)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="farmer">Farmer Login</TabsTrigger>
            <TabsTrigger value="broker">Broker Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value={role} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {role === 'farmer' ? 'Farmer' : 'Broker'} Login
                </CardTitle>
                <CardDescription>
                  {role === 'farmer' 
                    ? 'Access your farmer dashboard to get the best market prices.'
                    : 'Manage your broker account and connect with farmers.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    to={`/register?role=${role}`} 
                    className="text-primary hover:underline"
                  >
                    Sign up as a {role}
                  </Link>
                </p>
                {role === 'broker' && (
                  <p className="text-sm text-muted-foreground text-center">
                    Looking to sell your crops?{' '}
                    <Link 
                      to="/login?role=farmer" 
                      className="text-primary hover:underline"
                      onClick={() => setRole('farmer')}
                    >
                      Switch to Farmer Login
                    </Link>
                  </p>
                )}
                {role === 'farmer' && (
                  <p className="text-sm text-muted-foreground text-center">
                    Are you a broker?{' '}
                    <Link 
                      to="/login?role=broker" 
                      className="text-primary hover:underline"
                      onClick={() => setRole('broker')}
                    >
                      Switch to Broker Login
                    </Link>
                  </p>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
