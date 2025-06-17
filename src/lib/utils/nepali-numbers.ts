/**
 * Convert English numbers to Nepali numbers
 */
export function convertToNepaliNumbers(input: string | number): string {
  const englishToNepali = {
    '0': '०',
    '1': '१',
    '2': '२', 
    '3': '३',
    '4': '४',
    '5': '५',
    '6': '६',
    '7': '७',
    '8': '८',
    '9': '९'
  };

  return String(input).replace(/[0-9]/g, (digit) => englishToNepali[digit as keyof typeof englishToNepali]);
}

/**
 * Format number with Nepali digits and commas
 */
export function formatNepaliNumber(num: number): string {
  const formatted = num.toLocaleString();
  return convertToNepaliNumbers(formatted);
}

/**
 * Format percentage with Nepali digits
 */
export function formatNepaliPercentage(num: number, decimals: number = 1): string {
  const percentage = num.toFixed(decimals);
  return convertToNepaliNumbers(percentage) + '%';
}
