/**
 * SFCC custom attribute suffix (without c_ prefix) for PDP visually similar PIDs.
 * Mirrors PLP logic in visually-similar.atom.ts for OneCoach + VISUALLY_SIMILAR_CROSS_CHANNEL.
 */
export function getPdpVisuallySimilarFieldName(params: {
  isOneSiteEnabled: boolean
  isVisuallySimilarCrossChannelExperiment: boolean
  activeTab: string | undefined
  enableVisuallySimilarVersion: string
}): string {
  const {
    isOneSiteEnabled,
    isVisuallySimilarCrossChannelExperiment,
    activeTab,
    enableVisuallySimilarVersion,
  } = params

  if (isOneSiteEnabled) {
    if (isVisuallySimilarCrossChannelExperiment) {
      return 'visuallySimilarPIDs'
    }
    return activeTab === 'outlet' ? 'outletVisuallySimilarPIDs' : 'retailVisuallySimilarPIDs'
  }

  return enableVisuallySimilarVersion === 'v2' ? 'visuallySimilarPIDs' : 'visuallySimilar'
}
