/**
 * PLP template utilities for determining active template versions.
 */

export enum PlpTemplate {
  PLPV3 = 'PLPV3',
}

export const isPlpV3PrefEnabled = (plpTemplate?) => {
  return plpTemplate?.includes(PlpTemplate.PLPV3)
}
