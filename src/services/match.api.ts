import { api } from '@/lib/axios';
import { MatchRequestFormData } from '@/lib/zodSchemas';

export interface MatchRequestResponse {
  status: string;
  code: number;
  message: string;
}

export const matchApi = {
  createMatchRequest: async (data: MatchRequestFormData): Promise<MatchRequestResponse> => {
    const response = await api.post('/api/v1/match-request', data);
    return response.data;
  },
};
