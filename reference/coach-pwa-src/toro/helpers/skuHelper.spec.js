import {
  attributes,
  selectedTabsDataResult,
  tabsMock,
  groupMock,
  responseMockGroupData,
  selectedTabsMock,
  responseNewTabsData,
  groupMockWithVg,
  colorsMock,
} from '../../test-utils/newMegaPDP.mock'
import {
  getSelectedNewMegaPDPAttributes,
  getNewMegaPDPGroup,
  getNewMegaPDPTabsData,
  getTabsUrl,
  getNewMegaPDPColors,
} from './skuHelper'

describe('getSelectedNewMegaPDPAttributes', () => {
  it('when all parametrs are undefined', () => {
    const data = getSelectedNewMegaPDPAttributes([], [])
    expect(data).toEqual([])
  })

  it('when custom attribute is undefined array and newMegaPDPTabsJSONData is undefined', () => {
    const data = getSelectedNewMegaPDPAttributes([], [])
    expect(data).toEqual([])
  })

  it('when custom attribute is not empty array and newMegaPDPTabsJSONData is empty', () => {
    const data = getSelectedNewMegaPDPAttributes(attributes, [])
    expect(data).toEqual([])
  })

  it('when custom attribute and newMegaPDPTabsJSONData has valid data', () => {
    const data = getSelectedNewMegaPDPAttributes(attributes, tabsMock)
    expect(data).toEqual(selectedTabsDataResult)
  })
})

describe('getNewMegaPDPGroup', () => {
  it('when all attributes are undefined', () => {
    const data = getNewMegaPDPGroup()
    expect(data).toEqual({})
  })

  it('when attributes have default values', () => {
    const data = getNewMegaPDPGroup([], [], [])
    expect(data).toEqual({})
  })
  it('when have valid data', () => {
    const data = getNewMegaPDPGroup(groupMock, tabsMock, [])
    expect(data).toEqual(responseMockGroupData)
  })
})

describe('getNewMegaPDPTabsData', () => {
  it('when all attributes of getNewMegaPDPTabsData  are undefined', () => {
    const data = getNewMegaPDPTabsData()
    expect(data).toEqual([])
  })

  it('when attributes of getNewMegaPDPTabsData have default values', () => {
    const data = getNewMegaPDPTabsData([], {})
    expect(data).toEqual([])
  })

  it('when have valid data', () => {
    const data = getNewMegaPDPTabsData(selectedTabsMock, responseMockGroupData)
    expect(data).toEqual(responseNewTabsData)
  })
})

describe('getTabsUrl', () => {
  it('when all attributes of getTabsUrl are undefined', () => {
    const data = getTabsUrl()
    expect(data).toEqual('/')
  })

  it('when getTabsUrl have valid data and vgs present in group data', () => {
    const data = getTabsUrl(groupMockWithVg, 'new', 3)
    expect(data).toEqual('/products/willow-tote-24-in-colorblock/C8561-B4CAH.html')
  })
})

describe('getNewMegaPDPColors', () => {
  it('when all attributes of getNewMegaPDPColors are undefined', () => {
    const data = getNewMegaPDPTabsData()
    expect(data).toEqual([])
  })

  it('when getNewMegaPDPColors have valid data and vgs present in group data and colors have valid data ', () => {
    const data = getNewMegaPDPColors(groupMockWithVg, 'new.medium.pvc', colorsMock)[0]?.masterId
    expect(data).toEqual('CF102')
  })
})
