type ParsedCookie = {
  [key: string]: string
}

const parseCookieString = (raw: string): string[] => {
  if (raw) {
    let parsed: ParsedCookie
    try {
      parsed = JSON.parse(raw)
    } catch (e) {
      console.log('Error')
      parsed = {}
    }
    return Object.values(parsed)
  }
  return []
}

export default parseCookieString
