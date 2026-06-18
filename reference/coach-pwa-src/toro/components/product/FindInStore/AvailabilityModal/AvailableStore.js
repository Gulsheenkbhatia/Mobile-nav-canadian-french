import { useState, useContext, useMemo, useCallback } from 'react'
import useTheme from 'toro/hooks/useTheme'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import Divider from 'toro/components/Divider'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import PWAContext from 'components/common/PWAContext'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import { isJapanLocale } from 'toro/helpers/localization'
import { InfoIcon } from 'toro/icons'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { StoreInventoryMessage } from 'toro/components/product/FindInStore/StoreInventoryMessage'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'

const AvailableStore = ({
  store,
  onPickUpInStoreClick,
  closeModal,
  isFindInStorePickup,
  handleAnalyticsAddToCart,
  handleAnalyticsOnClick,
  isToggleOnLimitedStoreFeature,
}) => {
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'locale')
  const isAvailableISPUMessagingHidden = !isFindInStorePickup && isJapanLocale(locale)
  const availableISPUMessaging = get(appData, 'availableISPUMessaging', '')
  const [isStoreHoursOpen, setIsStoreHoursOpen] = useState(false)
  const { colors } = useTheme()
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('FindInStoreWidgetTheme')

  const {
    address1,
    address2,
    name,
    city,
    stateCode,
    postalCode,
    storeDistance,
    distanceUnitText,
    phone,
    storeHours,
    ID,
  } = store

  const storeAvailability = get(store, 'storeAvailability.[0]')
  const isInStock = get(storeAvailability, 'IN_STOCK', false)
  const modalCtaText = get(storeAvailability, 'modalCTA', '')
  const pickUpInStockMsg = get(storeAvailability, 'pickUpInStockMsg', availableISPUMessaging)
  const handleIsStoreHoursOpen = () => {
    handleAnalyticsOnClick({ clickedLocationId: ID, clickedText: 'View Store Hours' })
    setIsStoreHoursOpen((oldValue) => !oldValue)
  }
  const handlePickUpClick = () => {
    handleAnalyticsOnClick({ clickedLocationId: ID, clickedText: 'select store' })
    handleAnalyticsAddToCart()
    onPickUpInStoreClick(ID).then(() => {
      closeModal()
    })
  }
  const pickUpInStockMsgAvailability =
    !isToggleOnLimitedStoreFeature &&
    isInStock &&
    pickUpInStockMsg &&
    !isAvailableISPUMessagingHidden
  const {
    sfraUnifiedFeatureCartridge: { sfraEnableOverlayInStorePickup },
  } = usePreferenceNew({
    'SFRA Unified Feature Cartridge': ['sfraEnableOverlayInStorePickup'],
  })

  const onAddressClick = useCallback(() => {
    handleAnalyticsOnClick({ clickedLocationId: ID, clickedText: 'directions' })
  }, [ID, handleAnalyticsOnClick])

  const onContactsClick = useCallback(() => {
    handleAnalyticsOnClick({ clickedLocationId: ID, clickedText: 'store contact' })
  }, [ID, handleAnalyticsOnClick])

  const storeAddress = useMemo(() => {
    if (isJapanLocale(locale)) {
      return {
        address1: `${postalCode?.replace?.(/(\d{3})(\d{4})/, '$1-$2')},${stateCode} ,${city}`,
        address2,
        address3: `${address1}, ${storeDistance} ${distanceUnitText}`,
      }
    }
    return {
      address1: address1,
      address2,
      address3: `${city}, ${stateCode} ${postalCode} ${storeDistance} ${distanceUnitText}`,
    }
  }, [address1, address2, postalCode, stateCode, city, storeDistance, distanceUnitText])

  const renderCTA = () => {
    if (isInStock) {
      if (isFindInStorePickup && sfraEnableOverlayInStorePickup) {
        return (
          <Flex direction="column">
            <Button
              h="30px"
              position="relative"
              bottom="3px"
              onClick={handlePickUpClick}
              data-qa="bm_btn_s_pkup"
              data-storeid={ID}
              sx={styles.SelectBoutique}
            >
              <Text variant="availability-modal-cta" size="xs" color={colors.main.secondary}>
                {modalCtaText}
              </Text>
            </Button>
            <Template forIDs={[TemplateName.pdpv5_1, TemplateName.pdpv6]}>
              <StoreInventoryMessage
                variant="availabilityModal"
                storeAvailability={storeAvailability}
              />
            </Template>
          </Flex>
        )
      }
      return (
        <Text sx={styles.SelectBoutique} variant="body-primary" size="md">
          {formatMessage({
            id: 'pdp.product.available',
            defaultMessage: 'Available',
          })}
        </Text>
      )
    }

    return (
      <Text sx={styles.SelectBoutique} variant="body-primary" size="md">
        {modalCtaText}
      </Text>
    )
  }
  return (
    <Flex direction="column">
      <Divider m="24px 0" />
      {pickUpInStockMsgAvailability && (
        <ProductInfoMessage sx={styles.productInfoMessage}>
          <Flex>
            <Box>
              <InfoIcon width="16" height="16" />
            </Box>
            <Box>
              <Text ml="12px" size="md" variant="body-primary" sx={styles.PickUpInStockMsg}>
                {pickUpInStockMsg}
              </Text>
            </Box>
          </Flex>
        </ProductInfoMessage>
      )}
      <Flex direction="column">
        <Flex justify="space-between" sx={styles.storeNameWrapper}>
          <Text
            data-qa="sb_txt_hdng_s_detail"
            variant="availability-modal-store"
            size="lg"
            sx={styles.StoreName}
          >
            {name}
          </Text>
          {renderCTA()}
        </Flex>
        <Text
          data-qa="bm_link_s_add_line1"
          variant="body-primary"
          size="md"
          sx={styles.StoreAddress}
          onClick={onAddressClick}
        >
          {storeAddress.address1}
        </Text>
        {storeAddress.address2 && (
          <Text
            data-qa="bm_link_s_add_line2"
            variant="body-primary"
            size="md"
            sx={styles.StoreAddress}
            onClick={onAddressClick}
          >
            {storeAddress.address2}
          </Text>
        )}
        <Text
          variant="body-primary"
          size="md"
          sx={styles.StoreAddress}
          data-qa="bm_link_s_miles"
          onClick={onAddressClick}
        >
          {storeAddress.address3}
        </Text>
        <Text
          variant="body-primary"
          size="md"
          decoration="underline"
          href={`tel:${phone}`}
          as="a"
          sx={styles.StoreAddress}
          data-qa="bm_link_s_phn_num"
          onClick={onContactsClick}
        >
          {phone}
        </Text>
        <Box>
          <Button
            variant="plain"
            size="md"
            mt="16px"
            sx={styles.ViewBuisnessHour}
            onClick={handleIsStoreHoursOpen}
            data-qa="bm_txt_s_vsh_acord"
          >
            {formatMessage({
              id: 'pdp.product.viewStoreHour',
              defaultMessage: 'View Store Hours',
            })}{' '}
          </Button>
        </Box>
        {isStoreHoursOpen && <HtmlContent content={storeHours} mt="13px" sx={styles.StoreHours} />}
      </Flex>
    </Flex>
  )
}
AvailableStore.propTypes = {
  store: PropTypes.object,
  onPickUpInStoreClick: PropTypes.func,
  closeModal: PropTypes.func,
  isFindInStorePickup: PropTypes.bool,
  handleAnalyticsOnClick: PropTypes.func,
  handleAnalyticsAddToCart: PropTypes.func,
}

AvailableStore.defaultProps = {
  onPickUpInStoreClick: () => {},
  handleAnalyticsOnClick: () => {},
  handleAnalyticsAddToCart: () => {},
  closeModal: () => {},
}

export default AvailableStore
