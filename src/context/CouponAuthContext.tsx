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
  logout as apiLogout,
  setAuthFailureHandler,
  tryRestoreSession,
  verifyOtp as apiVerifyOtp,
} from '@/lib/coupon/api';
import { STORAGE_KEYS } from '@/lib/coupon/constants';

interface CouponAuthContextValue {
  phone: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const CouponAuthContext = createContext<CouponAuthContextValue | null>(null);

export function CouponAuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthFailure = useCallback(() => {
    clearAccessToken();
    clearStoredTokens();
    setPhone(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setAuthFailureHandler(handleAuthFailure);

    const storedPhone = localStorage.getItem(STORAGE_KEYS.authPhone);
    tryRestoreSession()
      .then((restored) => {
        if (restored && storedPhone) {
          setPhone(storedPhone);
          setIsAuthenticated(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [handleAuthFailure]);

  const login = useCallback(async (loginPhone: string, otp: string) => {
    const data = await apiVerifyOtp(loginPhone, otp);
    setPhone(data.phone);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setPhone(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ phone, isAuthenticated, isLoading, login, logout }),
    [phone, isAuthenticated, isLoading, login, logout],
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
