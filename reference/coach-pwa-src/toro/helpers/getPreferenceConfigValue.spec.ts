import getPreferenceConfigValue from 'toro/helpers/getPreferenceConfigValue'

const prefObjData = {
  brand: {
    desktop: {
      No: false,
      stickyAddToBagUponLand: true,
      stickyAddToBagBelowFold: false,
    },
    mobile: {
      No: false,
      stickyAddToBagUponLand: false,
      stickyAddToBagBelowFold: false,
    },
  },
  subBrand: {
    desktop: {
      No: false,
      stickyAddToBagUponLand: false,
      stickyAddToBagBelowFold: false,
    },
    mobile: {
      No: false,
      stickyAddToBagUponLand: true,
      stickyAddToBagBelowFold: false,
    },
  },
}

describe('getPreferenceConfigValue', () => {
  it.each([
    {
      prefValue: prefObjData,
      isSubBrand: false,
      isDesktop: true,
      expectedObj: {
        No: false,
        stickyAddToBagUponLand: true,
        stickyAddToBagBelowFold: false,
      },
    },
    {
      prefValue: prefObjData,
      isSubBrand: false,
      isDesktop: false,
      expectedObj: {
        No: false,
        stickyAddToBagUponLand: false,
        stickyAddToBagBelowFold: false,
      },
    },
    {
      prefValue: prefObjData,
      isSubBrand: true,
      isDesktop: true,
      expectedObj: {
        No: false,
        stickyAddToBagUponLand: false,
        stickyAddToBagBelowFold: false,
      },
    },
    {
      prefValue: prefObjData,
      isSubBrand: true,
      isDesktop: false,
      expectedObj: {
        No: false,
        stickyAddToBagUponLand: true,
        stickyAddToBagBelowFold: false,
      },
    },
  ])(
    'sould return needed object according to BM state',
    ({ prefValue, expectedObj, isSubBrand, isDesktop }) => {
      const result = getPreferenceConfigValue(prefValue, isSubBrand, isDesktop)
      expect(result).toStrictEqual(expectedObj)
    }
  )
})
