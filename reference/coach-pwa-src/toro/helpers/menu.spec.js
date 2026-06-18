import {
  getCategoriesByCgIds,
  isVisibleMenuCategory,
  isCategoryVisible,
  getVisibleMenuData,
  normalizeMenuData,
} from 'toro/helpers/menu'

describe('getCategoriesByCgIds', () => {
  const menuData = {
    bags: { cgid: 'bags' },
    shoes: { cgid: 'shoes' },
    women: { cgid: 'women' },
  }

  it.each([
    {
      description: 'should return empty array if no category IDs are provided',
      ids: undefined,
      expected: [],
    },
    {
      description: 'should return empty array if categories were not found in full list',
      ids: ['acessories', 'wallets'],
      expected: [],
    },
    {
      description: 'should return categories by IDs',
      ids: ['bags', 'women'],
      expected: [{ cgid: 'bags' }, { cgid: 'women' }],
    },
  ])('$description', ({ ids, expected }) => {
    const result = getCategoriesByCgIds(menuData, ids)
    expect(result).toEqual(expected)
  })
})

describe('isCategoryVisible', () => {
  it.each([
    {
      description: 'should return false if category has outlet custom attribute',
      categoryData: {
        cgid: 'women',
        customCategoryAttributes: { c_isOutlet: true },
      },
      expected: false,
    },
    {
      description: 'should return true for regular category',
      categoryData: { cgid: 'women' },
      expected: true,
    },
  ])('$description', ({ categoryData, expected }) => {
    const result = isCategoryVisible(categoryData)
    expect(result).toBe(expected)
  })
})

const mockGuestSession = {
  user: {
    sourceCodeGroupCategoryID: null,
    listSourceCodeGroupCategoriesID: [],
    CustomerGroups: {
      customerGroups: [],
    },
  },
}

const mockSignInSession = {
  user: {
    sourceCodeGroupCategoryID: 'employee',
    listSourceCodeGroupCategoriesID: [],
    CustomerGroups: {
      customerGroups: [],
    },
  },
}

const mockCommonCategory = {
  cgid: 'men',
  isSaleCategory: false,
  isSourceCodedSaleCategory: false,
  scheduledCustomerGroups: [],
  subCategories: [],
  isOutletSubCategory: false,
}

const mockSourceCodedCategory = {
  cgid: 'employee',
  isSaleCategory: true,
  isSourceCodedSaleCategory: true,
  scheduledCustomerGroups: [],
  subCategories: [],
  isOutletSubCategory: false,
}

const mockAltSourceCodedCategory = {
  ...mockSourceCodedCategory,
  cgid: 'employee-sale',
}

describe('isVisibleMenuCategory', () => {
  const mockCustomerGroupsCategory = {
    ...mockSourceCodedCategory,
    scheduledCustomerGroups: ['EmployeeCustomerGroups'],
  }

  it.each([
    {
      description: 'should return true for guest user and common category',
      sessionData: mockGuestSession,
      categoryData: mockCommonCategory,
      expected: true,
    },
    {
      description: 'should return false if menu category is sale but not source coded',
      sessionData: mockGuestSession,
      categoryData: {
        ...mockSourceCodedCategory,
        isSourceCodedSaleCategory: false,
      },
      expected: false,
    },
    {
      description:
        'should return false if category source coded but user does not have it available',
      sessionData: mockGuestSession,
      categoryData: mockSourceCodedCategory,
      expected: false,
    },
    {
      description: 'should return true if category source coded and user has it available',
      sessionData: mockSignInSession,
      categoryData: mockSourceCodedCategory,
      expected: true,
    },
    {
      description:
        'should return true if category source coded and user has it available in the list',
      sessionData: {
        user: {
          ...mockSignInSession.user,
          listSourceCodeGroupCategoriesID: ['employee-sale'],
        },
      },
      categoryData: mockAltSourceCodedCategory,
      expected: true,
    },
    {
      description: 'should return false if category has customer groups but user is not there',
      sessionData: mockSignInSession,
      categoryData: mockCustomerGroupsCategory,
      expected: false,
    },
    {
      description: 'should return true if category has customer groups and user is there',
      sessionData: {
        user: {
          ...mockSignInSession.user,
          CustomerGroups: {
            customerGroups: [{ name: 'EmployeeCustomerGroups' }],
          },
        },
      },
      categoryData: mockCustomerGroupsCategory,
      expected: true,
    },
  ])('$description', ({ sessionData, categoryData, expected }) => {
    const result = isVisibleMenuCategory(sessionData, categoryData)
    expect(result).toBe(expected)
  })
})

describe('getVisibleMenuData', () => {
  const mockBundleAndSaveCategory = {
    ...mockCommonCategory,
    cgid: 'bundleandsave',
  }
  const mockFullMenuData = {
    topCategories: ['men', 'employee', 'employee-sale', 'bundleandsave'],
    men: mockCommonCategory,
    employee: mockSourceCodedCategory,
    'employee-sale': mockAltSourceCodedCategory,
    bundleandsave: mockBundleAndSaveCategory,
  }

  const expectedGuestVisibleCategories = {
    topCategories: ['men', 'employee', 'employee-sale', 'bundleandsave'],
    men: mockCommonCategory,
  }

  it.each([
    {
      description: 'should return visible menu data for guest',
      sessionData: mockGuestSession,
      isShowBundleSave: false,
      expected: expectedGuestVisibleCategories,
    },
    {
      description: 'should return visible menu data for signed in user',
      sessionData: mockSignInSession,
      isShowBundleSave: false,
      expected: {
        ...expectedGuestVisibleCategories,
        employee: mockSourceCodedCategory,
      },
    },
    {
      description: 'should return visible menu data for guest when bundlesave category enabled',
      sessionData: mockGuestSession,
      isShowBundleSave: true,
      expected: {
        ...expectedGuestVisibleCategories,
        bundleandsave: mockBundleAndSaveCategory,
      },
    },
  ])('$description', ({ sessionData, isShowBundleSave, expected }) => {
    const result = getVisibleMenuData(mockFullMenuData, sessionData, isShowBundleSave)
    expect(result).toEqual(expected)
  })
})

describe('normalizeMenuData', () => {
  const mockRawCategories = [
    {
      ...mockCommonCategory,
      subCategories: [mockSourceCodedCategory],
    },
    mockAltSourceCodedCategory,
  ]
  const expectedNormalizedMenuData = {
    topCategories: ['men', 'employee-sale'],
    men: {
      ...mockCommonCategory,
      subCategories: ['employee'],
    },
    employee: mockSourceCodedCategory,
    'employee-sale': mockAltSourceCodedCategory,
    length: 3,
  }
  test('should return flat menu data object', () => {
    const result = normalizeMenuData(mockRawCategories)
    expect(result).toEqual(expectedNormalizedMenuData)
  })
})
