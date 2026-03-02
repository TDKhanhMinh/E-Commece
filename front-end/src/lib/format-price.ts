const DEFAULT_LOCALE = "vi-VN";
const DEFAULT_CURRENCY = "VND";

export function formatCurrency(
    amount: number | undefined,
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY
) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
}
