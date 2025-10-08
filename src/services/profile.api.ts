import { api } from '@/lib/axios';
import { StudentProfileFormData, AlumniProfileFormData } from '@/lib/zodSchemas';

export interface ProfileData {
  userId: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI';
  gradYear: number | null;
  major: string | null;
  aboutMe: string | null;
  resumeS3Key: string | null;
  linkedinProfile: string | null;
  careerInterests: string[];
  currentCompany: string | null;
  jobTitle: string | null;
  fieldOfExpertise: string[];
  willingnessToHelp: string[];
}

export interface ProfileResponse {
  status: string;
  code: number;
  data: ProfileData;
  message: string;
}

export interface ProfileUpdateResponse {
  status: string;
  code: number;
  message: string;
}

export const profileApi = {
  getMyProfile: async (): Promise<ProfileData | null> => {
    try {
      const response = await api.get<ProfileResponse>('/api/v1/profile/me');
      return response.data.data;
    } catch (error: any) {
      // 404 means no profile exists yet - this is OK, not an error
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  createStudentProfile: async (data: StudentProfileFormData): Promise<ProfileUpdateResponse> => {
    const payload = {
      gradYear: data.gradYear,
      major: data.major,
      aboutMe: data.aboutMe,
      careerInterest: data.careerInterest,
      linkedinProfile: data.linkedinProfile,
      resumeUrl: data.resumeUrl || undefined,
    };
    const response = await api.post('/api/v1/profile/student', payload);
    return response.data;
  },

  createAlumniProfile: async (data: AlumniProfileFormData): Promise<ProfileUpdateResponse> => {
    const payload = {
      gradYear: data.gradYear,
      major: data.major,
      aboutMe: data.aboutMe,
      currentCompany: data.currentCompany,
      jobTitle: data.jobTitle,
      fieldOfExpertise: data.fieldOfExpertise,
      willingnessToHelp: data.willingnessToHelp,
      linkedinProfile: data.linkedinProfile,
    };
    const response = await api.post('/api/v1/profile/alumni', payload);
    return response.data;
  },
};
