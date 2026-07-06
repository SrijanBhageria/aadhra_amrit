import { getApiBase, STORAGE_KEYS } from './constants';
import type {
  ApiResponse,
  KycVerificationDetails,
  MyProfileData,
  MyRedemptionsData,
  PayoutStatusData,
  RedeemCouponData,
  RedeemFormData,
  RefreshTokenData,
  SendOtpData,
  VerifyCouponData,
  VerifyBankAccountData,
  VerifyOtpData,
} from './types';

let accessToken: string | null = null;
let accessTokenExpiry: Date | null = null;
let onAuthFailure: (() => void) | null = null;

export function setAccessToken(token: string, expiresAt: string): void {
  accessToken = token;
  accessTokenExpiry = new Date(expiresAt);
}

export function clearAccessToken(): void {
  accessToken = null;
  accessTokenExpiry = null;
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.refreshToken);
}

export function setStoredTokens(data: {
  refreshToken: string;
  refreshTokenExpiresAt: string;
  phone?: string;
}): void {
  localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken);
  localStorage.setItem(STORAGE_KEYS.refreshExpires, data.refreshTokenExpiresAt);
  if (data.phone) {
    localStorage.setItem(STORAGE_KEYS.authPhone, data.phone);
  }
}

export function clearStoredTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.refreshExpires);
  localStorage.removeItem(STORAGE_KEYS.authPhone);
}

export function setAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

function needsRefresh(): boolean {
  if (!accessToken || !accessTokenExpiry) return false;
  const bufferMs = 60 * 1000;
  return accessTokenExpiry.getTime() - Date.now() < bufferMs;
}

async function parseJson<T>(response: Response): Promise<ApiResponse<T>> {
  return response.json() as Promise<ApiResponse<T>>;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${getApiBase()}/refreshToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearStoredTokens();
      clearAccessToken();
      onAuthFailure?.();
      return false;
    }

    const result = await parseJson<RefreshTokenData>(response);
    if (!result.success || !result.data) return false;

    setAccessToken(result.data.accessToken, result.data.accessTokenExpiresAt);
    setStoredTokens({
      refreshToken: result.data.refreshToken,
      refreshTokenExpiresAt: result.data.refreshTokenExpiresAt,
    });
    return true;
  } catch {
    return false;
  }
}

async function getAccessToken(): Promise<string> {
  if (!accessToken || !accessTokenExpiry) {
    const refreshed = await refreshAccessToken();
    if (!refreshed || !accessToken) {
      throw new Error('Not authenticated');
    }
  }

  if (needsRefresh()) {
    const refreshed = await refreshAccessToken();
    if (!refreshed || !accessToken) {
      throw new Error('Session expired — please login again');
    }
  }

  return accessToken!;
}

async function apiCall<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    try {
      headers.Authorization = `Bearer ${await getAccessToken()}`;
    } catch {
      throw new Error('Not authenticated');
    }
  }

  let response = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers,
  });

  if (authenticated && response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${await getAccessToken()}`;
      response = await fetch(`${getApiBase()}${path}`, {
        ...options,
        headers,
      });
    } else {
      onAuthFailure?.();
      throw new Error('Session expired — please login again');
    }
  }

  const json = await parseJson<T>(response);

  if (response.status === 429) {
    throw new Error('Too many attempts. Please wait a minute and try again.');
  }

  if (!response.ok || !json.success) {
    throw new Error(json.error ?? json.message ?? 'Request failed');
  }

  return json;
}

export async function sendOtp(phone: string): Promise<SendOtpData> {
  const response = await fetch(`${getApiBase()}/sendOtp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  const json = await parseJson<SendOtpData>(response);
  if (response.status === 429) {
    throw new Error('Too many OTP requests, please try again later.');
  }
  if (!response.ok || !json.success) {
    throw new Error(json.error ?? 'Failed to send OTP');
  }
  return json.data!;
}

export async function verifyOtp(phone: string, otp: string): Promise<VerifyOtpData> {
  const response = await fetch(`${getApiBase()}/verifyOtp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });

  const json = await parseJson<VerifyOtpData>(response);
  if (!response.ok || !json.success) {
    throw new Error(json.error ?? 'Invalid OTP');
  }

  const data = json.data!;
  setAccessToken(data.accessToken, data.accessTokenExpiresAt);
  setStoredTokens({
    refreshToken: data.refreshToken,
    refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    phone: data.phone,
  });
  return data;
}

export async function tryRestoreSession(): Promise<boolean> {
  if (getStoredRefreshToken()) {
    return refreshAccessToken();
  }
  return false;
}

export async function verifyCoupon(code: string): Promise<VerifyCouponData> {
  const json = await apiCall<VerifyCouponData>('/verifyCoupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return json.data!;
}

export async function verifyBankAccount(
  accountNumber: string,
  ifscCode: string,
): Promise<VerifyBankAccountData> {
  const params = new URLSearchParams({
    account_number: accountNumber.replace(/\s/g, ''),
    ifsc_code: ifscCode.trim().toUpperCase(),
  });

  const json = await apiCall<VerifyBankAccountData>(
    `/verifyBankAccount?${params.toString()}`,
    { method: 'GET' },
  );

  const data = json.data!;
  return {
    accountHolderName:
      data.accountHolderName ??
      (data as unknown as { account_holder_name?: string }).account_holder_name ??
      '',
    kycVerificationDetails:
      data.kycVerificationDetails ??
      (data as unknown as { kyc_verification_details?: KycVerificationDetails })
        .kyc_verification_details ?? { bank: {} },
  };
}

export async function redeemCoupon(payload: {
  code: string;
  name: string;
  idempotency_key: string;
  upi_vpa?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc?: string;
  bank_name?: string;
  kyc_verification_details?: KycVerificationDetails;
}): Promise<RedeemCouponData> {
  const response = await fetch(`${getApiBase()}/redeemCoupon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      onAuthFailure?.();
      throw new Error('Session expired — please login again');
    }
    return redeemCoupon(payload);
  }

  const json = await parseJson<RedeemCouponData>(response);
  if (response.status === 429) {
    throw new Error('Too many attempts. Please wait a minute and try again.');
  }
  if (!response.ok || !json.success) {
    throw new Error(json.error ?? 'Failed to redeem coupon');
  }
  return json.data!;
}

export function getOrCreateIdempotencyKey(): string {
  let key = sessionStorage.getItem(STORAGE_KEYS.idempotencyKey);
  if (!key) {
    key = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEYS.idempotencyKey, key);
  }
  return key;
}

export function clearIdempotencyKey(): void {
  sessionStorage.removeItem(STORAGE_KEYS.idempotencyKey);
}

export async function getMyRedemptions(): Promise<MyRedemptionsData> {
  const json = await apiCall<MyRedemptionsData>('/myRedemptions');
  return json.data!;
}

export async function getMyProfile(): Promise<MyProfileData> {
  const json = await apiCall<MyProfileData>('/myProfile');
  return json.data!;
}

export async function getPayoutStatus(publicRef: string): Promise<PayoutStatusData> {
  const json = await apiCall<PayoutStatusData>(
    `/payoutStatus/${encodeURIComponent(publicRef.trim())}`,
    { method: 'GET' },
  );
  return json.data!;
}

export async function logout(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  if (refreshToken && accessToken) {
    try {
      await apiCall<{ loggedOut: boolean }>(
        '/logout',
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        },
      );
    } catch {
      // Clear locally even if API fails
    }
  }
  clearStoredTokens();
  clearAccessToken();
}

export type { RedeemFormData };
