import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import getDemandwareUrl from 'helpers/getDemandwareUrl'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState, useContext } from 'react'
import { setRecipeDataInStorage, getRecipeDataFromStorage } from 'toro/helpers/customizationStorage'
import { useRouter } from 'next/router'
import PWAContext from 'components/common/PWAContext'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { API_CUSTOMIZER_PRODUCT_STATUS } from 'toro/constants/Urls'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useAtom } from 'jotai'
import {
  carouselKeyStateAtom,
  customizerDataAtom,
  customizerVariantsAtom,
  selectedColorAtom,
} from 'store/pdp.atom'
import { useUpdateAtom, RESET } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import fetch from 'helpers/fetch'
import dynamic from 'next/dynamic'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const CustomizeAndMonogramV6 = dynamic(
  () => import('toro/components/product/mobile/CustomizeAndMonogram/CustomizeAndMonogramV6'),
  {
    ssr: false,
  }
)

const EnjectCustomizationScript = ({
  skuId,
  variationGroupData = undefined,
  productData,
  setCustomizerVariants = undefined,
  customizerVariants = undefined,
  selectedVariant,
  selectedColor = undefined,
  setSelectedColor = undefined,
  isCustomize,
  isMonogram,
  isQuickView,
  redirectUrl = undefined,
  masterId,
  customizerPrefernce = { CustomizerApiKey: undefined, CustomizerAddonHangtags: undefined },
  isCustomizerPrefernceEnabled,
  recipes = undefined,
  setRecipes = undefined,
  productCustomState,
  setProductCustomState = undefined,
  customizerData,
  defaultVariantProductID,
  colors = undefined,
  type = 'links',
}) => {
  const { CustomizerApiKey, CustomizerAddonHangtags } = customizerPrefernce || {}
  const router = useRouter()
  const [customizerDataParent, setCustomizerDataParent] = useAtom(customizerDataAtom)
  const { appData } = useContext(PWAContext)
  const scriptUrl = get(appData, 'customizerScriptUrl', '')
  const [recipeId, setRecipeId] = useState('')
  const [recipeFetched, setRecipeFetched] = useState(false)
  const { isMobile } = useViewportType()
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2) && isMobile
  const customizationStyle = useMultiStyleConfig('CustomizationTheme', {
    variant: isPdpV42Enabled ? 'pdpv42' : undefined,
  })
  const analytics = useAnalytics()
  const setCarouselKeyState = useUpdateAtom(carouselKeyStateAtom)
  const setCustomizerVariantsAtom = useUpdateAtom(customizerVariantsAtom)
  const setSelectedColorAtom = useUpdateAtom(selectedColorAtom)
  const { formatMessage } = useIntl()
  const customizationEvent = (obj) => {
    analytics.send('customization', obj)
  }

  const customizeEvent = (action, label) => {
    analytics.send('customizeInteraction', {
      eventLocation: isQuickView ? 'PLP' : 'product',
      eventAction: action,
      eventLabel: label,
    })
  }

  const isCustomizeOrMonogramParent =
    customizerDataParent?.canMonogramParent || customizerDataParent?.canCustomizeParent

  const isCustomizable = customizerDataParent?.canMonogram || customizerDataParent?.canCustomize
  const canMonogram =
    productCustomState[
      (selectedVariant?.productId || selectedVariant?.id) ?? selectedColor?.baseProductId
    ]?.canMonogram
  const canCustomize =
    productCustomState[
      (selectedVariant?.productId || selectedVariant?.id) ?? selectedColor?.baseProductId
    ]?.canCustomize

  const customizerRecipeDataEndpoint = getDemandwareUrl(`Customizer-RecipeData`)
  const customizerProductDataUrl = getDemandwareUrl(`Customizer-ProductData`)
  const customizerFormatPriceUrl = getDemandwareUrl(`Customizer-FormatPrice`)
  const customizerProductStatusEndpoint = API_CUSTOMIZER_PRODUCT_STATUS

  const getColorsForCurrentProduct = (colorsArray) => {
    if (!masterId || !colorsArray?.length) return colorsArray
    const filtered = colorsArray.filter((c) => c.masterId === masterId)
    return filtered.length ? filtered : colorsArray
  }

  function extractCustomizeViews(views = []) {
    const productViewData = views.find?.((view) => view?.code === 'Product')
    const monogramHangtagViewData = views.find?.((view) => view?.code === 'MonogramHangtag')
    const monogramViewData = views.find?.((view) => view?.code === 'Monogram')

    return {
      productViewData,
      monogramViewData,
      monogramHangtagViewData,
    }
  }

  /**
   * Constructs customizerVariants
   * @param {Object[]} swatchesArray
   * @param {Object} recipeData
   * @param {boolean} initialLoad
   * @param {string} selectedId
   * @param {Object} result
   * @param {boolean} isCustomizeAnother
   */
  const getConstructedData = (
    swatchesArray = [],
    recipeData,
    initialLoad = false,
    selectedId,
    result,
    isCustomizeAnother = false
  ) => {
    const extractColorCode = (productId) => productId?.split?.(' ').filter((val) => val)?.[1]
    if (recipeData) {
      swatchesArray.forEach?.((data, index) => {
        const selectedSwatch =
          isCustomize || isMonogram
            ? selectedId === data?.id
            : !initialLoad && !isCustomizeAnother
            ? extractColorCode(selectedVariant?.productId || selectedVariant?.id) === data?.id
            : extractColorCode(recipeData?.productId) === data?.id ||
              extractColorCode(result?.monogram?.sku) === data?.id ||
              data?.id === recipeData?.productId?.split?.(' ')[1] ||
              data?.id === result?.monogram?.sku?.split?.(' ')[1]
        if (selectedSwatch) {
          setCustomizerVariants((current) => {
            const curr = cloneDeep(current)
            const constructedData =
              !isCustomizeAnother && (isCustomize || isMonogram) ? curr[index] : cloneDeep(data)
            // if isCustomize, then update the data itself rather than creating a new copy

            const { productViewData, monogramViewData, monogramHangtagViewData } =
              extractCustomizeViews(recipeData?.recipe?.views)

            if (productViewData || result?.monogram?.monogramPlacementCode === 'Exterior Front') {
              const variantFound = cloneDeep(
                getColorsForCurrentProduct(productData?.colors)?.find?.((val) =>
                  result?.productId?.includes?.(val?.id)
                )
              )

              if (variantFound) {
                constructedData.media = variantFound.media
                constructedData.image = variantFound.image
              }
              constructedData.media.thumbnail.src =
                productViewData?.previewJpg || monogramViewData?.previewJpg || ''
              constructedData.media.full[0].src =
                productViewData?.previewPng || monogramViewData?.previewPng || ''
              constructedData.image.src =
                productViewData?.previewJpg || monogramViewData?.previewJpg || ''
            }
            constructedData.text = recipeData?.color ?? constructedData?.text
            constructedData.id = recipeData?.recipe?.id
            constructedData.location = result?.recipe?.location
            constructedData.baseProductId =
              recipeData?.productId || result?.productId || result?.monogram?.sku
            constructedData.baseProductColor =
              get(recipeData, 'products', [])?.[0]?.product?.color ||
              selectedColor?.baseProductColor ||
              selectedColor?.id ||
              ''
            constructedData.isCustomized =
              productViewData && !!recipeData?.recipe?.custom['template-name']
            constructedData.price = recipeData?.price
            constructedData.standardPrice = recipeData?.standardPrice
            constructedData.embellishment = {
              embellish_type:
                recipeData?.recipe?.custom?.['template-track-as']?.toLowerCase() ??
                'no embellish type',
              embellish_pattern:
                recipeData?.recipe?.custom?.['template-name'] ?? 'no embellish pattern',
            }
            constructedData.isMonogrammed = !!result?.monogram
            constructedData.monogram = result?.monogram
            constructedData.monogramPreviewUrl =
              monogramHangtagViewData?.previewPng || monogramViewData?.previewPng || ''
            if (!(isCustomize || isMonogram) || isCustomizeAnother) curr.unshift(constructedData) // if isCustomize, then no addition to the customizerVariants array

            return curr
          })
        }
      })
    }
  }

  const setRecipeToSwatch = (
    recipeData,
    result,
    initialLoad,
    selectedId,
    isCustomizeAnother = false
  ) => {
    getConstructedData(
      //if isCustomize => swatchesArray = customizerVariants
      isCustomize || isMonogram
        ? customizerVariants?.length
          ? customizerVariants
          : getColorsForCurrentProduct(productData?.colors)
        : variationGroupData
        ? variationGroupData?.colors || getColorsForCurrentProduct(colors)
        : getColorsForCurrentProduct(productData?.colors),
      recipeData,
      initialLoad,
      selectedId,
      result,
      isCustomizeAnother
    )
  }

  const onDone = async (result, isCustomizeAnother) => {
    setCarouselKeyState((prev) => prev + 1)
    if (customizerVariants && customizerVariants.length < 10) {
      if (isQuickView) {
        setRecipeDataInStorage(result, selectedVariant?.productId || selectedVariant?.id, masterId)
        router.push(redirectUrl).then(() => {
          if (typeof window !== 'undefined' && window.$ !== undefined) {
            window.$('html, body').animate({ scrollTop: '0' }, 3000)
          }
        })
        return null
      }
      let recipeData
      try {
        const res = await fetch(
          `${customizerRecipeDataEndpoint}?product=${masterId}&recipe=${result.recipe.id}`
        )
        recipeData = await res.json()
      } catch (error) {
        console.error('Failed to parse recipeData response:', error)
        recipeData = null
      }

      setRecipeDataInStorage(
        result,
        recipeData?.productId,
        masterId,
        !isCustomizeAnother && (isCustomize || isMonogram),
        selectedColor?.id
      )

      setRecipes((prevData) => [
        ...prevData,
        {
          ...recipeData,
          location: result?.recipe?.location,
          monogram: result?.monogram,
        },
      ])

      customizationEvent({
        eventLocation: isQuickView ? 'PLP' : 'product',
        eventAction: 'customization completed', //event_action
        eventLabel: 'customization complete', // event_label
        customization_step: 'complete', //customization_step
        customized_recipe_id: result?.recipe?.id, // customized_recipe_id
        customized_item_parent_id: productData?.masterId, // customized_item_parent_id
        customized_item_category:
          productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
        custom_color: selectedColor?.id, //custom_color
        embellish_item_id: selectedVariant?.productId || selectedVariant?.id, // embellish_item_id
        embellish_type: recipeData?.recipe?.custom?.['flow-type'] ?? 'no embellish type', // embellish_type
        embellish_pattern: recipeData?.recipe?.custom?.['template-name'] ?? 'no embellish pattern', // embellish_pattern
        monogram_placement: result?.monogram?.monogramPlacementCode ?? 'no monogram placement', // monogram_placement
        monogram_details: result?.monogram?.monogramInitials ?? 'no monogram', // monogram_details
      })
      setRecipeToSwatch(recipeData, result, false, selectedColor?.id, isCustomizeAnother)
      setRecipeId(recipeData?.recipe?.id)
      if (type === 'widget') {
        setTimeout(() => {
          window.scrollTo(0, 0)
        }, 200)
      }
    }
  }

  const CustomizerWidgetClickHandler = (isCustomizeAnother) => {
    let initial = null
    let products = skuId || selectedVariant?.productId || selectedVariant?.id
    if ((isCustomize || isMonogram) && !isCustomizeAnother) {
      recipes?.forEach?.((data) => {
        if (data?.recipe?.id === selectedColor?.id) {
          initial = {
            type: 'custom',
            recipeData: data?.recipe,
            id: data?.recipe?.id,
            productId: data?.productId,
            saved: true,
            recipe: {
              id: data?.recipe?.id,
              location: data?.location,
            },
            monogram: data?.monogram,
          }

          products = products || data?.productId || data?.monogram?.sku
        }
      })
    }

    if (isCustomizeAnother) {
      recipes?.forEach?.((data) => {
        if (data?.recipe?.id === selectedColor?.id) {
          products = products || data?.productId || selectedColor?.baseProductId
        }
      })
    }

    const isEditableMonogrammedProduct =
      !selectedColor?.isCustomized && selectedColor?.isMonogrammed && !isCustomizeAnother

    const config = {
      apiKey: CustomizerApiKey,
      site: 'online-na,US9999',
      disallowCustomize: isEditableMonogrammedProduct ? true : !canCustomize,
      disallowMonogram: isEditableMonogrammedProduct ? false : !canMonogram,
      useAddonTags: CustomizerAddonHangtags?.default,
      productDataEndpoint: customizerProductDataUrl,
      formatPriceEndpoint: customizerFormatPriceUrl,
      locale: 'en-US',
      currency: 'USD',
      products: products,
      onCancel: () => {
        customizationEvent({
          eventLocation: isQuickView ? 'PLP' : 'product',
          eventAction: 'customization cancel', //event_action
          eventLabel: 'yes leave this site', // event_label
          customization_step: 'cancel', //customization_step
          customized_recipe_id: selectedColor?.id, // customized_recipe_id
          customized_item_parent_id: productData?.masterId, // customized_item_parent_id
          custom_color: selectedColor?.id,
          customized_item_category:
            productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
          embellish_type: 'no embellish type', // embellish_type
          embellish_pattern: 'no embellish pattern', // embellish_pattern
          monogram_placement: selectedColor?.monogram?.monogramPlacementCode, // monogram_placement
          monogram_details: selectedColor?.monogram?.monogramInitials, // monogram_details
        })
        setCarouselKeyState((prev) => prev + 1)
      },
      onDone: (result) => onDone(result, isCustomizeAnother),
      initial,
    }

    if (window.CustomizerWidget) {
      window.CustomizerWidget.default.createWidget(config)
      customizeEvent('customization', 'customization start')
    }
  }

  const fetchRecipesByID = async (masterId) => {
    const customProducts = getRecipeDataFromStorage('customProducts')

    if (Object.keys(customProducts).length !== 0) {
      const customizationsForCurrMaster = customProducts[masterId]

      if (customizationsForCurrMaster) {
        const recipeDataArr = customizationsForCurrMaster.map?.((data) => data?.result?.recipe)

        const fetchRecipePromises = recipeDataArr.map?.(async (recipe) => {
          try {
            const res = await fetch(
              `${customizerRecipeDataEndpoint}?product=${masterId}&recipe=${recipe.id}`
            )
            return await res.json()
          } catch (error) {
            console.error('Failed to parse recipeData response:', error)
            return null
          }
        })

        const fetchRecipePromisesResponse = await Promise.all(fetchRecipePromises)

        setRecipes(
          fetchRecipePromisesResponse.map?.((recipeData, index) => ({
            ...recipeData,
            location: customizationsForCurrMaster[index]?.result?.recipe?.location,
            monogram: customizationsForCurrMaster[index]?.result?.monogram,
          }))
        )

        fetchRecipePromisesResponse.forEach((recipeData, index) => {
          setRecipeToSwatch(recipeData, customizationsForCurrMaster[index]?.result, true)
        })

        setRecipeFetched(true)
      }
    }
  }

  function changeExtension(filename, extension) {
    return filename?.substr?.(0, filename?.lastIndexOf('.') + 1) + extension
  }

  const fetchRecipesByParams = async (masterId, recipeID) => {
    const settedRecipes = localStorage.getItem('settedRecipes')
    let parsedSettedRecipes = {}
    let monogramResponse
    if (settedRecipes) {
      try {
        parsedSettedRecipes = JSON.parse(settedRecipes)
      } catch (e) {
        console.error(e.message)
      }
    }

    if (!recipeID || parsedSettedRecipes[recipeID]) {
      fetchRecipesByID(masterId)
      return null
    }
    let recipeResponse
    try {
      const res = await fetch(
        `${customizerRecipeDataEndpoint}?product=${masterId}&recipe=${recipeID}`
      )
      recipeResponse = await res.json()
    } catch (error) {
      console.error('Failed to parse recipeResponse response:', error)
      recipeResponse = null
    }

    try {
      monogramResponse = JSON.parse(recipeResponse?.recipe?.custom?.monogram)
    } catch (error) {
      console.error(error.message)
    }

    const recipeDataObject = {
      type: 'custom',
      recipe: {
        id: recipeID,
        location: changeExtension(recipeResponse?.recipe?.humanReadable, 'json'),
      },
      recipeData: null,
      monogram: monogramResponse,
      saved: true,
      id: recipeID,
      sku: recipeResponse?.productId,
      productId: recipeResponse?.productId,
    }

    setRecipeDataInStorage(recipeDataObject, recipeResponse?.productId, masterId)
    fetchRecipesByID(masterId)
    localStorage.setItem(
      'settedRecipes',
      JSON.stringify({
        ...parsedSettedRecipes,
        [recipeID]: true,
      })
    )
  }

  const onCustomizerClickHandler = (isCustomizeAnother) => {
    customizationEvent({
      eventLocation: isQuickView ? 'PLP' : 'product',
      eventAction: 'customization start', //event_action
      eventLabel: 'customization start', // event_label
      customization_step: 'start', //customization_step
      customized_recipe_id: selectedColor?.id, // customized_recipe_id
      customized_item_category:
        productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
      customized_item_parent_id: productData?.masterId, // customized_item_parent_id
      custom_color: selectedColor?.id, // custom_color
      // embellish_item_id: selectedVariant?.productId, // embellish_item_id
      embellish_type: selectedColor?.embellishment?.embellish_type, // embellish_type
      embellish_pattern: selectedColor?.embellishment?.embellish_pattern, // embellish_pattern
      monogram_placement: selectedColor?.monogram?.monogramPlacementCode, // monogram_placement
      monogram_details: selectedColor?.monogram?.monogramInitials, // monogram_details
    })
    if (scriptUrl && (canCustomize || canMonogram)) {
      if (!window.CustomizerWidget) {
        let script = document.createElement('script')
        script.defer = 1
        script.onload = () => {
          CustomizerWidgetClickHandler(isCustomizeAnother)
        }
        script.src = scriptUrl
        document.head.appendChild(script)
      } else {
        CustomizerWidgetClickHandler(isCustomizeAnother)
      }
    }
  }

  useEffect(() => {
    setCustomizerVariantsAtom(customizerVariants ?? [])
    if (!customizerVariants?.length) {
      setSelectedColorAtom(RESET)
    }
  }, [customizerVariants])

  useEffect(() => {
    if (customizerData && Object.keys(customizerData)?.length) {
      setCustomizerDataParent(customizerData)
    }
  }, [customizerData])

  useEffect(() => {
    if (
      !isQuickView &&
      !customizerVariants?.length &&
      (selectedVariant?.productId || selectedVariant?.id)
    ) {
      fetchRecipesByParams(masterId, router?.query?.recipe)
    }
  }, [selectedVariant?.productId, selectedVariant?.id])

  useEffect(() => {
    recipeFetched && customizerVariants?.[0]?.orderable && setSelectedColor(customizerVariants?.[0])
  }, [recipeFetched])

  const fetchProductStatus = async (productVariantId) => {
    if (String(productVariantId).includes('-')) {
      return
    }
    const response = await fetch(`${customizerProductStatusEndpoint}?product=${productVariantId}`, {
      importance: 'low',
    })
    if (response?.ok) {
      const data = await response.json()
      if (data && !data.error) {
        setProductCustomState({
          ...productCustomState,
          [productVariantId]: {
            canMonogram: data?.canMonogram,
            canCustomize: data?.canCustomize,
          },
        })
        if (!Object.keys(productCustomState || {}).length && data) {
          setCustomizerDataParent({
            canMonogram: data.canMonogram,
            canCustomize: data.canCustomize,
            canMonogramParent: data.canMonogramParent,
            canCustomizeParent: data.canCustomizeParent,
          })
        }
      }
    }
  }

  const resetCustomData = () => {
    setCustomizerVariants([])
    setRecipes([])
    setRecipeId('')
  }

  useEffect(() => {
    if ((selectedVariant?.productId || selectedVariant?.id) && isCustomizerPrefernceEnabled) {
      if (!productCustomState?.[selectedVariant?.productId || selectedVariant?.id]) {
        fetchProductStatus(selectedVariant?.productId || selectedVariant?.id)
      } else if (!productCustomState?.[defaultVariantProductID]) {
        fetchProductStatus(defaultVariantProductID)
      } else if (
        (selectedVariant?.productId || selectedVariant?.id)?.split?.(' ')[0] !== masterId
      ) {
        resetCustomData()
      }
    }
  }, [selectedVariant?.productId, selectedVariant?.id, masterId])

  useEffect(() => {
    if (!customizerVariants?.length || !isCustomizeOrMonogramParent) return
    const cid = findCustomizerVariantsIndex(recipeId)

    recipeId && cid !== -1 && setSelectedColor(customizerVariants?.[cid])
  }, [JSON.stringify(customizerVariants), recipeId])

  const getCTALabel = ({ analytics = false } = {}) => {
    if (!(isCustomize || isMonogram)) {
      if (canCustomize) {
        if (analytics) {
          customizeEvent('customization', 'add a customization')
          return
        }
        return formatMessage({
          id: 'pdp.product.customizeIt',
          defaultMessage: type === 'widget' ? 'Customize It!' : 'Customize It',
        })
      } else if (canMonogram) {
        if (analytics) {
          customizeEvent('monogram', 'add a free monogram')
          return
        }
        return formatMessage({
          id: 'pdp.product.addAFreeMonogram',
          defaultMessage: 'Add a Free Monogram',
        })
      }
    } else {
      if (isCustomize) {
        if (analytics) {
          customizeEvent(
            'customization',
            `edit customization:${
              skuId || selectedVariant?.productId || selectedVariant?.id || selectedColor?.id
            }`
          )
          return
        }
        return formatMessage({ id: 'pdp.product.editThisItem', defaultMessage: 'Edit This Item' })
      } else if (isMonogram) {
        if (analytics) {
          customizeEvent(
            'monogram',
            `edit item:${
              skuId || selectedVariant?.productId || selectedVariant?.id || selectedColor?.id
            }`
          )
          // customization
          customizationEvent({
            eventLocation: isQuickView ? 'PLP' : 'product',
            eventAction: 'customization in progress', //event_action
            eventLabel: 'edit', // event_label
            customization_step: 'edit-monogram', //customization_step
            customized_recipe_id: selectedColor?.id, // customized_recipe_id
            customized_item_category:
              productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
            customized_item_parent_id: productData?.masterId, // customized_item_parent_id
            custom_color: selectedColor?.id, // custom_color
            embellish_item_id: selectedVariant?.productId || selectedVariant?.id, // embellish_item_id
            embellish_type: selectedColor?.embellishment?.embellish_type, // embellish_type
            embellish_pattern: selectedColor?.embellishment?.embellish_pattern, // embellish_pattern
            monogram_placement: selectedColor?.monogram?.monogramPlacementCode, // monogram_placement
            monogram_details: selectedColor?.monogram?.monogramInitials, // monogram_details
          })
          return
        }
        return formatMessage({ id: 'pdp.product.editMonogram', defaultMessage: 'Edit Monogram' })
      }
    }
  }

  function findCustomizerVariantsIndex(id) {
    return customizerVariants?.findIndex((value) => value?.id === id)
  }

  if (
    !isCustomizeOrMonogramParent ||
    (!isCustomize && !isMonogram && !canCustomize && !canMonogram)
  ) {
    return null
  }

  const onClickCustomizeIt = () => {
    onCustomizerClickHandler(false)
    getCTALabel({ analytics: true })
  }

  const handleCustomizeAnotherClick = () => {
    onCustomizerClickHandler(true)
    customizeEvent('customization', 'customize another')
  }

  const customizeLabel = getCTALabel()
  const customizeAnotherLabel = formatMessage({
    id: 'pdp.product.customizeAnother',
    defaultMessage: 'Customize Another',
  })

  if (type === 'widget') {
    return <CustomizeAndMonogramV6 onClick={onClickCustomizeIt} />
  }

  return (
    <>
      {(isCustomizable || isCustomizeOrMonogramParent) && (
        <Flex sx={customizationStyle}>
          <Box as="div" className="customization_cta" marginRight="20px" mb="23px">
            <Box
              as="button"
              onClick={onClickCustomizeIt}
              className={`customization_link ${
                !(isCustomize || isMonogram) && (canCustomize || canMonogram) && !isPdpV42Enabled
                  ? 'customization_link--dot'
                  : ''
              }${isCustomize || isMonogram ? 'customization_link--edit' : ''}`}
              data-qa="customization-cta"
            >
              {customizeLabel}
            </Box>
          </Box>
          {(isCustomize || isMonogram) && canCustomize && (
            <Box as="div" className="customization_cta" marginRight="20px" mb="23px">
              <Box
                as="button"
                onClick={handleCustomizeAnotherClick}
                className={'customization_link  customization_link--another'}
              >
                {customizeAnotherLabel}
              </Box>
            </Box>
          )}
        </Flex>
      )}
    </>
  )
}

EnjectCustomizationScript.propTypes = {
  skuId: PropTypes.string,
  variationGroupData: PropTypes.object,
  productData: PropTypes.object,
  setCustomizerVariants: PropTypes.func,
  customizerVariants: PropTypes.array,
  selectedVariant: PropTypes.object,
  selectedColor: PropTypes.object,
  setSelectedColor: PropTypes.func,
  isCustomize: PropTypes.bool,
  isMonogram: PropTypes.bool,
  isQuickView: PropTypes.bool,
  redirectUrl: PropTypes.string,
  masterId: PropTypes.string,
  isCustomizerPrefernceEnabled: PropTypes.bool,
  recipes: PropTypes.array,
  setRecipes: PropTypes.func,
  productCustomState: PropTypes.object,
  setProductCustomState: PropTypes.func,
  customizerData: PropTypes.object,
  defaultVariantProductID: PropTypes.string,
  type: PropTypes.oneOf(['links', 'widget']),
}

EnjectCustomizationScript.defaultProps = {
  skuId: '',
  productData: {},
  selectedVariant: {},
  isCustomize: false,
  isMonogram: false,
  isQuickView: false,
  masterId: '',
  isCustomizerPrefernceEnabled: false,
  setCustomizerVariants: () => {},
  setSelectedColor: () => {},
  setRecipes: () => {},
  setProductCustomState: () => {},
  type: 'links',
}

export default withErrorBoundaryWrapper(EnjectCustomizationScript)
