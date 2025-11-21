import { useEffect, useState } from 'react';

const readStoredRole = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) return 'job_seeker';
    const parsed = JSON.parse(stored);
    return parsed?.role || 'job_seeker';
  } catch (error) {
    console.warn('Failed to parse stored user role', error);
    return 'job_seeker';
  }
};

export const useUserRole = () => {
  const [role, setRole] = useState(() => {
    if (typeof window === 'undefined') return 'job_seeker';
    return readStoredRole();
  });

  useEffect(() => {
    const handleRoleChange = () => {
      setRole(readStoredRole());
    };

    window.addEventListener('storage', handleRoleChange);
    window.addEventListener('hiremate:user-change', handleRoleChange);

    return () => {
      window.removeEventListener('storage', handleRoleChange);
      window.removeEventListener('hiremate:user-change', handleRoleChange);
    };
  }, []);

  return role;
};


