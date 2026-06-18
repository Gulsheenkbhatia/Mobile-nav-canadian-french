const getSlasRefreshCookie = (
  browseCookies: string,
  slasRefreshToken: string,
  isSlasRefreshResponseError: boolean
): string[] => {
  let slasRefreshTokenCookie = [
    `cc-nx-g=${slasRefreshToken}; Max-Age=7776000; Path=/; Secure; SameSite=None; Secure`,
  ] // 90 days = 7776000 second
  const browseCookiesArr = browseCookies.split(';')
  const cookieIndex = browseCookiesArr.findIndex((item) => item.includes('cc-nx'))

  // This check need if user get to site for the first time and don't have any slas cookie
  if (cookieIndex === -1) {
    return slasRefreshTokenCookie
  }

  const slasCookieValue = browseCookiesArr[cookieIndex]
  const slasCookieNameRegex = /(cc-nx-g|cc-nx-p|cc-nx)/g
  const slasNameType = slasCookieValue.match(slasCookieNameRegex)[0]

  // This blog triggers when user already have cc-nx or cc-nx-p cookie
  // and slas endpoint answer with 404 respons, then there will be not renew exist user session,
  // will triggers guest session that will should not setup refresh_token under existing user slas cookie name
  if (isSlasRefreshResponseError && slasNameType !== 'cc-nx-g') {
    slasRefreshTokenCookie = [
      `cc-nx-g=${slasRefreshToken}; Max-Age=7776000; Path=/; Secure; SameSite=None; Secure;`,
      `${slasNameType}=1; Max-Age=1; Path=/; Secure; SameSite=None; Secure;`,
    ] // 90 days = 7776000 second
  }
  if (slasCookieValue && slasNameType !== 'cc-nx-g' && !isSlasRefreshResponseError) {
    slasRefreshTokenCookie = [
      `${slasNameType}=${slasRefreshToken}; Max-Age=7776000; Path=/; Secure; SameSite=None; Secure`,
    ]
  }

  return slasRefreshTokenCookie
}

export default getSlasRefreshCookie
