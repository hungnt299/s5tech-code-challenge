export const formatNumber = (n) => {
  if (!isFinite(n)) return "—";
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 6 });
};
