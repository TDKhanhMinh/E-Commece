export function formatCurrency(
  amount: string | number | undefined | null,
  currency: string = 'VND',
  locale: string = 'vi-VN',
): string {
  if (amount === undefined || amount === null) return '0 ₫';
  
  const numericAmount = typeof amount === 'string' 
    ? Number(amount.replace(/[^0-9.-]+/g, ""))
    : amount;

  if (isNaN(numericAmount)) return '0 ₫';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numericAmount);
}

export function formatDate(
  date: Date | string,
  locale: string = 'vi-VN',
  options?: Intl.DateTimeFormatOptions,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, options);
}

export function formatDateTime(
  date: Date | string,
  locale: string = 'vi-VN',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
