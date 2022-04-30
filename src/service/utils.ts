export const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});
