import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registrationSchema, RegistrationFormData } from '@/lib/zodSchemas';
import { authApi } from '@/services/auth.api';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/FormField';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/Spinner';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      
      // After successful registration, log in the user
      await authApi.login({
        email: data.email,
        passwordHash: data.passwordHash,
      });
      
      await login();
      
      toast({
        title: 'Registration successful!',
        description: 'Welcome to TigerLink',
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-medium)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Join TigerLink</CardTitle>
          <CardDescription className="text-center">
            Connect with DePauw alumni for mentorship opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full Name" error={errors.fullName?.message} required htmlFor="fullName">
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="DePauw Email" error={errors.email?.message} required htmlFor="email">
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@depauw.edu"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Password" error={errors.passwordHash?.message} required htmlFor="password">
              <Input
                id="password"
                type="password"
                {...register('passwordHash')}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="I am a..." error={errors.role?.message} required>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="STUDENT"
                    {...register('role')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                  <span className="text-sm">Student</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="ALUMNI"
                    {...register('role')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                  <span className="text-sm">Alumni</span>
                </label>
              </div>
            </FormField>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
