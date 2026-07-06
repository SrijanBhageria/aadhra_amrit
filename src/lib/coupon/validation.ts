import { CODE_REGEX } from './constants';

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s/g, '');
}

export function isValidCodeFormat(code: string): boolean {
  return CODE_REGEX.test(code);
}

export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || (digits.startsWith('91') && digits.length === 12);
}

export function isValidUpi(vpa: string): boolean {
  return /^[\w.\-]{2,}@[\w.\-]{2,}$/.test(vpa.trim());
}

export function isValidIfsc(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc.trim());
}

export function isValidAccountNumber(accountNumber: string): boolean {
  const digits = accountNumber.replace(/\s/g, '');
  return /^\d{9,18}$/.test(digits);
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function paiseToRupees(paise: number): string {
  return (paise / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function getVerifyErrorMessage(reason?: string, message?: string): string {
  switch (reason) {
    case 'already_redeemed':
      return 'This coupon has already been used';
    case 'expired':
      return 'This coupon has expired';
    default:
      return message ?? 'This coupon is not valid';
  }
}
