import getProductCardsData, {
  isTemplateSupportsProductCards,
} from 'toro/helpers/getProductCardsData'
import getProductCategoryAttributeConfig from 'toro/helpers/getProductCategoryAttributeConfig'
import { TangibleeControlType } from 'toro/components/product/desktop/ProductTangibleeControl'
import { MenuData } from 'store/menu-data.atom'
import Category from 'toro/types/categoryTypes'
import { TemplateName, TemplatePerDevice } from 'toro/constants/templates'

jest.mock('toro/helpers/getProductCategoryAttributeConfig')
const mockGetProductCategoryAttributeConfig =
  getProductCategoryAttributeConfig as jest.MockedFunction<typeof getProductCategoryAttributeConfig>

describe('getProductCardsData', () => {
  const mockMenuData = {
    topCategories: ['category1'],
    category1: {
      cgid: 'category1',
      name: 'Test Category',
      parentCategoryId: 'root',
    },
  } as unknown as MenuData

  const mockCategoryData = {
    cgid: 'category1',
    name: 'Test Category',
    parentCategoryId: 'root',
  } as unknown as Category

  const mockVgImageGroups = {
    variant1: [
      {
        viewType: 'Product',
        images: [
          {
            src: 'https://coach.scene7.com/is/image/Coach/cck48_b4wbr_a0',
            title: 'Front view',
            alt: 'Product front view',
          },
          {
            src: 'https://coach.scene7.com/is/image/Coach/cck48_b4wbr_a1',
            title: 'Side view',
            alt: 'Product side view',
          },
          {
            src: 'https://coach.scene7.com/is/image/Coach/cck48_b4wbr_a2',
            title: 'Back view',
            alt: 'Product back view',
          },
          {
            src: 'https://coach.scene7.com/is/image/Coach/cck48_b4wbr_a99',
            title: 'Detail view',
            alt: 'Product detail view',
          },
        ],
      },
    ],
  }

  const mockPageDataCustomAttributes = {
    c_height: '10 inches',
    c_itemWidth: '8 inches',
    c_length: '3 inches',
    c_handleDetail: 'Leather handles',
    c_material: 'Premium leather',
    c_heightAttribute: '10 inches',
    c_widthAttribute: '8 inches',
    c_depthAttribute: '3 inches',
    c_heelHeightAttribute: '2 inches',
    c_shaftHeightAttribute: '12 inches',
    c_platformHeightAttribute: '1 inch',
    c_handledropAttribute: 'Leather handles',
    c_materialDetailAttribute: 'Premium leather',
    c_featuresDetailAttribute: 'Water resistant',
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetProductCategoryAttributeConfig.mockReturnValue({
      catHeadlineAttribute: 'Test Headline',
      catBodyAttribute: 'Test Body',
      catimageAssetAttribute: 'a0,a1,a2,a99',
    })
  })

  describe('when visualProductDetailData is empty or invalid', () => {
    it('should return empty array when visualProductDetailData is empty', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        '',
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
    })

    it('should return empty array when visualProductDetailData is null', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        null as any,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
    })

    it('should return empty array when visualProductDetailData is invalid JSON', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        'invalid json',
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to parse visualProductDetailData:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('bagsize card', () => {
    const mockBagSizeConfig = JSON.stringify({
      bagsize: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        dimensions: {
          heightAttribute: 'heightAttribute',
          widthAttribute: 'widthAttribute',
          depthAttribute: 'depthAttribute',
        },
      },
    })

    it('should create bag size card with all dimensions', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockBagSizeConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Bag size',
        description: 'Test Body',
        loadStrategy: null,
        tangibleeCta: TangibleeControlType.vpcDetails,
        hotspots: expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringContaining('Height'),
            icon: 'vertical',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Width'),
            icon: 'diagonal',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Length'),
            icon: 'horizontal',
          }),
        ]),
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockBagSizeConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })

    it('should return null when all dimensions are missing', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockBagSizeConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('bagSpace card', () => {
    const mockBagSpaceConfig = JSON.stringify({
      bagSpace: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
      },
    })

    it('should create bag space card', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockBagSpaceConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Bag space',
        description: 'Test Body',
        loadStrategy: null,
        styleVariant: 'bagSpace',
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockBagSpaceConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('seeHowFits card', () => {
    const mockSeeHowFitsConfig = JSON.stringify({
      seeHowFits: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
      },
    })

    it('should create see how it fits card', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockSeeHowFitsConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Try it on',
        description: 'Test Body',
        loadStrategy: null,
        tangibleeCta: TangibleeControlType.vpcMedia,
      })
    })
  })

  describe('hardware card', () => {
    const mockHardwareConfig = JSON.stringify({
      hardware: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        handledropAttribute: 'handledropAttribute',
      },
    })

    it('should create hardware card with hotspot', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockHardwareConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Handles',
        description: 'Test Body',
        loadStrategy: null,
        styleVariant: 'tooltip',
        hotspots: [
          expect.objectContaining({
            title: 'Leather handles',
            icon: 'plus',
          }),
        ],
      })
    })

    it('should return null when hardware details are missing', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockHardwareConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('material card', () => {
    const mockMaterialConfig = JSON.stringify({
      material: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        materialDetailAttribute: 'materialDetailAttribute',
      },
    })

    it('should create material card with hotspot', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMaterialConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Materials',
        description: 'Test Body',
        loadStrategy: null,
        styleVariant: 'tooltip',
        hotspots: [
          expect.objectContaining({
            title: 'Premium leather',
            icon: 'plus',
          }),
        ],
      })
    })
  })

  describe('measurement card', () => {
    const mockMeasurementConfig = JSON.stringify({
      measurement: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        dimensions: {
          heelHeightAttribute: 'heelHeightAttribute',
          shaftHeightAttribute: 'shaftHeightAttribute',
          platformHeightAttribute: 'platformHeightAttribute',
        },
      },
    })

    it('should create measurement card with heel height', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMeasurementConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Measurements',
        description: 'Test Body',
        loadStrategy: null,
        hotspots: [
          expect.objectContaining({
            title: expect.stringContaining('Heel Height'),
            icon: 'vertical',
          }),
        ],
        imgShift: { mt: '10%', ml: '100%', transform: 'scale(1.5)' },
      })
    })
  })

  describe('features card', () => {
    const mockFeaturesConfig = JSON.stringify({
      features: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        featuresDetailAttribute: 'featuresDetailAttribute',
      },
    })

    it('should create features card with hotspot', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockFeaturesConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Features',
        description: 'Test Body',
        loadStrategy: null,
        hotspots: [
          expect.objectContaining({
            title: 'Water resistant',
            icon: 'horizontal',
            titleAbove: true,
          }),
        ],
        imgShift: { mt: '65%', transform: 'scale(1.8)' },
      })
    })
  })

  describe('rtwMeasurement card', () => {
    const mockRtwMeasurementConfig = JSON.stringify({
      rtwMeasurement: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        dimensions: {
          heightAttribute: 'heightAttribute',
          depthAttribute: 'depthAttribute',
          widthAttribute: 'widthAttribute',
        },
      },
    })

    it('should create RTW measurement card with height hotspot', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockRtwMeasurementConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Measurements',
        description: 'Test Body',
        loadStrategy: null,
        hotspots: [
          expect.objectContaining({
            title: expect.stringContaining('Height'),
            icon: 'vertical',
            x: 41,
            y: '50%',
          }),
        ],
        imgShift: { ml: 10 },
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockRtwMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])

      // Reset mock
      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })
    })

    it('should return null when no measurement dimensions are found', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockRtwMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('walletsMeasurement card', () => {
    const mockWalletsMeasurementConfig = JSON.stringify({
      walletsMeasurement: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        dimensions: {
          heightAttribute: 'heightAttribute',
          widthAttribute: 'widthAttribute',
          depthAttribute: 'depthAttribute',
        },
      },
    })

    it('should create wallets measurement card with all dimensions', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockWalletsMeasurementConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Measurements',
        description: 'Test Body',
        loadStrategy: null,
        tangibleeCta: TangibleeControlType.vpcDetails,
        hotspots: expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringContaining('Height'),
            icon: 'vertical',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Width'),
            icon: 'diagonal',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Length'),
            icon: 'horizontal',
          }),
        ]),
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockWalletsMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])

      // Reset mock
      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })
    })

    it('should return null when all dimensions are missing', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockWalletsMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('miscMeasurement card', () => {
    const mockMiscMeasurementConfig = JSON.stringify({
      miscMeasurement: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        dimensions: {
          heightAttribute: 'heightAttribute',
          widthAttribute: 'widthAttribute',
          depthAttribute: 'depthAttribute',
        },
      },
    })

    it('should create misc measurement card with all dimensions', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscMeasurementConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Measurements',
        description: 'Test Body',
        loadStrategy: null,
        tangibleeCta: TangibleeControlType.vpcDetails,
        hotspots: expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringContaining('Length'),
            icon: 'horizontal',
            x: '20%',
            y: '110%',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Height'),
            icon: 'vertical',
            x: '50%',
            y: '110%',
          }),
          expect.objectContaining({
            title: expect.stringContaining('Width'),
            icon: 'diagonal',
            x: '80%',
            y: '110%',
          }),
        ]),
        imgShift: { mt: '-60px' },
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])

      // Reset mock
      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })
    })

    it('should return null when all dimensions are missing', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscMeasurementConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('miscFeatures card', () => {
    const mockMiscFeaturesConfig = JSON.stringify({
      miscFeatures: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        featuresDetailAttribute: 'featuresDetailAttribute',
      },
    })

    it('should create misc features card with hotspot', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscFeaturesConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: 'Test Headline',
        subtitle: 'Features',
        description: 'Test Body',
        loadStrategy: null,
        styleVariant: 'tooltip',
        hotspots: [
          expect.objectContaining({
            title: 'Water resistant',
            icon: 'plus',
            x: '50%',
            y: '60%',
          }),
        ],
      })
    })

    it('should return null when title is missing', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({})

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscFeaturesConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])

      // Reset mock
      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })
    })

    it('should return null when features details are missing', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMiscFeaturesConfig,
        {},
        mockCategoryData
      )

      expect(result).toEqual([])
    })
  })

  describe('multiple cards', () => {
    const mockMultipleCardsConfig = JSON.stringify({
      bagSpace: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
      },
      material: {
        catHeadlineAttribute: 'catHeadlineAttribute',
        catBodyAttribute: 'catBodyAttribute',
        catimageAssetAttribute: 'catimageAssetAttribute',
        materialDetailAttribute: 'materialDetailAttribute',
      },
    })

    it('should create multiple cards', () => {
      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockMultipleCardsConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(2)
      expect(result[0].subtitle).toBe('Bag space')
      expect(result[1].subtitle).toBe('Materials')
    })
  })

  describe('error handling', () => {
    it('should handle errors in card creation gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Test error')
      })

      const mockConfig = JSON.stringify({
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Bag Space Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in bag size card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Bag size error')
      })

      const mockConfig = JSON.stringify({
        bagsize: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          dimensions: {
            heightAttribute: 'heightAttribute',
            widthAttribute: 'widthAttribute',
            depthAttribute: 'depthAttribute',
          },
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Bag Size Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in see how it fits card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('See how it fits error')
      })

      const mockConfig = JSON.stringify({
        seeHowFits: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build See How It Fits Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in hardware card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Hardware error')
      })

      const mockConfig = JSON.stringify({
        hardware: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          handledropAttribute: 'handledropAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Hardware Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in material card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Material error')
      })

      const mockConfig = JSON.stringify({
        material: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          materialDetailAttribute: 'materialDetailAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Material Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in measurement card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Measurement error')
      })

      const mockConfig = JSON.stringify({
        measurement: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          dimensions: {
            heelHeightAttribute: 'heelHeightAttribute',
            shaftHeightAttribute: 'shaftHeightAttribute',
            platformHeightAttribute: 'platformHeightAttribute',
          },
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Measurement Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in features card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Features error')
      })

      const mockConfig = JSON.stringify({
        features: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          featuresDetailAttribute: 'featuresDetailAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Features Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in RTW measurement card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('RTW measurement error')
      })

      const mockConfig = JSON.stringify({
        rtwMeasurement: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          dimensions: {
            heightAttribute: 'heightAttribute',
            depthAttribute: 'depthAttribute',
            widthAttribute: 'widthAttribute',
          },
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build RTW Measurement Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in wallets measurement card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Wallets measurement error')
      })

      const mockConfig = JSON.stringify({
        walletsMeasurement: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          dimensions: {
            heightAttribute: 'heightAttribute',
            widthAttribute: 'widthAttribute',
            depthAttribute: 'depthAttribute',
          },
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Wallets Measurement Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in misc measurement card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Misc measurement error')
      })

      const mockConfig = JSON.stringify({
        miscMeasurement: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          dimensions: {
            heightAttribute: 'heightAttribute',
            widthAttribute: 'widthAttribute',
            depthAttribute: 'depthAttribute',
          },
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Misc Measurement Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it('should handle errors in features with hotspot card creation', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockGetProductCategoryAttributeConfig.mockImplementation(() => {
        throw new Error('Features with hotspot error')
      })

      const mockConfig = JSON.stringify({
        rtwFeatures: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
          featuresDetailAttribute: 'featuresDetailAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error attempting to build Features with hotspot Card:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('image mapping', () => {
    it('should map image sources correctly with realistic suffixes', () => {
      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })

      const mockConfig = JSON.stringify({
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0].images).toBeDefined()
      // Should map to the first available image with suffix a0
      expect(result[0].images.variant1).toBe(
        'https://coach.scene7.com/is/image/Coach/cck48_b4wbr_a0'
      )
    })

    it('should map image sources correctly', () => {
      const mockConfig = JSON.stringify({
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0].images).toBeDefined()
    })

    it('should handle empty image groups', () => {
      const mockConfig = JSON.stringify({
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        {},
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0].images).toEqual({})
    })

    it('should handle multiple variants with different image suffixes', () => {
      const mockMultiVariantImageGroups = {
        variant1: [
          {
            viewType: 'Product',
            images: [
              {
                src: 'https://coach.scene7.com/is/image/Coach/product1_a0',
                title: 'Product 1 front view',
                alt: 'Product 1 front view',
              },
              {
                src: 'https://coach.scene7.com/is/image/Coach/product1_a99',
                title: 'Product 1 detail view',
                alt: 'Product 1 detail view',
              },
            ],
          },
        ],
        variant2: [
          {
            viewType: 'Product',
            images: [
              {
                src: 'https://coach.scene7.com/is/image/Coach/product2_a1',
                title: 'Product 2 side view',
                alt: 'Product 2 side view',
              },
              {
                src: 'https://coach.scene7.com/is/image/Coach/product2_a2',
                title: 'Product 2 back view',
                alt: 'Product 2 back view',
              },
            ],
          },
        ],
      }

      mockGetProductCategoryAttributeConfig.mockReturnValue({
        catHeadlineAttribute: 'Test Headline',
        catBodyAttribute: 'Test Body',
        catimageAssetAttribute: 'a0,a1,a2,a99',
      })

      const mockConfig = JSON.stringify({
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockMultiVariantImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0].images).toBeDefined()
      expect(result[0].images.variant1).toBe('https://coach.scene7.com/is/image/Coach/product1_a0')
      expect(result[0].images.variant2).toBe('https://coach.scene7.com/is/image/Coach/product2_a1')
    })
  })

  describe('unsupported card types', () => {
    it('should ignore unsupported card types', () => {
      const mockConfig = JSON.stringify({
        unsupportedCardType: {
          catHeadlineAttribute: 'catHeadlineAttribute',
        },
        bagSpace: {
          catHeadlineAttribute: 'catHeadlineAttribute',
          catBodyAttribute: 'catBodyAttribute',
          catimageAssetAttribute: 'catimageAssetAttribute',
        },
      })

      const result = getProductCardsData(
        mockVgImageGroups,
        mockMenuData,
        mockConfig,
        mockPageDataCustomAttributes,
        mockCategoryData
      )

      expect(result).toHaveLength(1)
      expect(result[0].subtitle).toBe('Bag space')
    })
  })
})

describe('isTemplateSupportsProductCards', () => {
  const supportedTemplates: [TemplatePerDevice, string][] = [
    [{ desktop: TemplateName.default, mobile: TemplateName.pdpv6 }, 'pdpv6 template'],
    [{ desktop: TemplateName.pdpv5, mobile: TemplateName.default }, 'pdpv5 template'],
    [{ desktop: TemplateName.pdpv5_0, mobile: TemplateName.default }, 'pdpv5_0 template'],
    [{ desktop: TemplateName.pdpv5_1, mobile: TemplateName.default }, 'pdpv5_1 template'],
  ]

  const unsupportedTemplates: [TemplatePerDevice, string][] = [
    [{ desktop: TemplateName.default, mobile: TemplateName.default }, 'default template'],
    [
      { desktop: 'unknown-template' as TemplateName, mobile: TemplateName.default },
      'unknown template',
    ],
  ]

  describe('when template supports product cards', () => {
    test.each(supportedTemplates)('should return true for %s', (template) => {
      expect(isTemplateSupportsProductCards(template)).toBe(true)
    })
  })

  describe('when template does not support product cards', () => {
    test.each(unsupportedTemplates)('should return false for %s', (template) => {
      expect(isTemplateSupportsProductCards(template)).toBe(false)
    })
  })
})
