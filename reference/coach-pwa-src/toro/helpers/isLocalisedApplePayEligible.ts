import getCurrentLocale from 'toro/helpers/getCurrentLocale'

const isLocalisedApplePayEligible = (
  currentLocale: string,
  allowedApplePayCountries: string[] = []
): boolean => {
  const { region } = getCurrentLocale(currentLocale)

  return allowedApplePayCountries.some((code) => code.toLowerCase() === region.toLowerCase())
}

export default isLocalisedApplePayEligible
