import '@testing-library/jest-dom'
import menuDataAtom, {
  setCategorySelectedInMenuAtomSetter,
  selectedMobileItemAtom,
  activeMobileMenuItemsAtom,
  subBrandRootCategoryIdAtom,
  isOneCoachNAEnabledAtom,
  isOneCoachInOutletCategoryAtom,
  oneSiteActiveBrandAtom,
} from 'store/menu-data.atom'
import { preferencesAtom } from 'store/preferences.atom'
import {
  subBrandAtom,
  isSubBrandActiveAtom,
  isOneCoachTabbedAtom,
  isOutletTabAtom,
} from 'store/global.atom'

const mockT1Category = {
  cgid: 'test-cgid',
  url: '/test-url',
  subCategories: [],
}

const mockT3Category = {
  cgid: 'test-cgid',
  url: '/test-url',
  subCategories: [],
  parentCategoryTree: [{ cgid: 'parent1' }, { cgid: 'parent2' }],
}

const mockCategoryWithSubCategories = {
  cgid: 'test-cgid',
  url: '/test-url',
  subCategories: ['subcat1'],
  parentCategoryTree: [{ cgid: 'parent1' }, { cgid: 'parent2' }],
}

describe('setCategorySelectedInMenuAtomSetter', () => {
  const mockGet = jest.fn()
  const mockSet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return early if cgid is not provided', () => {
    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: '' })
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('should return early if new global header is not enabled', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: false,
          },
        }
      }
      return {}
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'test-cgid' })
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('should return early if category is not found', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['cat1'],
          cat1: {
            cgid: 'cat1',
            subCategories: ['subcat1'],
          },
        }
      }
      return {}
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'non-existent' })
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('should return early if category has subcategories', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['cat1'],
          cat1: mockCategoryWithSubCategories,
        }
      }
      return {}
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'test-cgid' })
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('should set selected mobile item and active menu items for non-sub-brand case', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['cat1'],
          cat1: mockT3Category,
        }
      }
      if (atom === isSubBrandActiveAtom) {
        return false
      }
      return {}
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'test-cgid' })

    expect(mockSet).toHaveBeenCalledWith(selectedMobileItemAtom, {
      cgid: 'test-cgid',
      url: '/test-url',
    })

    expect(mockSet).toHaveBeenCalledWith(activeMobileMenuItemsAtom, {
      t1: 'parent1',
      t2: 'parent2',
    })
  })

  it('should set selected mobile item and active menu items for sub-brand case', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['test-sub-brand-root-category-id'],
          cat1: mockT3Category,
        }
      }
      if (atom === isSubBrandActiveAtom) {
        return true
      }
      if (atom === subBrandAtom) {
        return 'test-brand'
      }
      if (atom === subBrandRootCategoryIdAtom) {
        return 'test-sub-brand-root-category-id'
      }
      return 'root-category-id'
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'test-cgid' })

    expect(mockSet).toHaveBeenCalledWith(selectedMobileItemAtom, {
      cgid: 'test-cgid',
      url: '/test-url',
    })

    expect(mockSet).toHaveBeenCalledWith(activeMobileMenuItemsAtom, {
      t1: 'test-sub-brand-root-category-id',
      t2: 'parent2',
    })
  })

  it('should set correct menu items for OneCoach NA sub-brand when root category is not in topCategories', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['coachtopia-all', 'coachtopia-bags'],
          'coachtopia-all-view-all': {
            cgid: 'coachtopia-all-view-all',
            url: '/shop/coachtopia/all/view-all',
            subCategories: [],
            parentCategoryTree: [{ cgid: 'coachtopia-all' }, { cgid: 'coachtopia-all-view-all' }],
          },
        }
      }
      if (atom === isSubBrandActiveAtom) {
        return true
      }
      if (atom === subBrandRootCategoryIdAtom) {
        return 'coachtopia'
      }
      if (atom === isOneCoachNAEnabledAtom) {
        return true
      }
      return false
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'coachtopia-all-view-all' })

    expect(mockSet).toHaveBeenCalledWith(selectedMobileItemAtom, {
      cgid: 'coachtopia-all-view-all',
      url: '/shop/coachtopia/all/view-all',
    })

    expect(mockSet).toHaveBeenCalledWith(activeMobileMenuItemsAtom, {
      t1: 'coachtopia',
      t2: 'coachtopia-all',
    })
  })

  it('should handle category without parent tree', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === preferencesAtom) {
        return {
          generalConfiguration: {
            enableNewGlobalHeader: true,
          },
        }
      }
      if (atom === menuDataAtom) {
        return {
          topCategories: ['cat1'],
          cat1: mockT1Category,
        }
      }
      if (atom === isSubBrandActiveAtom) {
        return false
      }
      return {}
    })

    setCategorySelectedInMenuAtomSetter(mockGet, mockSet, { cgid: 'test-cgid' })

    expect(mockSet).toHaveBeenCalledWith(selectedMobileItemAtom, {
      cgid: 'test-cgid',
      url: '/test-url',
    })

    expect(mockSet).toHaveBeenCalledWith(activeMobileMenuItemsAtom, {
      t1: 'test-cgid',
      t2: 'test-cgid',
    })
  })
})

describe('isOneCoachInOutletCategoryAtom', () => {
  const mockGet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const readAtom = () => isOneCoachInOutletCategoryAtom.read(mockGet)

  it('should return true when OneCoach NA is enabled and active brand is outlet', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return true
      if (atom === oneSiteActiveBrandAtom) return 'outlet'
      return undefined
    })

    expect(readAtom()).toBe(true)
  })

  it('should return false when OneCoach NA is enabled and active brand is not outlet', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return true
      if (atom === oneSiteActiveBrandAtom) return 'coach'
      return undefined
    })

    expect(readAtom()).toBe(false)
  })

  it('should return false when OneCoach NA is enabled and active brand is undefined', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return true
      if (atom === oneSiteActiveBrandAtom) return undefined
      return undefined
    })

    expect(readAtom()).toBe(false)
  })

  it('should return true when OneCoach NA is disabled but both isOneCoachTabbed and isOutletTab are true', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return false
      if (atom === isOneCoachTabbedAtom) return true
      if (atom === isOutletTabAtom) return true
      return undefined
    })

    expect(readAtom()).toBe(true)
  })

  it('should return false when OneCoach NA is disabled and isOneCoachTabbed is false', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return false
      if (atom === isOneCoachTabbedAtom) return false
      if (atom === isOutletTabAtom) return true
      return undefined
    })

    expect(readAtom()).toBe(false)
  })

  it('should return false when OneCoach NA is disabled and isOutletTab is false', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return false
      if (atom === isOneCoachTabbedAtom) return true
      if (atom === isOutletTabAtom) return false
      return undefined
    })

    expect(readAtom()).toBe(false)
  })

  it('should return false when OneCoach NA is disabled and both isOneCoachTabbed and isOutletTab are false', () => {
    mockGet.mockImplementation((atom) => {
      if (atom === isOneCoachNAEnabledAtom) return false
      if (atom === isOneCoachTabbedAtom) return false
      if (atom === isOutletTabAtom) return false
      return undefined
    })

    expect(readAtom()).toBe(false)
  })
})
