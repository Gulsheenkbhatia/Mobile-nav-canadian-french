import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import getProductCategoryAttributeConfig from 'toro/helpers/getProductCategoryAttributeConfig'
import { MenuData } from 'store/menu-data.atom'
import Category from 'toro/types/categoryTypes'
import { CustomAttributes, DetailedProduct } from 'toro/types/productTypes'
import { HotSpot } from 'toro/components/product/desktop/HotspotBadge'
import { TangibleeControlType } from 'toro/components/product/desktop/ProductTangibleeControl'
import { TemplateName, TemplatePerDevice } from 'toro/constants/templates'

type AttributeConfig = Record<string, string>

export type ProductCardItem = {
  title: string
  subtitle?: string
  description?: string
  images: Record<string, string>
  loadStrategy: 'lazy' | null
  tangibleeCta?: TangibleeControlType
  hotspots?: HotSpot[]
  styleVariant?: string
  imgShift?: {
    mt?: number | string
    mr?: number | string
    mb?: number | string
    ml?: number | string
    transform?: string
  }
}

type ImageObject = {
  src: string
  title: string
  alt: string
}

const mapSrcEndingsToFullSrc = (images: ImageObject[]): Record<string, string> => {
  return images.reduce<Record<string, string>>((acc, image) => {
    const srcEnding = image.src.split('_').pop() || ''
    acc[srcEnding] = image.src
    return acc
  }, {})
}

const getImageWithConfiguredSuffix = (
  vgImageGroups: Record<string, DetailedProduct['imageGroups']>,
  attributeConfig: AttributeConfig,
  defaultAsset: string
) => {
  const result = Object.keys(vgImageGroups).reduce((acc, key) => {
    const imageGroups = vgImageGroups[key]
    if (!imageGroups?.length || isEmpty(attributeConfig)) {
      return acc
    }
    const productImages = imageGroups?.filter((group) => group?.viewType === 'Product')
    const imageSuffixes = get(attributeConfig, `${defaultAsset}`, '')?.toString()?.split(',')
    const imageSuffixMap = mapSrcEndingsToFullSrc(get(productImages, '[0].images', []))
    if (!isEmpty(imageSuffixes) && !isEmpty(imageSuffixMap)) {
      for (const suffix of imageSuffixes) {
        if (Object.prototype.hasOwnProperty.call(imageSuffixMap, suffix)) {
          return { ...acc, [key]: imageSuffixMap[suffix] }
        }
      }
    }
    return acc
  }, {})
  return result
}

const getPreferenceValues = (
  preferences: Record<string, any>,
  menuData: MenuData,
  categoryData: Category
): AttributeConfig => {
  const preferenceValues = Object.values(preferences).filter(
    (item) => typeof item === 'string'
  ) as string[]
  return getProductCategoryAttributeConfig(menuData, categoryData, preferenceValues)
}

const getCustomAttribute = (pageDataCustomAttributes, attributeString: string) => {
  const splitAttributes = attributeString.split(',')
  const attributeWithData = splitAttributes.find((attribute) =>
    get(pageDataCustomAttributes, `c_${attribute}`)
  )
  return get(pageDataCustomAttributes, `c_${attributeWithData}`, null)
}

const getBagSizeCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}) => {
  try {
    // bagSize card configuration
    const bagSizeDimensionsKeys = Object.values(get(cardConfigs, 'dimensions', {}))
    const bagSizePropsValues = bagSizeDimensionsKeys.map((value) =>
      get(pageDataCustomAttributes, `c_${value}`)
    )

    const bagSizeDimensionsObj = Object.fromEntries(
      bagSizeDimensionsKeys.map((key, index) => [key, bagSizePropsValues[index]])
    )
    const bagSizeAttributeConfig = {
      ...getPreferenceValues(cardConfigs, menuData, categoryData),
      ...bagSizeDimensionsObj,
    }

    const title = get(bagSizeAttributeConfig, cardConfigs.catHeadlineAttribute, '')
    const height = get(bagSizeAttributeConfig, cardConfigs.dimensions.heightAttribute, '')
    const width = get(bagSizeAttributeConfig, cardConfigs.dimensions.widthAttribute, '')
    const length = get(bagSizeAttributeConfig, cardConfigs.dimensions.depthAttribute, '')

    if (!title || (!height && !width && !length)) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      bagSizeAttributeConfig,
      cardConfigs.catimageAssetAttribute
    )

    const bagSizeCard: ProductCardItem = {
      title,
      subtitle: 'Bag size',
      description: get(bagSizeAttributeConfig, cardConfigs.catBodyAttribute, '') as string,
      images,
      loadStrategy: null,
      tangibleeCta: TangibleeControlType.vpcDetails,
      hotspots: [
        height
          ? {
              x: 40,
              y: '40%',
              title: `Height\n${height}`,
              icon: 'vertical',
            }
          : null,
        width
          ? {
              x: 54,
              y: '100%',
              title: `Width\n${width}`,
              icon: 'diagonal',
            }
          : null,
        length
          ? {
              x: '60%',
              y: '100%',
              title: `Length\n${length}`,
              icon: 'horizontal',
            }
          : null,
      ].filter((hotspot) => !!hotspot),
    }

    return bagSizeCard
  } catch (error) {
    console.error('Error attempting to build Bag Size Card:', error)
    return null
  }
}

const getBagSpaceCard = ({ cardConfigs, menuData, categoryData, vgImageGroups }) => {
  try {
    // bagSpace card configuration
    const bagSpacePreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(bagSpacePreferenceValues, cardConfigs.catHeadlineAttribute, '')

    if (!title) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      bagSpacePreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    const bagSpaceCard: ProductCardItem = {
      title,
      subtitle: 'Bag space',
      description: get(bagSpacePreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      loadStrategy: null,
      styleVariant: 'bagSpace',
    }

    return bagSpaceCard
  } catch (error) {
    console.error('Error attempting to build Bag Space Card:', error)
    return null
  }
}

const getSeeHowItFitsCard = ({ cardConfigs, menuData, categoryData, vgImageGroups }) => {
  try {
    // see how it fits card configuration
    const howItFitsPreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(howItFitsPreferenceValues, cardConfigs.catHeadlineAttribute, '')

    if (!title) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      howItFitsPreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    const howItFitsCard: ProductCardItem = {
      title,
      subtitle: 'Try it on',
      description: get(howItFitsPreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      loadStrategy: null,
      tangibleeCta: TangibleeControlType.vpcMedia,
    }

    return howItFitsCard
  } catch (error) {
    console.error('Error attempting to build See How It Fits Card:', error)
    return null
  }
}

const getHardwareCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}) => {
  try {
    // handleStrap card configuration
    const handleStrapPreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(handleStrapPreferenceValues, cardConfigs.catHeadlineAttribute, '')

    const handleStrapDetails = getCustomAttribute(
      pageDataCustomAttributes,
      cardConfigs.handledropAttribute
    )

    if (!title || !handleStrapDetails) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      handleStrapPreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    const handleStrapCard: ProductCardItem = {
      title,
      subtitle: 'Handles',
      description: get(handleStrapPreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      loadStrategy: null,
      hotspots: [
        {
          x: '50%',
          y: '60%',
          title: handleStrapDetails,
          icon: 'plus',
        },
      ],
      styleVariant: 'tooltip',
    }

    return handleStrapCard
  } catch (error) {
    console.error('Error attempting to build Hardware Card:', error)
    return null
  }
}

const getMaterialCard = ({
  cardConfigs,
  categoryData,
  menuData,
  pageDataCustomAttributes,
  vgImageGroups,
  coordinates = { x: '50%', y: '15%' },
}) => {
  try {
    // materials card configuration
    const materialsPreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(materialsPreferenceValues, cardConfigs.catHeadlineAttribute, '')

    const materialCallout = getCustomAttribute(
      pageDataCustomAttributes,
      cardConfigs.materialDetailAttribute
    )

    if (!title || !materialCallout) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      materialsPreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    return {
      title,
      subtitle: 'Materials',
      description: get(materialsPreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      hotspots: [
        {
          x: coordinates.x,
          y: coordinates.y,
          icon: 'plus',
          title: materialCallout,
        },
      ],
      loadStrategy: null,
      styleVariant: 'tooltip',
    }
  } catch (error) {
    console.error('Error attempting to build Material Card:', error)
    return null
  }
}

const getFootwearMaterialCard = (data) =>
  getMaterialCard({ ...data, coordinates: { x: '35%', y: '60%' } })

const getMeasurementCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}: {
  cardConfigs: {
    catHeadlineAttribute: string
    catBodyAttribute: string
    catimageAssetAttribute: string
    dimensions: {
      heelHeightAttribute: string
      shaftHeightAttribute: string
      platformHeightAttribute: string
    }
  }
  pageDataCustomAttributes: any
  menuData: any
  categoryData: any
  vgImageGroups: any
}) => {
  try {
    // measurement card configuration
    const measurementDimensionsKeys = Object.values(get(cardConfigs, 'dimensions', {}))

    const hotspotTitleMap = {
      [cardConfigs.dimensions.heelHeightAttribute]: 'Heel',
      [cardConfigs.dimensions.shaftHeightAttribute]: 'Shaft',
      [cardConfigs.dimensions.platformHeightAttribute]: 'Platform',
    }

    let foundMeasurementValue
    const foundMeasurementKey = measurementDimensionsKeys.find((key) => {
      foundMeasurementValue = get(pageDataCustomAttributes, `c_${key}`)
      return foundMeasurementValue
    })

    const measurementPropsValues = measurementDimensionsKeys.map((value) =>
      get(pageDataCustomAttributes, `c_${value}`)
    )

    const measurementDimensionsObj = Object.fromEntries(
      measurementDimensionsKeys.map((key, index) => [key, measurementPropsValues[index]])
    )
    const measurementAttributeConfig = {
      ...getPreferenceValues(cardConfigs, menuData, categoryData),
      ...measurementDimensionsObj,
    }

    const title = get(measurementAttributeConfig, cardConfigs.catHeadlineAttribute, '')

    if (!title || !hotspotTitleMap[foundMeasurementKey]) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      measurementAttributeConfig,
      cardConfigs.catimageAssetAttribute
    )

    const measurementCard: ProductCardItem = {
      title,
      subtitle: 'Measurements',
      description: get(measurementAttributeConfig, cardConfigs.catBodyAttribute, '') as string,
      images,
      loadStrategy: null,
      hotspots: foundMeasurementKey
        ? [
            {
              x: '20%',
              y: '70%',
              title: `${hotspotTitleMap[foundMeasurementKey]} Height\n${get(
                measurementAttributeConfig,
                foundMeasurementKey,
                ''
              )}"`,
              icon: 'vertical',
            },
          ]
        : [],
      imgShift: { mt: '10%', ml: '100%', transform: 'scale(1.5)' },
    }

    return measurementCard
  } catch (error) {
    console.error('Error attempting to build Measurement Card:', error)
    return null
  }
}

const getRtwMeasurementCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}: {
  cardConfigs: {
    catHeadlineAttribute: string
    catBodyAttribute: string
    catimageAssetAttribute: string
    dimensions: {
      heightAttribute: string
      depthAttribute: string
      widthAttribute: string
    }
  }
  pageDataCustomAttributes: any
  menuData: any
  categoryData: any
  vgImageGroups: any
}) => {
  try {
    // measurement card configuration
    const measurementDimensionsKeys = Object.values(get(cardConfigs, 'dimensions', {}))

    const hotspotTitleMap = {
      [cardConfigs.dimensions.heightAttribute]: 'Height',
      [cardConfigs.dimensions.depthAttribute]: 'Length',
      [cardConfigs.dimensions.widthAttribute]: 'Width',
    }

    let foundMeasurementValue
    const foundMeasurementKey = measurementDimensionsKeys.find((key) => {
      foundMeasurementValue = get(pageDataCustomAttributes, `c_${key}`)
      return foundMeasurementValue
    })

    const measurementPropsValues = measurementDimensionsKeys.map((value) =>
      get(pageDataCustomAttributes, `c_${value}`)
    )

    const measurementDimensionsObj = Object.fromEntries(
      measurementDimensionsKeys.map((key, index) => [key, measurementPropsValues[index]])
    )
    const measurementAttributeConfig = {
      ...getPreferenceValues(cardConfigs, menuData, categoryData),
      ...measurementDimensionsObj,
    }

    const title = get(measurementAttributeConfig, cardConfigs.catHeadlineAttribute, '')

    if (!title || !hotspotTitleMap[foundMeasurementKey]) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      measurementAttributeConfig,
      cardConfigs.catimageAssetAttribute
    )

    const measurementCard: ProductCardItem = {
      title,
      subtitle: 'Measurements',
      description: get(measurementAttributeConfig, cardConfigs.catBodyAttribute, '') as string,
      images,
      loadStrategy: null,
      hotspots: foundMeasurementKey
        ? [
            {
              x: 41,
              y: '50%',
              title: `${hotspotTitleMap[foundMeasurementKey]}\n${get(
                measurementAttributeConfig,
                foundMeasurementKey,
                ''
              )}"`,
              icon: 'vertical',
            },
          ]
        : [],
      imgShift: { ml: 10 },
    }

    return measurementCard
  } catch (error) {
    console.error('Error attempting to build RTW Measurement Card:', error)
    return null
  }
}

const getWalletsMeasurementCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}) => {
  try {
    // wallets measurement card configuration
    const walletsDimensionsKeys = Object.values(get(cardConfigs, 'dimensions', {}))
    const walletsPropsValues = walletsDimensionsKeys.map((value) =>
      get(pageDataCustomAttributes, `c_${value}`)
    )

    const walletsDimensionsObj = Object.fromEntries(
      walletsDimensionsKeys.map((key, index) => [key, walletsPropsValues[index]])
    )
    const walletsAttributeConfig = {
      ...getPreferenceValues(cardConfigs, menuData, categoryData),
      ...walletsDimensionsObj,
    }

    const title = get(walletsAttributeConfig, cardConfigs.catHeadlineAttribute, '')
    const height = get(walletsAttributeConfig, cardConfigs.dimensions.heightAttribute, '')
    const width = get(walletsAttributeConfig, cardConfigs.dimensions.widthAttribute, '')
    const length = get(walletsAttributeConfig, cardConfigs.dimensions.depthAttribute, '')

    if (!title || (!height && !width && !length)) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      walletsAttributeConfig,
      cardConfigs.catimageAssetAttribute
    )

    const walletsCard: ProductCardItem = {
      title,
      subtitle: 'Measurements',
      description: get(walletsAttributeConfig, cardConfigs.catBodyAttribute, '') as string,
      images,
      loadStrategy: null,
      tangibleeCta: TangibleeControlType.vpcDetails,
      hotspots: [
        height
          ? {
              x: 40,
              y: '40%',
              title: `Height\n${height}`,
              icon: 'vertical',
            }
          : null,
        width
          ? {
              x: 54,
              y: '100%',
              title: `Width\n${width}`,
              icon: 'diagonal',
            }
          : null,
        length
          ? {
              x: '60%',
              y: '100%',
              title: `Length\n${length}`,
              icon: 'horizontal',
            }
          : null,
      ].filter((hotspot) => !!hotspot),
    }

    return walletsCard
  } catch (error) {
    console.error('Error attempting to build Wallets Measurement Card:', error)
    return null
  }
}

const getMiscMeasurementCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
}) => {
  try {
    // misc measurement card configuration
    const miscDimensionsKeys = Object.values(get(cardConfigs, 'dimensions', {}))
    const miscPropsValues = miscDimensionsKeys.map((value) =>
      get(pageDataCustomAttributes, `c_${value}`)
    )

    const miscDimensionsObj = Object.fromEntries(
      miscDimensionsKeys.map((key, index) => [key, miscPropsValues[index]])
    )
    const miscAttributeConfig = {
      ...getPreferenceValues(cardConfigs, menuData, categoryData),
      ...miscDimensionsObj,
    }

    const title = get(miscAttributeConfig, cardConfigs.catHeadlineAttribute, '')
    const length = get(miscAttributeConfig, cardConfigs.dimensions.depthAttribute, '')
    const height = get(miscAttributeConfig, cardConfigs.dimensions.heightAttribute, '')
    const width = get(miscAttributeConfig, cardConfigs.dimensions.widthAttribute, '')

    if (!title || (!length && !height && !width)) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      miscAttributeConfig,
      cardConfigs.catimageAssetAttribute
    )

    const miscCard: ProductCardItem = {
      title,
      subtitle: 'Measurements',
      description: get(miscAttributeConfig, cardConfigs.catBodyAttribute, '') as string,
      images,
      loadStrategy: null,
      tangibleeCta: TangibleeControlType.vpcDetails,
      hotspots: [
        length
          ? {
              x: '20%',
              y: '110%',
              title: `Length\n${length}`,
              icon: 'horizontal',
            }
          : null,
        height
          ? {
              x: '50%',
              y: '110%',
              title: `Height\n${height}`,
              icon: 'vertical',
            }
          : null,
        width
          ? {
              x: '80%',
              y: '110%',
              title: `Width\n${width}`,
              icon: 'diagonal',
            }
          : null,
      ].filter((hotspot) => !!hotspot),
      imgShift: { mt: '-60px' },
    }

    return miscCard
  } catch (error) {
    console.error('Error attempting to build Misc Measurement Card:', error)
    return null
  }
}

const getFeaturesCard = ({
  cardConfigs,
  pageDataCustomAttributes,
  menuData,
  categoryData,
  vgImageGroups,
  templates,
}) => {
  try {
    // features card configuration
    const featuresPreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(featuresPreferenceValues, cardConfigs.catHeadlineAttribute, '')

    const featuresDetails = getCustomAttribute(
      pageDataCustomAttributes,
      cardConfigs.featuresDetailAttribute
    )

    if (!title || !featuresDetails) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      featuresPreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    const imgShift =
      templates?.mobile === TemplateName.pdpv6
        ? { mt: '57%', transform: 'scale(1.8)' }
        : { mt: '65%', transform: 'scale(1.8)' }

    const featuresCard: ProductCardItem = {
      title,
      subtitle: 'Features',
      description: get(featuresPreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      loadStrategy: null,
      hotspots: featuresDetails
        ? [
            {
              x: '50%',
              y: '21%',
              title: featuresDetails,
              icon: 'horizontal',
              titleAbove: true,
            },
          ]
        : [],
      imgShift,
    }

    return featuresCard
  } catch (error) {
    console.error('Error attempting to build Features Card:', error)
    return null
  }
}

const getFeaturesWithHotspotCard = ({
  cardConfigs,
  categoryData,
  menuData,
  pageDataCustomAttributes,
  vgImageGroups,
  coordinates = { x: '50%', y: '60%' },
}) => {
  try {
    // RTW features card configuration
    const featuresPreferenceValues = getPreferenceValues(cardConfigs, menuData, categoryData)

    const title = get(featuresPreferenceValues, cardConfigs.catHeadlineAttribute, '')

    const featuresCallout = getCustomAttribute(
      pageDataCustomAttributes,
      cardConfigs.featuresDetailAttribute
    )

    if (!title || !featuresCallout) {
      return null
    }

    const images = getImageWithConfiguredSuffix(
      vgImageGroups,
      featuresPreferenceValues,
      cardConfigs.catimageAssetAttribute
    )

    return {
      title,
      subtitle: 'Features',
      description: get(featuresPreferenceValues, cardConfigs.catBodyAttribute, ''),
      images,
      hotspots: featuresCallout
        ? [
            {
              x: coordinates.x,
              y: coordinates.y,
              icon: 'plus',
              title: featuresCallout,
            },
          ]
        : [],
      loadStrategy: null,
      styleVariant: 'tooltip',
    }
  } catch (error) {
    console.error('Error attempting to build Features with hotspot Card:', error)
    return null
  }
}

const getProductCardsData = (
  vgImageGroups: Record<string, DetailedProduct['imageGroups']>,
  menuData: MenuData,
  visualProductDetailData: string,
  pageDataCustomAttributes: Partial<CustomAttributes>,
  categoryData: Category,
  templates?: TemplatePerDevice
): ProductCardItem[] => {
  if (!visualProductDetailData) {
    return []
  }

  let visualProductDetailConfigs

  try {
    visualProductDetailConfigs = JSON.parse(visualProductDetailData)
  } catch (error) {
    console.error('Error attempting to parse visualProductDetailData:', error)
  }

  if (!visualProductDetailConfigs) {
    return []
  }

  const functionMap = {
    bagsize: getBagSizeCard,
    bagSpace: getBagSpaceCard,
    seeHowFits: getSeeHowItFitsCard,
    hardware: getHardwareCard,
    material: getMaterialCard,
    measurement: getMeasurementCard,
    features: getFeaturesCard,
    footwearMaterial: getFootwearMaterialCard,
    rtwMeasurement: getRtwMeasurementCard,
    rtwFeatures: getFeaturesWithHotspotCard,
    walletsMeasurement: getWalletsMeasurementCard,
    walletsFeatures: getFeaturesWithHotspotCard,
    miscMeasurement: getMiscMeasurementCard,
    miscFeatures: getFeaturesWithHotspotCard,
  }

  const data = {
    pageDataCustomAttributes,
    menuData,
    categoryData,
    vgImageGroups,
    templates,
  }

  const productCardsSet = []

  const cardKeys = Object.keys(visualProductDetailConfigs)

  cardKeys.forEach((cardKey) => {
    if (functionMap[cardKey]) {
      const visualDetailCard = functionMap[cardKey]?.({
        ...data,
        cardConfigs: get(visualProductDetailConfigs, cardKey, {}),
      })
      if (visualDetailCard) {
        productCardsSet.push(visualDetailCard)
      }
    }
  })

  return productCardsSet
}

export function isTemplateSupportsProductCards(templates: TemplatePerDevice) {
  return (
    templates.desktop?.includes(TemplateName.pdpv5) ||
    templates.mobile?.includes(TemplateName.pdpv6)
  )
}

export default getProductCardsData
