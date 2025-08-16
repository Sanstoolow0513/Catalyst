import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface UserProfile {
  nickname: string;
  avatar: string | null;
}

interface UserContextType extends UserProfile {
  setProfile: (profile: Partial<UserProfile>) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [nickname, setNickname] = useState('Guest');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    // Load user profile from localStorage on initial load
    const savedNickname = localStorage.getItem('userNickname');
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedNickname) {
      setNickname(savedNickname);
    }
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const setProfile = (profile: Partial<UserProfile>) => {
    if (profile.nickname !== undefined) {
      const newNickname = profile.nickname || 'Guest';
      setNickname(newNickname);
      localStorage.setItem('userNickname', newNickname);
    }
    if (profile.avatar !== undefined) {
      setAvatar(profile.avatar);
      if (profile.avatar) {
        localStorage.setItem('userAvatar', profile.avatar);
      } else {
        localStorage.removeItem('userAvatar');
      }
    }
  };

  const value = {
    nickname,
    avatar,
    setProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
