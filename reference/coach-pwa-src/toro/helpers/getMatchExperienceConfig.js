import get from 'lodash/get'

const getMatchExperienceConfig = (sapiData, certonaSlots) => {
  const matchExperienceConfig = get(sapiData, 'matchExperienceConfigs')
  try {
    const parsedConfig = JSON.parse(matchExperienceConfig)
    let isRecommenderMatchesForTabbedCertona = false
    const filters = get(parsedConfig, 'filters', [])
    for (const key in certonaSlots) {
      const certonaSlotsData = certonaSlots[key]
      if (
        Array.isArray(certonaSlotsData) &&
        certonaSlotsData.length > 0 &&
        certonaSlotsData[0]?.recommendations
      ) {
        const matchedSlot =
          certonaSlotsData.find((slot) => slot.recommendations === parsedConfig?.recommender) ||
          false
        isRecommenderMatchesForTabbedCertona = Boolean(matchedSlot)
      }
    }

    return { ...parsedConfig, enabled: isRecommenderMatchesForTabbedCertona, filters }
  } catch (e) {
    console.log(`getMatchExperienceConfig error ${e}`)
  }
}

export default getMatchExperienceConfig
