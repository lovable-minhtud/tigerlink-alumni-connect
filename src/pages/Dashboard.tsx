import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/Spinner';
import { matchApi } from '@/services/match.api';
import { ExternalLink, Users, Calendar, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const { data: matchResult, isLoading: isLoadingMatch } = useQuery({
    queryKey: ['matchResult'],
    queryFn: matchApi.getMatchResult,
    enabled: !!user,
  });

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

  const matchData = matchResult?.data;

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

          {/* Match Result Display */}
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {user?.role === 'STUDENT' ? 'Your Mentor Match' : 'Your Mentee Match'}
                </CardTitle>
                {matchData && (
                  <Badge variant={matchData.matchStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                    {matchData.matchStatus}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingMatch ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : matchData ? (
                <div className="space-y-6">
                  {/* Match Overview */}
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Matched on {new Date(matchData.matchedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{matchData.compatibilityScore}% Match</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Match Reason:</p>
                      <p className="text-sm text-muted-foreground">{matchData.matchReason}</p>
                    </div>
                  </div>

                  {/* Matched Person Profile */}
                  {user?.role === 'STUDENT' ? (
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{matchData.alumni.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{matchData.alumni.jobTitle} at {matchData.alumni.currentCompany}</p>
                          <p className="text-sm text-muted-foreground">Class of {matchData.alumni.gradYear} • {matchData.alumni.major}</p>
                        </div>
                        {matchData.alumni.linkedinUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://${matchData.alumni.linkedinUrl}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{matchData.alumni.aboutMe}</p>
                      <div>
                        <p className="text-sm font-medium mb-2">Fields of Expertise:</p>
                        <div className="flex flex-wrap gap-2">
                          {matchData.alumni.fieldsOfExpertise.map((field, idx) => (
                            <Badge key={idx} variant="secondary">{field}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Can Help With:</p>
                        <div className="flex flex-wrap gap-2">
                          {matchData.alumni.willingnessToHelp.map((help, idx) => (
                            <Badge key={idx} variant="outline">{help.replace('_', ' ')}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{matchData.student.fullName}</h3>
                          <p className="text-sm text-muted-foreground">Class of {matchData.student.gradYear} • {matchData.student.major}</p>
                          <p className="text-sm text-muted-foreground">{matchData.student.email}</p>
                        </div>
                        {matchData.student.linkedinUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://${matchData.student.linkedinUrl}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{matchData.student.aboutMe}</p>
                      <div>
                        <p className="text-sm font-medium mb-2">Career Interests:</p>
                        <div className="flex flex-wrap gap-2">
                          {matchData.student.careerInterests.map((interest, idx) => (
                            <Badge key={idx} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Request Details */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Request Details</h3>
                      <Badge>{matchData.request.requestType.replace('_', ' ')}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Message:</p>
                      <p className="text-sm text-muted-foreground">{matchData.request.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requested on {new Date(matchData.request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">No Active Match</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.role === 'STUDENT' 
                        ? 'Your mentorship request is still pending. We\'ll notify you when a match is found!'
                        : 'No mentee has been assigned to you yet. Check back soon!'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
