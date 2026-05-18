export function toDateInputValue(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function fromDateInputValue(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function formatFriendlyDate(value: string | Date, locale = "id-ID") {
  const date = value instanceof Date ? value : new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
