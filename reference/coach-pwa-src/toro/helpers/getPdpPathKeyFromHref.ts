export default function getPdpPathKeyFromHref(href: string): string {
  if (!href) return ''
  try {
    if (href.startsWith('/')) {
      return href.split(/[?#]/)[0]
    }
    return new URL(href).pathname.split(/[?#]/)[0]
  } catch {
    return href.split(/[?#]/)[0]
  }
}
