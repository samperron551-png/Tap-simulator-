export const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  if (num < 1000) return Math.floor(num).toString();

  const suffixes = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const suffixNum = Math.floor(Math.log10(num) / 3);
  
  let shortValue = (num / Math.pow(1000, suffixNum)).toFixed(2);
  
  // Remove trailing zeros and dot if not needed
  if (shortValue.endsWith('.00')) {
    shortValue = shortValue.substring(0, shortValue.length - 3);
  } else if (shortValue.endsWith('0')) {
    shortValue = shortValue.substring(0, shortValue.length - 1);
  }

  return shortValue + suffixes[suffixNum];
};
