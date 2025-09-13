// UserContext for role management
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'user' | 'leader' | 'admin';

interface UserContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('user');
  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
