export function formatCurrency(amount: number, currency: string, locale = "id-ID") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
