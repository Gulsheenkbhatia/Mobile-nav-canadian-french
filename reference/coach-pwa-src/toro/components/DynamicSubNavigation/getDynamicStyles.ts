import type { OneSiteBrandTabs } from 'toro/lib/oneSite/config'

const VALID_CONFIG_KEYS = ['brand', 'subbrand', 'retail', 'outlet'] as const
type StyleKey = typeof VALID_CONFIG_KEYS[number]

/**
 * Style configuration for a single style variant (brand, subbrand, retail, outlet)
 */
export interface DynamicStyleConfigItem {
  enable?: boolean
  fontFamily?: string
  textDecoration?: 'underline' | 'none' | 'line-through' | 'overline'
  backgroundColor?: string
  color?: string
}

/**
 * Config format supporting both legacy (brand/subbrand) and OneSite (retail/outlet/subbrand) keys
 */
export type DynamicStyleConfig = {
  [K in StyleKey]?: DynamicStyleConfigItem
}

/**
 * Resolved style configuration with guaranteed defaults
 */
export interface ResolvedDynamicStyles {
  enable: boolean
  backgroundColor: string
  fontFamily?: string
  textDecoration?: 'underline' | 'none' | 'line-through' | 'overline'
  color?: string
}

export interface GetDynamicStylesParams {
  config: DynamicStyleConfig | null | undefined
  isSubBrandActive: boolean
  oneSiteActiveTab: OneSiteBrandTabs | undefined
}

const DEFAULT_STYLES: ResolvedDynamicStyles = {
  enable: false,
  backgroundColor: 'transparent',
}

function logConfigWarning(message: string, config: DynamicStyleConfig | null | undefined): void {
  const configPreview = config && JSON.stringify(config).slice(0, 200)
  console.error(`[DynamicSubNavigation] ${message}. Received: ${configPreview}`)
}

/**
 * Validates config structure. Returns true if valid, logs warning and returns false otherwise.
 */
function isValidConfig(
  config: DynamicStyleConfig | null | undefined
): config is DynamicStyleConfig {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    logConfigWarning('Invalid config format - expected an object', config)
    return false
  }

  const keys = Object.keys(config)

  if (keys.length === 0) {
    logConfigWarning('Config is empty', config)
    return false
  }

  const unexpectedKeys = keys.filter((key) => !VALID_CONFIG_KEYS.includes(key as StyleKey))
  if (unexpectedKeys.length > 0) {
    logConfigWarning(
      `Config contains unexpected keys: [${unexpectedKeys.join(
        ', '
      )}]. Expected: [${VALID_CONFIG_KEYS.join(', ')}]`,
      config
    )
  }

  return true
}

/**
 * Determines the style key and resolves the style item with fallback
 */
function resolveStyles(
  config: DynamicStyleConfig,
  isSubBrandActive: boolean,
  oneSiteActiveTab: OneSiteBrandTabs | undefined
): ResolvedDynamicStyles {
  const primaryKey: StyleKey = isSubBrandActive ? 'subbrand' : oneSiteActiveTab ?? 'brand'
  const item = config[primaryKey] || config.brand

  return {
    enable: item?.enable ?? false,
    backgroundColor: item?.backgroundColor ?? 'transparent',
    fontFamily: item?.fontFamily,
    textDecoration: item?.textDecoration,
    color: item?.color,
  }
}

/**
 * Gets dynamic styles configuration based on current brand/subbrand state.
 *
 * Supports both legacy config format (brand/subbrand) and OneSite format (retail/outlet/subbrand).
 * Returns default styles if config is invalid, never throws.
 */
export function getDynamicStyles(params: GetDynamicStylesParams): ResolvedDynamicStyles {
  const { config, isSubBrandActive, oneSiteActiveTab } = params

  if (!isValidConfig(config)) {
    return DEFAULT_STYLES
  }

  return resolveStyles(config, isSubBrandActive, oneSiteActiveTab)
}

export default getDynamicStyles
