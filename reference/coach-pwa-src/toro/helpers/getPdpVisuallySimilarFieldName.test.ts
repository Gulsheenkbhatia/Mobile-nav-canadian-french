import { getPdpVisuallySimilarFieldName } from './getPdpVisuallySimilarFieldName'

describe('getPdpVisuallySimilarFieldName', () => {
  it('returns retailVisuallySimilarPIDs when OneSite is on, experiment off, retail tab', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: true,
        isVisuallySimilarCrossChannelExperiment: false,
        activeTab: 'retail',
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('retailVisuallySimilarPIDs')
  })

  it('returns outletVisuallySimilarPIDs when OneSite is on, experiment off, outlet tab', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: true,
        isVisuallySimilarCrossChannelExperiment: false,
        activeTab: 'outlet',
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('outletVisuallySimilarPIDs')
  })

  it('defaults to retail field when OneSite is on, experiment off, tab undefined', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: true,
        isVisuallySimilarCrossChannelExperiment: false,
        activeTab: undefined,
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('retailVisuallySimilarPIDs')
  })

  it('returns visuallySimilarPIDs when OneSite is on and cross-channel experiment is on', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: true,
        isVisuallySimilarCrossChannelExperiment: true,
        activeTab: 'outlet',
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('visuallySimilarPIDs')

    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: true,
        isVisuallySimilarCrossChannelExperiment: true,
        activeTab: 'retail',
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('visuallySimilarPIDs')
  })

  it('returns visuallySimilarPIDs when OneSite is off and version is v2', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: false,
        isVisuallySimilarCrossChannelExperiment: false,
        activeTab: 'outlet',
        enableVisuallySimilarVersion: 'v2',
      })
    ).toBe('visuallySimilarPIDs')
  })

  it('returns visuallySimilar when OneSite is off and version is not v2', () => {
    expect(
      getPdpVisuallySimilarFieldName({
        isOneSiteEnabled: false,
        isVisuallySimilarCrossChannelExperiment: false,
        activeTab: undefined,
        enableVisuallySimilarVersion: 'v1',
      })
    ).toBe('visuallySimilar')
  })
})
