/**
 * Extracts numeric price value from a price string
 * Handles various formats: $24.62, €30,00, £30.00, etc.
 */
export const extractNumericPrice = (priceString: string | null | undefined): number | null => {
  if (!priceString) return null

  // Remove currency symbols and extract numbers
  const cleanedPrice = priceString?.replace(/[€$£¥₹\s]/g, '')

  // Handle comma as decimal separator (European format)
  const normalizedPrice = cleanedPrice.replace(',', '.')

  // Parse the number
  const numericPrice = parseFloat(normalizedPrice)

  return Number.isNaN(numericPrice) ? null : numericPrice
}
