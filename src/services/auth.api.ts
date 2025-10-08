import { api } from '@/lib/axios';
import { RegistrationFormData, LoginFormData } from '@/lib/zodSchemas';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI';
}

export interface AuthResponse {
  status: string;
  code: number;
  data: User;
  message: string;
}

export interface MeResponse {
  status: string;
  code: number;
  data: User;
  message: string;
}

export const authApi = {
  register: async (data: RegistrationFormData): Promise<AuthResponse> => {
    const response = await api.post('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<void> => {
    // Spring expects form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('email', data.email);
    formData.append('passwordHash', data.passwordHash);

    await api.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  logout: async (): Promise<void> => {
    await api.post('/api/v1/logout');
  },

  me: async (): Promise<User> => {
    const response = await api.get<MeResponse>('/api/v1/auth/me');
    return response.data.data;
  },
};
