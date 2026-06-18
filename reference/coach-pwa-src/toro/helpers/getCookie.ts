const getCookie = (
  name: string,
  rawCookies: string | string[] = [],
  extractFullCookie: boolean = false
) => {
  let cookies: string[] = []

  if (typeof rawCookies === 'string') {
    cookies = rawCookies.split(';')
  } else {
    cookies = rawCookies
  }

  const cookie = cookies.find((cookieStr) => {
    const cookieName = cookieStr.substring(0, cookieStr.indexOf('=')).trim()

    return cookieName.includes(name)
  })

  if (extractFullCookie) {
    return cookie ? cookie.trim() : null
  } else {
    const value = cookie ? cookie.split('=') : null
    return value && value.length > 1 ? value[1] : null
  }
}

export default getCookie
