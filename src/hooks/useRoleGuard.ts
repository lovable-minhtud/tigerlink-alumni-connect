import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';

export const useRoleGuard = (allowedRole: 'STUDENT' | 'ALUMNI') => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user && user.role !== allowedRole) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, allowedRole, navigate]);

  return { isAllowed: user?.role === allowedRole, isLoading };
};
