export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
  isSessionValid?: boolean;
}

export interface SendOtpData {
  otpSent: boolean;
  expiresAt: string;
}

export interface VerifyOtpData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  phone: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface VerifyCouponData {
  valid: boolean;
  faceValuePaise?: number;
  faceValueRupees?: number;
  currency?: string;
  message?: string;
  reason?: string;
}

export interface AppliedRule {
  name: string;
  bonusPaise: number;
}

export interface RedeemCouponData {
  redemptionId: string;
  publicRef: string;
  baseAmountPaise: number;
  bonusAmountPaise: number;
  totalAmountPaise: number;
  payoutStatus: string;
  appliedRules?: AppliedRule[];
  message?: string;
}

/** Known payout channels once paid. Legacy rows may still use `razorpay`. */
export type PaidVia = 'manual' | 'cashfree' | 'razorpay';

export interface Redemption {
  publicRef: string;
  code: string;
  baseAmountPaise: number;
  bonusAmountPaise: number;
  totalAmountPaise: number;
  payoutStatus: 'pending' | 'paid';
  paidAt: string | null;
  paidVia: PaidVia | string | null;
  redeemedAt: string;
}

export interface MyRedemptionsData {
  phone: string;
  name: string;
  totalRedemptions: number;
  lifetimeEarnedPaise: number;
  redemptions: Redemption[];
}

export interface MyProfileData {
  phone: string;
  name: string;
  upiVpa: string;
  totalRedemptions: number;
  lifetimeEarnedPaise: number;
  firstRedeemedAt: string;
  lastRedeemedAt: string;
}

export interface PayoutStatusData {
  publicRef: string;
  code: string;
  totalAmountPaise: number;
  payoutStatus: 'pending' | 'paid';
  paidAt: string | null;
  paidVia: PaidVia | string | null;
  redeemedAt: string;
}

export interface KycVerificationDetails {
  bank: Record<string, unknown>;
}

export interface VerifyBankAccountData {
  accountHolderName: string;
  kycVerificationDetails: KycVerificationDetails;
}

export interface RedeemFormData {
  name: string;
  upi_vpa?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc?: string;
  bank_name?: string;
}

export type PayoutMethod = 'upi' | 'bank';

export interface PayoutDetails {
  method: PayoutMethod;
  upiVpa?: string;
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
}

export type RedeemStep =
  | 'login'
  | 'home'
  | 'verify-result'
  | 'redeem-form'
  | 'success';

export type RedeemTab = 'redeem' | 'history' | 'profile' | 'payout';
