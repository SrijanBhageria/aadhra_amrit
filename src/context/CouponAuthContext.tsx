'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearAccessToken,
  clearStoredTokens,
  getMyProfile,
  logout as apiLogout,
  setAuthFailureHandler,
  tryRestoreSession,
  verifyOtp as apiVerifyOtp,
} from '@/lib/coupon/api';
import { STORAGE_KEYS } from '@/lib/coupon/constants';
import type { MyProfileData } from '@/lib/coupon/types';

interface CouponAuthContextValue {
  phone: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: MyProfileData | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const CouponAuthContext = createContext<CouponAuthContextValue | null>(null);

export function CouponAuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<MyProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleAuthFailure = useCallback(() => {
    clearAccessToken();
    clearStoredTokens();
    setPhone(null);
    setIsAuthenticated(false);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      setProfile(await getMyProfile());
    } catch {
      // Keep last known profile on transient errors (404 is null from API).
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    setAuthFailureHandler(handleAuthFailure);

    const storedPhone = localStorage.getItem(STORAGE_KEYS.authPhone);
    tryRestoreSession()
      .then(async (restored) => {
        if (restored && storedPhone) {
          setPhone(storedPhone);
          setIsAuthenticated(true);
          setProfileLoading(true);
          try {
            setProfile(await getMyProfile());
          } catch {
            setProfile(null);
          } finally {
            setProfileLoading(false);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [handleAuthFailure]);

  const login = useCallback(async (loginPhone: string, otp: string) => {
    const data = await apiVerifyOtp(loginPhone, otp);
    setPhone(data.phone);
    setIsAuthenticated(true);
    setProfileLoading(true);
    try {
      setProfile(await getMyProfile());
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setPhone(null);
    setIsAuthenticated(false);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      phone,
      isAuthenticated,
      isLoading,
      profile,
      profileLoading,
      refreshProfile,
      login,
      logout,
    }),
    [phone, isAuthenticated, isLoading, profile, profileLoading, refreshProfile, login, logout],
  );

  return (
    <CouponAuthContext.Provider value={value}>{children}</CouponAuthContext.Provider>
  );
}

export function useCouponAuth(): CouponAuthContextValue {
  const ctx = useContext(CouponAuthContext);
  if (!ctx) {
    throw new Error('useCouponAuth must be used within CouponAuthProvider');
  }
  return ctx;
}
