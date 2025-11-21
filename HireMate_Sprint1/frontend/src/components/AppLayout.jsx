import React, { useEffect } from 'react';
import { useUserRole } from '../hooks/useUserRole';

const AppLayout = ({ children }) => {
  const role = useUserRole();

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const body = document.body;
    const themeClass = role === 'company' ? 'theme-company' : 'theme-jobseeker';
    body.classList.remove('theme-company', 'theme-jobseeker');
    body.classList.add(themeClass);

    return () => {
      body.classList.remove(themeClass);
    };
  }, [role]);

  return (
    <div
      className={`min-h-screen ${
        role === 'company' ? 'company-surface text-slate-100' : 'job-surface text-slate-900'
      }`}
    >
      {children}
    </div>
  );
};

export default AppLayout;


