import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import Modal from 'toro/components/Modal'
import ModalContent from 'toro/components/ModalContent'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalHeader from 'toro/components/ModalHeader'
import ModalBody from 'toro/components/ModalBody'
import Button from 'toro/components/Button'
import HStack from 'toro/components/Hstack'
import Text from 'toro/components/Text'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import CountrySelectorDropdown from 'toro/components/LanguageSelector/ModalBasedCountrySelector/CountrySelectorDropdown'
import { CountryItem, CountrySelectorModalProps } from 'toro/components/LanguageSelector/types'
import { createAsyncStorage } from 'store/storage-utils'
import { STORAGE_IS_RETURNING_USER } from 'toro/constants/storageIds'
import useAnalytics from 'toro/analytics/useAnalytics'
import getCountryOptionsFromPriceLabel from 'toro/helpers/getCountryOptions'

const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({
  id,
  content,
  showModal,
  closeModal,
  showPopupOnLanding,
}) => {
  const countryList = content?.dropdown?.items || []
  const defaultSelectedCountry =
    countryList.find((item) => item.flag === content?.selector?.flag) || null
  const [selectedCountry, setSelectedCountry] = useState<CountryItem | null>(defaultSelectedCountry)
  const { modalContentWrapper, updateLocationButton, modalHeader, modalBody } = useMultiStyleConfig(
    'LanguageSelector',
    { variant: 'modalBased' }
  )
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()

  const setReturningUserStorage = () => {
    if (showPopupOnLanding) {
      const storage = createAsyncStorage(false)
      storage.setItem(STORAGE_IS_RETURNING_USER, true)
    }
  }

  const sendAnalyticsEvent = (action: string, extraData: Record<string, any> = {}) => {
    analytics.send('selectCountry', {
      eventAction: action,
      countryList: content?.dropdown,
      ...extraData,
    })
  }

  const handleCloseModal = () => {
    closeModal()
    setReturningUserStorage()
    setSelectedCountry(defaultSelectedCountry)
    sendAnalyticsEvent('country selector menu close')
  }

  const handleUpdateLocation = () => {
    const selectedCountryHref = selectedCountry?.languages[0]?.href
    if (defaultSelectedCountry?.flag !== selectedCountry?.flag && selectedCountryHref) {
      window.location.href = selectedCountryHref
    } else {
      setSelectedCountry(defaultSelectedCountry)
    }
    setReturningUserStorage()
    closeModal()
    const [country, currency] = getCountryOptionsFromPriceLabel(selectedCountry.label)
    const language = selectedCountry.languages[0]
    const selectedValue = { country, language: language.name, currency }

    sendAnalyticsEvent('country select', { selectedValue })
  }

  useEffect(() => {
    if (showModal) sendAnalyticsEvent('country selector menu open')
  }, [showModal])

  return (
    <Modal
      motionPreset="slideInBottom"
      id={id}
      isOpen={showModal}
      onClose={handleCloseModal}
      isCentered
      trapFocus
      closeOnEsc
      blockScrollOnMount
      closeOnOverlayClick
    >
      <ModalOverlay />
      <ModalContent sx={modalContentWrapper}>
        <ModalHeader sx={modalHeader}>
          <HStack>
            <Text as="h2" className="country-selector-modal-title">
              {showPopupOnLanding
                ? formatMessage({
                    id: 'header.languageSelector.welcomeMessage',
                    defaultMessage: 'Welcome to Coach!',
                  })
                : formatMessage({
                    id: 'header.languageSelector.shippingToDiffLocation',
                    defaultMessage: 'Shipping to a different location?',
                  })}
            </Text>
            <ModalCloseButton
              className="country-selector-modal-close-btn"
              size="lg"
              position="static"
              data-qa="country_selector_popup"
            />
          </HStack>
        </ModalHeader>
        <ModalBody sx={modalBody}>
          {showPopupOnLanding && (
            <Text className="country-selector-modal-sub-title">
              {formatMessage({
                id: 'header.languageSelector.selectCountry',
                defaultMessage: 'Select a country below to shop in your local currency.',
              })}
            </Text>
          )}
          <Text className="country-selector-modal-description">
            {showPopupOnLanding
              ? formatMessage({
                  id: 'header.languageSelector.ItemAvailability',
                  defaultMessage:
                    'Item availability, prices and delivery information will be updated in line with your new destination.',
                })
              : formatMessage({
                  id: 'header.languageSelector.shippingDescription',
                  defaultMessage:
                    'To ship your items to a different location, please select from the list below. Item availability, prices and delivery information will be updated in line with your new destination.',
                })}
          </Text>
          <Box mt={12}>
            <CountrySelectorDropdown
              countryList={countryList}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </Box>
          <Button variant="primary" sx={updateLocationButton} onClick={handleUpdateLocation}>
            {formatMessage({
              id: 'header.languageSelector.updateShippingLocation',
              defaultMessage: 'Update Shipping Location',
            })}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CountrySelectorModal
