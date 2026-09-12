export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'S/ 0.00';
  }
  const formattedNumber = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `S/ ${formattedNumber}`;
}

export function calculateDiscount(original: number, current: number): number {
  if (original <= current || original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function formatReviewsCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
