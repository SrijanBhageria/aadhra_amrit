export const STORAGE_KEYS = {
  refreshToken: 'coupon_refresh_token',
  refreshExpires: 'coupon_refresh_expires',
  authPhone: 'coupon_auth_phone',
  idempotencyKey: 'redeem_idempotency_key',
} as const;

export const CODE_REGEX = /^[A-HJ-NP-Z2-9]{8}$/;

export function getApiBase(): string {
  const host = (process.env.NEXT_PUBLIC_API_HOST ?? '').replace(/\/$/, '');
  if (!host) return '/api/v1/coupons/public';

  if (host.endsWith('/api/v1')) {
    return `${host}/coupons/public`;
  }

  return `${host}/api/v1/coupons/public`;
}
