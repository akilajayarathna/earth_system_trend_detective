const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatP(p) {
  return p < 0.001 ? "< 0.001" : p.toFixed(3);
}

export function formatChange(value) {
  return `${value > 0 ? "+" : ""}${value}`;
}

export function formatMonth(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

export function formatRange(start, end) {
  return `${formatMonth(start)} to ${formatMonth(end)}`;
}