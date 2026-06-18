/**
 * Restores original data-atb-pid attribute values that were altered during sanitization.
 * Product IDs can contain multiple consecutive spaces which must be preserved
 * for SFCC API to correctly identify the product.
 *
 * @param originalHtml - Original HTML before sanitization
 * @param sanitizedHtml - HTML after sanitization
 * @returns Sanitized HTML with restored data-atb-pid values
 */
function restoreAtbPids(originalHtml: string, sanitizedHtml: string): string {
  if (!originalHtml || !sanitizedHtml) return sanitizedHtml || ''

  const atbPidRegex = /data-atb-pid="([^"]*)"/g
  const originalPids = Array.from(originalHtml.matchAll(atbPidRegex), (m) => m[1])

  if (!originalPids.length) return sanitizedHtml

  let pidIndex = 0
  return sanitizedHtml.replace(/data-atb-pid="[^"]*"/g, () => {
    return `data-atb-pid="${originalPids[pidIndex++]}"`
  })
}

export default restoreAtbPids
