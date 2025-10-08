import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/Spinner';

export const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">TigerLink</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.fullName} ({user?.role})
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Welcome to TigerLink</CardTitle>
              <CardDescription>
                {user?.role === 'STUDENT'
                  ? 'Connect with alumni mentors for career guidance and resume reviews'
                  : 'Help current students by sharing your expertise and experience'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => navigate('/profile')}>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile</CardTitle>
                    <CardDescription>
                      {user?.role === 'STUDENT'
                        ? 'Complete your student profile to start requesting mentorship'
                        : 'Update your professional information and mentorship preferences'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Manage Profile</Button>
                  </CardContent>
                </Card>

                {user?.role === 'STUDENT' && (
                  <Card className="border-2 hover:border-accent transition-colors cursor-pointer"
                    onClick={() => navigate('/match-request')}>
                    <CardHeader>
                      <CardTitle className="text-lg">Request Mentorship</CardTitle>
                      <CardDescription>
                        Request a coffee chat or resume review with an alumni mentor
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="default" className="w-full bg-accent hover:bg-accent/90">
                        New Request
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
