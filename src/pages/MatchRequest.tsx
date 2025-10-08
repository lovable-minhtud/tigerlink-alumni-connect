import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { matchApi } from '@/services/match.api';
import { matchRequestSchema, MatchRequestFormData } from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/FormField';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/Spinner';

export const MatchRequest: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isAllowed, isLoading: isCheckingRole } = useRoleGuard('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MatchRequestFormData>({
    resolver: zodResolver(matchRequestSchema),
  });

  const selectedType = watch('type');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const onSubmit = async (data: MatchRequestFormData) => {
    setIsLoading(true);
    try {
      await matchApi.createMatchRequest(data);
      toast({
        title: 'Request submitted!',
        description: 'We will match you with an alumni mentor soon',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error submitting request',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
            TigerLink
          </h1>
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
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-[var(--shadow-medium)]">
            <CardHeader>
              <CardTitle>Request Mentorship</CardTitle>
              <CardDescription>
                Connect with an alumni mentor for career guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  label="Type of Mentorship"
                  error={errors.type?.message}
                  required
                >
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        value="COFFEE_CHAT"
                        {...register('type')}
                        className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                        disabled={isLoading}
                      />
                      <div>
                        <div className="font-medium">Coffee Chat</div>
                        <div className="text-sm text-muted-foreground">
                          Have an informal conversation about career paths, company culture, or industry insights
                        </div>
                      </div>
                    </label>
                    <label className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="radio"
                        value="RESUME_REVIEW"
                        {...register('type')}
                        className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                        disabled={isLoading}
                      />
                      <div>
                        <div className="font-medium">Resume Review</div>
                        <div className="text-sm text-muted-foreground">
                          Get feedback on your resume from an experienced professional
                        </div>
                      </div>
                    </label>
                  </div>
                </FormField>

                <FormField
                  label="Message to Your Mentor"
                  error={errors.message?.message}
                  required
                  htmlFor="message"
                >
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder={
                      selectedType === 'COFFEE_CHAT'
                        ? 'Introduce yourself and explain what you hope to learn from the coffee chat...'
                        : 'Describe your career goals and what specific feedback you\'re looking for...'
                    }
                    rows={6}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 20 characters, maximum 500 characters
                  </p>
                </FormField>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedType} className="flex-1">
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MatchRequest;
