export const getContrastColor = (hexColor?: string): string => {
  const FALLBACK = 'var(--color-primary)'

  if (!hexColor || typeof hexColor !== 'string') return FALLBACK

  const raw = hexColor.trim()

  // validation regex allowing either 3 or 6 hex digits, with optional leading '#'
  const match = raw.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
  if (!match) return FALLBACK

  let hex = match[1]

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('')
  }

  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return FALLBACK

  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 155 ? 'var(--color-primary)' : 'var(--color-white-base)'
}
