const formatCurrency = (value: number): string =>
 `${new Intl.NumberFormat("ms-MY", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
 }).format(value)} RM`


export default formatCurrency