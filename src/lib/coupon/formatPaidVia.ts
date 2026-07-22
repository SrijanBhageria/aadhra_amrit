/**
 * Human-readable paidVia label for myRedemptions / payoutStatus.
 * Legacy `razorpay` values are mapped to Cashfree branding.
 */
export function formatPaidVia(paidVia: string | null | undefined): string | null {
  if (!paidVia) return null;

  switch (paidVia) {
    case 'cashfree':
    case 'razorpay':
      return 'Paid via Cashfree';
    case 'manual':
      return 'Paid manually';
    default:
      return `Paid via ${paidVia}`;
  }
}
