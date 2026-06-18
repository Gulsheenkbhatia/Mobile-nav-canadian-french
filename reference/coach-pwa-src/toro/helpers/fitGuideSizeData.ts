export const CM_PER_INCH = 2.54

export type FitGuideSizeRow = {
  length: number
  us: string
  uk: string
  eu: string
}

export type FitGuideTableRow = FitGuideSizeRow & {
  difference?: number
}

export const enrichAndSortSizeDataByFootLength = (
  sizeData: FitGuideSizeRow[],
  footLengthStr: string,
  unit: 'IN' | 'CM'
): FitGuideTableRow[] => {
  if (!footLengthStr) return sizeData
  const numValue = parseFloat(footLengthStr)
  if (isNaN(numValue)) return sizeData
  const targetInches = unit === 'IN' ? numValue : numValue / CM_PER_INCH
  return sizeData
    .map((row) => ({
      ...row,
      difference: Math.abs(row.length - targetInches),
    }))
    .sort((a, b) => (a.difference ?? 0) - (b.difference ?? 0))
}

export type FootLengthBounds = {
  minInches: number
  maxInches: number
}

export const getFootLengthBoundsFromTable = (
  sizeData: FitGuideSizeRow[]
): FootLengthBounds | null => {
  if (!sizeData?.length) return null
  const lengths = sizeData.map((row) => row.length)
  return {
    minInches: Math.min(...lengths),
    maxInches: Math.max(...lengths),
  }
}

const BOUNDS_EPS = 1e-9

export const formatFootLengthBoundForMessage = (value: number): string =>
  String(Number.parseFloat(value.toFixed(2)))

export type FootLengthValidationStatus =
  | { kind: 'idle' }
  | { kind: 'incomplete' }
  | { kind: 'invalid_range'; minDisplay: string; maxDisplay: string; unit: 'IN' | 'CM' }
  | { kind: 'valid'; valueInches: number }

export const getFootLengthValidationStatus = (
  raw: string,
  unit: 'IN' | 'CM',
  bounds: FootLengthBounds | null
): FootLengthValidationStatus => {
  const trimmed = raw.trim()
  if (!trimmed) return { kind: 'idle' }
  if (trimmed.endsWith('.')) return { kind: 'incomplete' }

  const n = Number.parseFloat(trimmed)
  if (Number.isNaN(n) || !bounds) return { kind: 'idle' }

  const valueInches = unit === 'IN' ? n : n / CM_PER_INCH
  const { minInches, maxInches } = bounds

  if (valueInches < minInches - BOUNDS_EPS || valueInches > maxInches + BOUNDS_EPS) {
    if (unit === 'IN') {
      return {
        kind: 'invalid_range',
        minDisplay: formatFootLengthBoundForMessage(minInches),
        maxDisplay: formatFootLengthBoundForMessage(maxInches),
        unit: 'IN',
      }
    }
    const minCm = minInches * CM_PER_INCH
    const maxCm = maxInches * CM_PER_INCH
    return {
      kind: 'invalid_range',
      minDisplay: formatFootLengthBoundForMessage(minCm),
      maxDisplay: formatFootLengthBoundForMessage(maxCm),
      unit: 'CM',
    }
  }

  return { kind: 'valid', valueInches }
}
