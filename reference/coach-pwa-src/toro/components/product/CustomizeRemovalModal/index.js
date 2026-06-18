import { useCallback } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import ModalBody from 'toro/components/ModalBody'
import useTheme from 'toro/hooks/useTheme'
import ModalHeader from 'toro/components/ModalHeader'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useViewportType from 'toro/hooks/useViewportType'
import useAnalytics from 'toro/analytics/useAnalytics'
import { parseProductId } from 'toro/helpers/productVariations'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import { getRecipeDataFromStorage, setItem } from 'toro/helpers/customizationStorage'

/**
 * Modal that contains product quick view
 *
 * @param  {Function} onClose close handler
 */
const CustomizeRemovalModal = ({
  items = [],
  masterId = '',
  productData = {},
  selectedColor = {},
  customizeModal = {},
  setFilterItems = () => {},
  setSelectedColor = () => {},
  setCustomizeModal = () => {},
  onClose: onCloseProp = () => {},
  setCustomizerVariants = () => {},
}) => {
  const theme = useTheme()
  const viewport = useViewportType()
  const isMobile = viewport.isMobile
  const isDesktop = viewport.isDesktop
  const isTablet = viewport.isTablet
  const { space } = theme
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()

  const customizationEvent = useCallback(
    (action, label, customizationStep) => {
      const isMonogrammed = get(selectedColor, 'isMonogrammed', false)
      analytics?.send('customization', {
        eventLocation: isMonogrammed ? 'monogram' : 'product',
        eventAction: action,
        eventLabel: label,
        customization_step: customizationStep,
        customized_recipe_id: customizeModal?.item?.id,
        customized_item_parent_id: parseProductId(selectedColor?.baseProductId)?.masterId,
        customized_item_category:
          productData?.pickedProps?.promotionData?.item_category || productData?.category_id,
        custom_color: parseProductId(selectedColor?.baseProductId)?.colorId,
        embellish_item_id: selectedColor?.baseProductId, // embellish_item_id
        embellish_type: selectedColor?.embellishment?.embellish_type, // embellish_type
        embellish_pattern: selectedColor?.embellishment?.embellish_pattern, // embellish_pattern
        monogram_placement: selectedColor?.monogram?.monogramPlacementCode,
        monogram_details: selectedColor?.monogram?.monogramInitials,
      })
    },
    [selectedColor, productData]
  )

  const onYesClick = useCallback(
    (item) => {
      setCustomizerVariants((prevItems) => prevItems.filter((data) => data.id !== item.id))
      setFilterItems((prevItems) => prevItems.filter((data) => data.id !== item.id))

      let recipesFromStorage = getRecipeDataFromStorage()
      recipesFromStorage[masterId] = (recipesFromStorage[masterId] || []).filter(
        (data) => data.id !== item.id
      )
      if (!recipesFromStorage[masterId]?.length) delete recipesFromStorage[masterId]
      setItem('customProducts', recipesFromStorage)

      let selectedItem = items.filter((data) => data.id !== item.id)
      selectedItem.length && setSelectedColor(selectedItem[0])
      setCustomizeModal({ item: undefined, value: false })
    },
    [items, masterId, setCustomizerVariants, setFilterItems, setSelectedColor]
  )

  const onClose = useCallback(() => {
    customizationEvent(
      'customization completed', //event_action
      'no, go back', // event_label
      'complete' //customization_step
    )
  }, [customizationEvent])

  const onBack = useCallback(() => {
    customizationEvent(
      'customization completed', //event_action
      'no, go back', // event_label
      'complete' //customization_step
    )
    setCustomizeModal(false)
  }, [customizationEvent, setCustomizeModal])

  const onLeave = useCallback(() => {
    customizationEvent(
      'customization cancel', //event_action
      'yes leave this site', // event_label
      'cancel' //customization_step
    )
    onYesClick(customizeModal?.item)
  }, [customizationEvent, onYesClick])

  return (
    <Modal onClose={onCloseProp} isOpen isCentered>
      <ModalOverlay />
      <ModalContent
        maxWidth="424px"
        minHeight="250px"
        m={`0 ${space.l}`}
        borderRadius="none"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader
          backgroundColor="transparent !important"
          position="sticky"
          top="calc(0%-16px)"
          boxShadow="none"
        >
          <ModalCloseButton
            top={space.m}
            right={space.l}
            sx={{
              '&:focus': {
                boxShadow: 'none',
              },
              '& svg': { width: space.m, height: space.m },
            }}
            onClick={onClose}
          />
        </ModalHeader>
        <ModalBody
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginTop={space.m}
        >
          <Box as="div" className="customization_remove--header">
            {formatMessage({
              id: 'pdp.product.removeCustomization',
              defaultMessage: 'Remove Customization',
            })}
          </Box>
          <Box as="div" className="customization_remove--body">
            {formatMessage({
              id: 'pdp.product.removeCustomizeConfirmation',
              defaultMessage: 'Are you sure you would like to remove this customization?',
            })}
          </Box>
          <Box
            as="div"
            className="customization_remove--actions"
            marginTop={space.m}
            flexDirection={isMobile && 'column'}
          >
            <Button
              className="customization_remove--no"
              variant="secondary-inverse-background"
              size="lg"
              marginRight={(isDesktop || isTablet) && space.m}
              onClick={onBack}
            >
              {formatMessage({ id: 'pdp.product.customizeGoBack', defaultMessage: 'NO GO BACK' })}
            </Button>
            <Button
              className="customization_remove--yes"
              size="lg"
              onClick={onLeave}
              marginBottom={isMobile && space.m}
              order={isMobile && '-1'}
            >
              YES
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CustomizeRemovalModal
