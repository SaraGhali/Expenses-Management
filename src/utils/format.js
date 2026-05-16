// No imports needed for standard formatting

/**
 * Formats a number as a currency string according to the locale and currency.
 * 
 * @param {number} amount - The amount to format.
 * @param {string} language - The current language code ('en' or 'ar').
 * @param {boolean} showSign - Whether to show the plus sign for positive numbers.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount, language = 'en', showSign = false) => {
  // Force English locale regardless of the site language as requested
  const locale = 'en-US'
  const formatted = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))

  if (amount > 0 && showSign) {
    return `+${formatted}`
  }

  if (amount < 0) {
    return `-${formatted}`
  }

  return formatted
}
