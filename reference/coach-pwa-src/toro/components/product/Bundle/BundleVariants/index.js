import React, { useEffect, useState, useMemo } from 'react'
import BundleVariationCard from './bundleVariantCard'
import get from 'lodash/get'
import Text from 'toro/components/Text'
import useWithLoading from 'toro/hooks/useWithLoading'
import { useAtom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import getAPIURL from 'helpers/getAPIURL'
import isEmpty from 'lodash/isEmpty'

import {
  bundleVariantsProductsQtyAtom,
  bundleSelectedSizeAtom,
  bundleSelectedWidthAtom,
  bundleOrderingStatusAtom,
  selectedBundleVariantsDataAtom,
  stickyContainerStateAtom,
  bundleErrorsAtom,
} from 'store/bundle.atom'

import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import withCorrId from 'helpers/traceability'
//import { fullscreenLoadingAtom } from 'store/fullscreen-loading.atom'

const BundleVariants = ({
  productData,
  apploading,
  siteId,
  //setFullscreenLoading,
  isQuantitySelectorEnable,
  maxQuantityError,
  onOpen,
  isFlyoutOpen,
  setFlyoutOpen,
  colors,
  maxQtyRestrictionEnabled,
  maxOrderQty,
  finalSalePrefrence,
  bundleAddAllToBagClicked,
  bundleAddAllToBagError,
  isDisplayOosSwatch,
  sourceCodeGroupId,
  pdpExpecteShipdayMessageMarkup,
  isApplePayEligible,
  setAddToBagClicked,
}) => {
  const styles = useMultiStyleConfig('pdpBundlingStyles') || {}
  const { isDesktop } = useViewportType()
  const bundleProductData = get(productData, 'bundleProductData', [])
  const [, loading] = useWithLoading(false)
  const [selectedVariantQty, setSelectedVariantQty] = useAtom(bundleVariantsProductsQtyAtom)
  const [selectedBundleVariantsId, setSelectedBundleVariantsId] = useState({})
  const [selectedBundleVariantsData, setSelectedBundleVariantsData] = useAtom(
    selectedBundleVariantsDataAtom
  )
  const setBundleOrderingStatus = useUpdateAtom(bundleOrderingStatusAtom)
  const [bundleSelectedSize] = useAtom(bundleSelectedSizeAtom)
  const [bundleSelectedWidth] = useAtom(bundleSelectedWidthAtom)
  const setStickyContianerState = useUpdateAtom(stickyContainerStateAtom)
  const [bundleErrors] = useAtom(bundleErrorsAtom)
  const bundleId = productData?.id

  const getBundleSelectedVariants = (data) => {
    const { masterId, selectedVariantGroup, stickyContainerData, selectedVariant } = data || {}
    setSelectedBundleVariantsId((prevData) => ({
      ...prevData,
      [masterId]: selectedVariantGroup?.id,
    }))
    setSelectedBundleVariantsData((prevData) => ({
      ...prevData,
      [masterId]: { ...prevData[masterId], selectedVariant },
    }))
    setSelectedVariantQty((prevQytData) => ({ ...prevQytData, [masterId]: 1 }))
    stickyContainerData?.sizesLength &&
      setStickyContianerState((prevStickyData) => ({
        ...prevStickyData,
        [masterId]: stickyContainerData,
      }))
  }

  const fetchBundleInventory = async (vgId) => {
    const fetchWithCorrId = withCorrId()
    const masterIds = Object.keys(selectedBundleVariantsId)
    const masterIdOfFetchInventoryGroup = masterIds?.find((id) => vgId?.includes(id))
    const masterDataOfFetchInventoryGroup = bundleProductData?.find(
      (data) => data?.master?.ID === masterIdOfFetchInventoryGroup
    )
    try {
      const response = await fetchWithCorrId(getAPIURL(`/inventory?vgId=${vgId}`))
      const inventoryData = await response.json()
      const variantsInventory = inventoryData.inventory.variantInventoryData || []
      const variationGroupsInventoryData = inventoryData.inventory.variationGroupInventoryData || []

      const variant = masterDataOfFetchInventoryGroup?.variant?.map((vr) => {
        const inventory = variantsInventory.find((vi) => {
          return vr.id === vi.id
        })
        if (inventory) {
          return { ...vr, inventory, orderable: inventory.orderable }
        }
        return vr
      })

      const variationGroup = masterDataOfFetchInventoryGroup?.variationGroup?.map((vg) => {
        const inventory = variationGroupsInventoryData.find((vgi) => {
          return vg.id === vgi.id
        })
        if (inventory) {
          return {
            ...vg,
            inventory,
            orderable: inventory.orderable,
          }
        }
        return vg
      })
      return { masterIdOfFetchInventoryGroup, variant, variationGroup }
    } catch (error) {
      console.error(`Error fetching inventory VG(${vgId})`)
    }
  }

  const onChangeQuantity = (qty, masterId) => {
    setSelectedVariantQty({ ...selectedVariantQty, [masterId]: qty })
  }
  let dataArr = []
  async function fetchProductFromClient(VGIds) {
    try {
      dataArr = await Promise.all(
        VGIds.map(async (Vg) => {
          const data = await fetchBundleInventory(Vg)
          return { Vg, data }
        })
      )
      return {
        dataArr,
      }
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    if (!isEmpty(selectedBundleVariantsId)) {
      const VGIds = Object.values(selectedBundleVariantsId)
      const VGmasterIds = Object.keys(selectedBundleVariantsId)
      fetchProductFromClient(VGIds).then((res) => {
        res?.dataArr?.forEach((dataItem) => {
          VGmasterIds?.forEach((dataMaster) => {
            if (dataMaster === dataItem?.data?.masterIdOfFetchInventoryGroup) {
              VGIds?.forEach((VGId) => {
                if (dataItem?.Vg === VGId) {
                  dataItem?.data?.variationGroup?.forEach((dataVgItem) => {
                    if (dataVgItem?.id === VGId) {
                      dataVgItem.variant = Object.assign([], dataItem.data.variant)
                      setSelectedBundleVariantsData((prevData) => ({
                        ...prevData,
                        [dataItem?.data?.masterIdOfFetchInventoryGroup]: {
                          ...prevData[dataItem?.data?.masterIdOfFetchInventoryGroup],
                          ...dataVgItem,
                        },
                      }))
                    }
                  })
                }
              })
            }
          })
        })
      })
    }
  }, [JSON.stringify(Object.values(selectedBundleVariantsId))])

  const onSizeStateupdateorErrorUpdate = ({ masterId, stickyContainerData }) => {
    setSelectedVariantQty((prevQytData) => ({ ...prevQytData, [masterId]: 1 }))
    stickyContainerData?.sizesLength &&
      setStickyContianerState((prevStickyData) => ({
        ...prevStickyData,
        [masterId]: stickyContainerData,
      }))
  }
  useEffect(() => {
    return () => {
      setBundleOrderingStatus({})
      setStickyContianerState({})
      setSelectedBundleVariantsData({})
    }
  }, [])

  const bundleHeadlineStyles = useMemo(() => styles.bundleHeadline(isDesktop), [isDesktop])

  const handleAddedItemsNotAvailable = (quantity = 0, availableQuantity = 0) => {
    const notAddedToBagQuantity = quantity - availableQuantity
    const biggerThanOne = notAddedToBagQuantity > 1
    if (availableQuantity > 0) {
      return {
        variantItemsNotAvailableMsgFlag: true,
        variantItemsNotAvailableMsg: `${availableQuantity} item${
          availableQuantity > 1 ? 's' : ''
        } ha${
          availableQuantity > 1 ? 've' : 's'
        } been moved to your bag. ${notAddedToBagQuantity} item${biggerThanOne ? 's' : ''} ${
          biggerThanOne ? 'are' : 'is'
        } no longer available and cannot be added to your bag.`,
      }
    }
    return { variantItemsNotAvailableMsgFlag: false, variantItemsNotAvailableMsg: '' }
  }

  return (
    <>
      {productData?.isBundleProduct && (
        <Text sx={bundleHeadlineStyles} className="in-bundle-title">
          {get(productData, 'set.customAttributes.c_productBundleHeadline', 'In this Bundle')}
        </Text>
      )}
      {bundleProductData?.map((variantData) => {
        const masterID = variantData?.masterId
        const isDiscontinued = variantData?.custom?.c_isDiscontinued
        const [selectedVariantSize, variantSizeLength] = bundleSelectedSize?.[masterID] || []
        const [selectedVariantWidth, variantWidthLength] = bundleSelectedWidth?.[masterID] || []
        const variantOrderingError = bundleAddAllToBagClicked
          ? variantSizeLength && !selectedVariantSize
            ? true
            : variantWidthLength && !selectedVariantWidth
          : false
        const {
          maxQuantityError: maxQtyError = false,
          itemsNotAvailableError = false,
          payload: { quantity = 0, availableQuantity = 0 } = {},
        } = bundleErrors?.[masterID] || {}
        const variantMaxQuantityError = bundleAddAllToBagError ? maxQtyError : false
        const variantItemsNotAvailableError = bundleAddAllToBagError
          ? itemsNotAvailableError
          : false
        const { variantItemsNotAvailableMsg, variantItemsNotAvailableMsgFlag } =
          handleAddedItemsNotAvailable(quantity, availableQuantity)

        const bundleErrorsObj = {
          variantMaxQuantityError,
          variantItemsNotAvailableError,
          variantItemsNotAvailableMsg,
          variantItemsNotAvailableMsgFlag,
        }
        if (!isDiscontinued) {
          return (
            <React.Fragment key={masterID}>
              <BundleVariationCard
                variantData={variantData}
                loading={loading}
                apploading={apploading}
                siteId={siteId}
                getBundleSelectedVariants={getBundleSelectedVariants}
                selectedBundleVariantsData={selectedBundleVariantsData?.[masterID]}
                setSelectedBundleVariantsData={setSelectedBundleVariantsData}
                selectedVariantQty={selectedVariantQty?.[masterID]}
                selectedVariantQtyState={selectedVariantQty}
                onChangeQuantity={onChangeQuantity}
                isQuantitySelectorEnable={isQuantitySelectorEnable}
                maxQuantityError={maxQuantityError}
                onOpen={onOpen}
                isFlyoutOpen={isFlyoutOpen}
                setFlyoutOpen={setFlyoutOpen}
                colors={colors}
                maxQtyRestrictionEnabled={maxQtyRestrictionEnabled}
                maxOrderQty={maxOrderQty}
                finalSalePrefrence={finalSalePrefrence}
                variantOrderingError={variantOrderingError}
                onSizeStateupdateorErrorUpdate={onSizeStateupdateorErrorUpdate}
                selectedVariantSize={selectedVariantSize}
                selectedVariantWidth={selectedVariantWidth}
                isDisplayOosSwatch={isDisplayOosSwatch}
                sourceCodeGroupId={sourceCodeGroupId}
                bundleId={bundleId}
                pdpExpecteShipdayMessageMarkup={pdpExpecteShipdayMessageMarkup}
                bundleErrors={bundleErrorsObj}
                isApplePayEligible={isApplePayEligible}
                setAddToBagClicked={setAddToBagClicked}
              />
            </React.Fragment>
          )
        }
        return null
      })}
    </>
  )
}

BundleVariants.propTypes = {
  productData: PropTypes.object,
  //setFullscreenLoading: PropTypes.func,
  maxQuantityError: PropTypes.bool,
  bundleAddAllToBagClicked: PropTypes.bool,
  bundleAddAllToBagError: PropTypes.bool,
  apploading: PropTypes.bool,
  siteId: PropTypes.string,
  isQuantitySelectorEnable: PropTypes.bool,
  isFlyoutOpen: PropTypes.bool,
  setFlyoutOpen: PropTypes.func,
  colors: PropTypes.object,
  maxQtyRestrictionEnabled: PropTypes.bool,
  maxOrderQty: PropTypes.number,
  finalSalePrefrence: PropTypes.object,
  isDisplayOosSwatch: PropTypes.bool,
  sourceCodeGroupId: PropTypes.string,
  pdpExpecteShipdayMessageMarkup: PropTypes.string,
  isApplePayEligible: PropTypes.bool,
}
BundleVariants.defaultProps = {
  productData: {},
  //setFullscreenLoading: () => {},
  maxQuantityError: false,
  bundleAddAllToBagClicked: false,
  bundleAddAllToBagError: false,
  apploading: false,
  siteId: '',
  isQuantitySelectorEnable: false,
  onOpen: () => {},
  isFlyoutOpen: false,
  colors: {},
  maxQtyRestrictionEnabled: false,
  maxOrderQty: 0,
  finalSalePrefrence: {},
  isDisplayOosSwatch: false,
  sourceCodeGroupId: '',
  pdpExpecteShipdayMessageMarkup: '',
  isApplePayEligible: false,
}

export default withErrorBoundaryWrapper(BundleVariants)
