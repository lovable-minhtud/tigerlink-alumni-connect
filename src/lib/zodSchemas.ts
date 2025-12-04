import { z } from 'zod';

// Registration Form Schema
export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('@depauw.edu'), {
      message: 'Must be a valid @depauw.edu email',
    }),
  passwordHash: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: 'Password must contain at least one letter and one number',
    }),
  role: z.enum(['STUDENT', 'ALUMNI']),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Login Form Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  passwordHash: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Student Profile Form Schema
export const studentProfileSchema = z.object({
  gradYear: z.coerce
    .number()
    .int('Graduation year must be a whole number')
    .min(1900, 'Invalid graduation year')
    .max(2100, 'Invalid graduation year'),
  major: z.string().min(2, 'Major must be at least 2 characters').max(100),
  aboutMe: z.string().max(200, 'About me must be less than 200 characters'),
  careerInterest: z.array(z.string()).min(1, 'Select at least one career interest'),
  linkedinProfile: z.string().url('Must be a valid URL'),
  resumeUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;

// Alumni Profile Form Schema
export const alumniProfileSchema = z.object({
  gradYear: z.coerce
    .number()
    .int('Graduation year must be a whole number')
    .min(1900, 'Invalid graduation year')
    .max(2100, 'Invalid graduation year'),
  major: z.string().min(2, 'Major must be at least 2 characters').max(100),
  aboutMe: z.string().max(200, 'About me must be less than 200 characters'),
  currentCompany: z.string().min(1, 'Company name is required').max(100),
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  fieldOfExpertise: z.array(z.string()).min(1, 'Select at least one field of expertise'),
  willingnessToHelp: z
    .array(z.enum(['COFFEE_CHAT', 'RESUME_REVIEW']))
    .min(1, 'Select at least one mentorship type'),
  linkedinProfile: z.string().url('Must be a valid URL'),
});

export type AlumniProfileFormData = z.infer<typeof alumniProfileSchema>;

// Match Request Form Schema
export const matchRequestSchema = z.object({
  type: z.enum(['COFFEE_CHAT', 'RESUME_REVIEW']),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(500, 'Message must be less than 500 characters'),
});

export type MatchRequestFormData = z.infer<typeof matchRequestSchema>;
