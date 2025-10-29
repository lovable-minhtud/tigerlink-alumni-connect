import { api } from '@/lib/axios';
import { MatchRequestFormData } from '@/lib/zodSchemas';

export interface MatchRequestResponse {
  status: string;
  code: number;
  message: string;
}

export interface StudentProfile {
  userId: string;
  fullName: string;
  email: string;
  gradYear: number;
  major: string;
  aboutMe: string;
  linkedinUrl: string;
  careerInterests: string[];
}

export interface AlumniProfile {
  userId: string;
  fullName: string;
  email: string;
  gradYear: number;
  major: string;
  aboutMe: string;
  currentCompany: string;
  jobTitle: string;
  linkedinUrl: string;
  fieldsOfExpertise: string[];
  willingnessToHelp: string[];
}

export interface MatchRequest {
  requestId: string;
  requestType: 'COFFEE_CHAT' | 'RESUME_REVIEW';
  message: string;
  resumeS3Key: string | null;
  createdAt: string;
}

export interface MatchData {
  matchId: string;
  matchStatus: 'ACTIVE' | 'COMPLETED';
  matchedAt: string;
  completedAt: string | null;
  compatibilityScore: number;
  matchReason: string;
  student: StudentProfile;
  alumni: AlumniProfile;
  request: MatchRequest;
}

export interface MatchResultResponse {
  status: string;
  statusCode: number;
  data: MatchData | null;
  message: string;
}

export const matchApi = {
  createMatchRequest: async (data: MatchRequestFormData): Promise<MatchRequestResponse> => {
    const response = await api.post('/api/v1/match-request', data);
    return response.data;
  },
  
  getMatchResult: async (): Promise<MatchResultResponse> => {
    const response = await api.get('/api/v1/match/match-result');
    return response.data;
  },
};
