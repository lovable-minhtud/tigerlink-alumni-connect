import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { profileApi, ProfileData } from '@/services/profile.api';
import {
  studentProfileSchema,
  alumniProfileSchema,
  StudentProfileFormData,
  AlumniProfileFormData,
} from '@/lib/zodSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/forms/FormField';
import { MultiSelect } from '@/components/forms/MultiSelect';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/Spinner';

const CAREER_INTERESTS = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Law', label: 'Law' },
];

const EXPERTISE_FIELDS = [
  { value: 'Software Development', label: 'Software Development' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Investment Banking', label: 'Investment Banking' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
];

const HELP_TYPES = [
  { value: 'COFFEE_CHAT', label: 'Coffee Chat' },
  { value: 'RESUME_REVIEW', label: 'Resume Review' },
];

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [existingProfile, setExistingProfile] = useState<ProfileData | null>(null);

  const isStudent = user?.role === 'STUDENT';

  const studentForm = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      careerInterest: [],
    },
  });

  const alumniForm = useForm<AlumniProfileFormData>({
    resolver: zodResolver(alumniProfileSchema),
    defaultValues: {
      fieldOfExpertise: [],
      willingnessToHelp: [],
    },
  });

  const currentForm = isStudent ? studentForm : alumniForm;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await profileApi.getMyProfile();
        setExistingProfile(profile);

        if (profile) {
          if (isStudent) {
            studentForm.reset({
              gradYear: profile.gradYear || undefined,
              major: profile.major || '',
              aboutMe: profile.aboutMe || '',
              careerInterest: profile.careerInterests || [],
              linkedinProfile: profile.linkedinProfile || '',
              resumeUrl: profile.resumeS3Key || '',
            });
          } else {
            alumniForm.reset({
              gradYear: profile.gradYear || undefined,
              major: profile.major || '',
              aboutMe: profile.aboutMe || '',
              currentCompany: profile.currentCompany || '',
              jobTitle: profile.jobTitle || '',
              fieldOfExpertise: profile.fieldOfExpertise || [],
              willingnessToHelp: profile.willingnessToHelp as ('COFFEE_CHAT' | 'RESUME_REVIEW')[] || [],
              linkedinProfile: profile.linkedinProfile || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [isStudent]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const onSubmitStudent = async (data: StudentProfileFormData) => {
    setIsLoading(true);
    try {
      await profileApi.createStudentProfile(data);
      toast({
        title: 'Profile saved!',
        description: 'Your student profile has been updated successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitAlumni = async (data: AlumniProfileFormData) => {
    setIsLoading(true);
    try {
      await profileApi.createAlumniProfile(data);
      toast({
        title: 'Profile saved!',
        description: 'Your alumni profile has been updated successfully',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProfile) {
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
              <CardTitle>
                {existingProfile ? 'Update Your Profile' : 'Create Your Profile'}
              </CardTitle>
              <CardDescription>
                {isStudent
                  ? 'Complete your profile to start requesting mentorship from alumni'
                  : 'Share your expertise to help current DePauw students'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStudent ? (
                <form onSubmit={studentForm.handleSubmit(onSubmitStudent)} className="space-y-6">
                  <FormField
                    label="Graduation Year"
                    error={studentForm.formState.errors.gradYear?.message}
                    required
                    htmlFor="gradYear"
                  >
                    <Input
                      id="gradYear"
                      type="number"
                      {...studentForm.register('gradYear')}
                      placeholder="2025"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Major"
                    error={studentForm.formState.errors.major?.message}
                    required
                    htmlFor="major"
                  >
                    <Input
                      id="major"
                      {...studentForm.register('major')}
                      placeholder="Computer Science"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="About Me"
                    error={studentForm.formState.errors.aboutMe?.message}
                    htmlFor="aboutMe"
                  >
                    <Textarea
                      id="aboutMe"
                      {...studentForm.register('aboutMe')}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Career Interests"
                    error={studentForm.formState.errors.careerInterest?.message}
                    required
                  >
                    <MultiSelect
                      options={CAREER_INTERESTS}
                      value={studentForm.watch('careerInterest')}
                      onChange={(value) => studentForm.setValue('careerInterest', value)}
                    />
                  </FormField>

                  <FormField
                    label="LinkedIn Profile"
                    error={studentForm.formState.errors.linkedinProfile?.message}
                    required
                    htmlFor="linkedinProfile"
                  >
                    <Input
                      id="linkedinProfile"
                      {...studentForm.register('linkedinProfile')}
                      placeholder="https://linkedin.com/in/yourprofile"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Resume URL (Optional)"
                    error={studentForm.formState.errors.resumeUrl?.message}
                    htmlFor="resumeUrl"
                  >
                    <Input
                      id="resumeUrl"
                      {...studentForm.register('resumeUrl')}
                      placeholder="https://s3.amazonaws.com/..."
                      disabled={isLoading}
                    />
                  </FormField>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={alumniForm.handleSubmit(onSubmitAlumni)} className="space-y-6">
                  <FormField
                    label="Graduation Year"
                    error={alumniForm.formState.errors.gradYear?.message}
                    required
                    htmlFor="gradYear"
                  >
                    <Input
                      id="gradYear"
                      type="number"
                      {...alumniForm.register('gradYear')}
                      placeholder="2015"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Major"
                    error={alumniForm.formState.errors.major?.message}
                    required
                    htmlFor="major"
                  >
                    <Input
                      id="major"
                      {...alumniForm.register('major')}
                      placeholder="Economics"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="About Me"
                    error={alumniForm.formState.errors.aboutMe?.message}
                    htmlFor="aboutMe"
                  >
                    <Textarea
                      id="aboutMe"
                      {...alumniForm.register('aboutMe')}
                      placeholder="Tell students about your experience..."
                      rows={4}
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Current Company"
                    error={alumniForm.formState.errors.currentCompany?.message}
                    required
                    htmlFor="currentCompany"
                  >
                    <Input
                      id="currentCompany"
                      {...alumniForm.register('currentCompany')}
                      placeholder="Goldman Sachs"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Job Title"
                    error={alumniForm.formState.errors.jobTitle?.message}
                    required
                    htmlFor="jobTitle"
                  >
                    <Input
                      id="jobTitle"
                      {...alumniForm.register('jobTitle')}
                      placeholder="Vice President"
                      disabled={isLoading}
                    />
                  </FormField>

                  <FormField
                    label="Fields of Expertise"
                    error={alumniForm.formState.errors.fieldOfExpertise?.message}
                    required
                  >
                    <MultiSelect
                      options={EXPERTISE_FIELDS}
                      value={alumniForm.watch('fieldOfExpertise')}
                      onChange={(value) => alumniForm.setValue('fieldOfExpertise', value)}
                    />
                  </FormField>

                  <FormField
                    label="Willing to Help With"
                    error={alumniForm.formState.errors.willingnessToHelp?.message}
                    required
                  >
                    <MultiSelect
                      options={HELP_TYPES}
                      value={alumniForm.watch('willingnessToHelp')}
                      onChange={(value) => alumniForm.setValue('willingnessToHelp', value as ('COFFEE_CHAT' | 'RESUME_REVIEW')[])}
                    />
                  </FormField>

                  <FormField
                    label="LinkedIn Profile"
                    error={alumniForm.formState.errors.linkedinProfile?.message}
                    required
                    htmlFor="linkedinProfile"
                  >
                    <Input
                      id="linkedinProfile"
                      {...alumniForm.register('linkedinProfile')}
                      placeholder="https://linkedin.com/in/yourprofile"
                      disabled={isLoading}
                    />
                  </FormField>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
