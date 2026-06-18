/** `<br>`, `<br/>`, `<br />` (case-insensitive). Pair with `white-space: pre-line` on the container. */
const BR_TAG = /<br\s*\/?>/gi

/** Turns markup line breaks into real newlines for CSS `pre-line` / `pre-wrap`. */
export function brTagsToNewlines(text: string): string {
  return text.replace(BR_TAG, '\n')
}

/** PDP product spec grid row from SFCC (normalized in `normalizeProduct`). */
export type ProductSpecGridItem = {
  label?: string
  icon?: string
  values?: string[]
}

/** Applies {@link brTagsToNewlines} to each value (run in `normalizeProduct`, not in UI). */
export function normalizeProductSpecsBrTags(
  productSpecs: ProductSpecGridItem[] | undefined | null
): ProductSpecGridItem[] | undefined {
  if (productSpecs == null) {
    return undefined
  }
  if (!productSpecs.length) {
    return productSpecs
  }
  return productSpecs.map((spec) => ({
    ...spec,
    values: (spec.values ?? []).map((v) => brTagsToNewlines(typeof v === 'string' ? v : String(v))),
  }))
}
