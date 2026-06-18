export const createSourceCodeCookie = (cName, cValue, expDays) => {
  const date = new Date()
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  return `${cName}=${cValue}|${cValue}; ${expires}; Path=/; Secure; Secure; SameSite=None`
}
