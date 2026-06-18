import {
  ITemplateComponentConfig,
  IOverrideTemplateComponentConfig,
  TemplateComponentsKeys,
  ITemplateComponentsKeys,
  ITemplateComponentConfigItem,
  TemplateRenderMode,
} from 'toro/helpers/templating/types'

/**
 * Validates that a component name is valid
 */
const isValidComponent = (componentName: string): componentName is ITemplateComponentsKeys => {
  return !!TemplateComponentsKeys.find(
    (n) => n.toLowerCase() === (componentName as ITemplateComponentsKeys).toLowerCase()
  )
}

/**
 * Validates override config components
 * Throws error if invalid component found
 */
const validateOverrideConfig = (
  overrideConfig: Partial<ITemplateComponentConfig>
): { hasError: boolean; errors: string[] } => {
  let hasError = false
  const errors: string[] = []
  if (
    !overrideConfig.renderMode ||
    ![TemplateRenderMode.MERGE, TemplateRenderMode.REPLACE].includes(
      overrideConfig.renderMode.toLowerCase() as TemplateRenderMode
    )
  ) {
    hasError = true
    errors.push(
      `Invalid render mode "${overrideConfig.renderMode}". Valid render modes are ${TemplateRenderMode.MERGE} and ${TemplateRenderMode.REPLACE}.`
    )
  }

  Object.entries(overrideConfig.slots).forEach(([slot, config]) => {
    if (!config) {
      hasError = true
      errors.push(`Slot ${slot} does not have a value. Configs cannot be empty.`)
      return
    }

    // Validate main component
    if (!isValidComponent(config.component)) {
      hasError = true
      errors.push(
        `Invalid component "${config.component}" in ${slot}. Such component does not exist.`
      )
    }

    // Validate children components if present
    if (config.children) {
      config.children.forEach((child, index) => {
        if (!isValidComponent(child.component)) {
          hasError = true
          errors.push(
            `Invalid child component "${child.component}" at index ${index} in ${slot}. Such component does not exist.`
          )
        }
      })
    }
  })

  return { hasError, errors }
}

const convertConfigToArray = (
  config: ITemplateComponentConfig['slots']
): ITemplateComponentConfigItem[] => {
  return Object.entries(config)
    .sort(([a], [b]) => {
      const numA = parseInt(a.replace('SLOT_', ''))
      const numB = parseInt(b.replace('SLOT_', ''))
      return numA - numB
    })
    .map(([, config]) => config as ITemplateComponentConfigItem)
}

const convertArrayToConfig = (
  array: ITemplateComponentConfigItem[]
): ITemplateComponentConfig['slots'] => {
  return array.reduce<ITemplateComponentConfig['slots']>((acc, config, index) => {
    acc[`SLOT_${index + 1}`] = config
    return acc
  }, {})
}

const collectAllComponents = (
  config: ITemplateComponentConfigItem,
  collected: Set<string> = new Set()
): Set<string> => {
  collected.add(config.component.toLowerCase())
  if (config.children) {
    config.children.forEach((child) => {
      collectAllComponents(child, collected)
    })
  }
  return collected
}

const collectOverrideData = (overrideConfig: Partial<ITemplateComponentConfig>) => {
  const componentsInOverride = new Set<string>()
  const overrideSlots = new Map<number, ITemplateComponentConfigItem>()

  Object.entries(overrideConfig.slots).forEach(([slot, config]) => {
    if (!config) return
    const slotNum = parseInt(slot.replace('SLOT_', ''))
    overrideSlots.set(slotNum, config)
    collectAllComponents(config, componentsInOverride)
  })

  return { componentsInOverride, overrideSlots }
}

const removeComponentsRecursively = (
  baseConfig: ITemplateComponentConfigItem,
  componentsInOverride: Set<string>
): ITemplateComponentConfigItem | null => {
  if (componentsInOverride.has(baseConfig.component.toLowerCase())) {
    return null
  }

  let processedChildren: ITemplateComponentConfigItem[] | undefined
  if (baseConfig.children) {
    processedChildren = baseConfig.children
      .map((child) => removeComponentsRecursively(child, componentsInOverride))
      .filter(Boolean) as ITemplateComponentConfigItem[]
  }

  return {
    component: baseConfig.component,
    children: processedChildren?.length > 0 ? processedChildren : undefined,
  }
}

/**
 * Merges two template configs with automatic deduplication and shifting
 *
 * @param baseConfig - The base configuration (left side)
 * @param overrideConfig - The override configuration (right side)
 * @returns Merged configuration with duplicates removed and slots shifted
 *
 * @example
 * Base: SLOT_1: A, SLOT_2: B, SLOT_3: C, SLOT_9: D
 * Override: SLOT_2: D
 * Result: SLOT_1: A, SLOT_2: D (inserted), SLOT_3: B (shifted from 2), SLOT_4: C (shifted from 3)
 * SLOT_9 removed (D moved to SLOT_2)
 */
const mergeTemplateComponentConfig = (
  baseConfig: ITemplateComponentConfig['slots'],
  overrideConfig: Partial<ITemplateComponentConfig>
): ITemplateComponentConfig['slots'] => {
  // Validate override config
  const { hasError, errors } = validateOverrideConfig(overrideConfig)
  if (hasError) {
    console.error('Failed to merge template component config. Errors:', errors)
    return baseConfig
  }

  if (overrideConfig.renderMode.toLowerCase() === TemplateRenderMode.REPLACE) {
    return overrideConfig.slots
  }

  // Base case for full render mode
  // Step 1: Convert base config to array for easier manipulation
  const baseArray = convertConfigToArray(baseConfig)

  // Step 2: Collect components being repositioned in override
  const { componentsInOverride, overrideSlots } = collectOverrideData(overrideConfig)

  // Step 3: Remove components from base that are being repositioned and filter children
  const filteredConfig = baseArray
    .map((slotConfig) => removeComponentsRecursively(slotConfig, componentsInOverride))
    .filter(Boolean) as ITemplateComponentConfigItem[]

  // Insert each override at its specified position (convert 1-based slot to 0-based index)
  Array.from(overrideSlots.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([slotNum, config]) => {
      const index = slotNum - 1
      filteredConfig.splice(index, 0, config)
    })

  // Step 5: Convert back to slot object format (renumber sequentially)
  return convertArrayToConfig(filteredConfig)
}

/**
 * Gets the final template component configuration by merging base, default overrides, and experiment overrides
 *
 * Priority (lowest to highest):
 * 1. Base config (defaultConfig)
 * 2. Default overrides (overrideConfig.default)
 * 3. Active experiment overrides (overrideConfig.experiments[activeExperiment])
 *
 * @param defaultConfig - The base configuration from code
 * @param overrideConfig - Override configuration from SFCC (contains default and experiment overrides)
 * @param activeExperiments - Array of active experiment IDs
 * @returns Final merged configuration
 *
 * @example
 * const config = getTemplateComponentConfig({
 *   defaultConfig: BASE_CONFIG,
 *   overrideConfig: {
 *     default: { SLOT_3: { component: 'YouMayAlsoLike' } },
 *     experiments: {
 *       'test_123': { SLOT_5: { component: 'RecentlyViewed' } }
 *     }
 *   },
 *   activeExperiments: ['test_123']
 * })
 */
const getTemplateComponentConfig = ({
  defaultConfig,
  overrideConfig,
  activeExperiments,
}: {
  defaultConfig: ITemplateComponentConfig['slots']
  overrideConfig: IOverrideTemplateComponentConfig
  activeExperiments: string[]
}): ITemplateComponentConfig['slots'] => {
  try {
    // Start with base config
    let currentConfig = defaultConfig

    // If no override config, return base
    if (!overrideConfig) {
      return currentConfig
    }

    // Step 1: Merge active experiment overrides (in order)
    const overrideConfigKeys = Object.keys(overrideConfig ?? {})
    if (overrideConfigKeys.length > 0 && activeExperiments.length > 0) {
      const experimentConfigs = overrideConfigKeys.filter((experiments) =>
        experiments.split('-').some((experiment) => activeExperiments.includes(experiment))
      )
      if (experimentConfigs.length) {
        if (experimentConfigs.length > 1) {
          console.error('Multiple experiment overrides found. Only the first one will be applied.')
        }
        const [experimentId] = experimentConfigs
        const experimentConfig = overrideConfig[experimentId]
        currentConfig = mergeTemplateComponentConfig(currentConfig, experimentConfig)
      }
    }

    return currentConfig
  } catch (error) {
    console.error('Failed to get template component config. Error:', error)
    return defaultConfig
  }
}

export { mergeTemplateComponentConfig, getTemplateComponentConfig }
