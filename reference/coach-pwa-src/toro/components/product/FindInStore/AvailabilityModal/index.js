import { memo, useState, useCallback, useEffect } from 'react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import useViewportType from 'toro/hooks/useViewportType'
import useTheme from 'toro/hooks/useTheme'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import ProductInfoMessage from 'toro/components/product/ProductInfoMessage'
import Divider from 'toro/components/Divider'
import AvailabilityModalProductItem from 'toro/components/product/FindInStore/AvailabilityModal/AvailabilityModalProductItem'
import AvailableStore from 'toro/components/product/FindInStore/AvailabilityModal/AvailableStore'
import SearchZipCode from 'toro/components/product/FindInStore/AvailabilityModal/SearchZipCode'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import { InfoIcon } from 'toro/icons'
import usePreference from 'toro/hooks/usePreference_new'

const AvailabilityModal = ({
  zipCode,
  handleClose,
  handleSearch,
  stores,
  defaultISPUMessaging,
  product,
  canShowMore,
  handleMoreResults,
  errorNoSearchResult,
  onPickUpInStoreClick,
  isFindInStorePickup,
  isStoreAPIError,
  setIsStoreAPIError,
  handleAnalyticsAddToCart,
  handleAnalyticsOnClick,
}) => {
  const styles = useMultiStyleConfig('AvailabilityModal')
  const [editMode, setEditMode] = useState(false)
  const { isDesktop, isMobile } = useViewportType()
  const { space } = useTheme()
  const { formatMessage } = useIntl()
  const {
    storeLocatorConfigs: { isToggleOnLimitedStoreFeature },
  } = usePreference({
    'StoreLocator Configs': ['isToggleOnLimitedStoreFeature'],
  })
  const handleZipCodeSearch = useCallback(
    (zipCode) => handleSearch(zipCode, () => setEditMode(false)),
    [setEditMode, handleSearch]
  )

  useEffect(() => {
    if (!zipCode || zipCode === 'UNDEFINED') {
      setEditMode(true)
    }
  }, [zipCode])

  const onZipCodeChange = useCallback(() => {
    setEditMode(true)
    handleAnalyticsOnClick?.({ clickedText: 'change zip code' })
  }, [handleAnalyticsOnClick])

  return (
    <Modal isOpen isCentered onClose={handleClose} blockScrollOnMount={true}>
      <ModalOverlay />
      <ModalContent
        sx={styles.modalContent(isDesktop)}
        overflowX="auto"
        position="absolute"
        my={isMobile ? '0' : ''}
      >
        <Flex justify="flex-end">
          <ModalCloseButton
            position="static"
            data-qa="bm_icon_close_x"
            sx={{
              '&:focus': {
                boxShadow: 'none',
              },
              '& svg': { width: space.m, height: space.m },
            }}
          />
        </Flex>
        <Box padding={isMobile ? '0' : '0 48px'}>
          <Text sx={styles.StoreModalTitle} data-qa="bm_txt_pkup_avlblty">
            {isToggleOnLimitedStoreFeature
              ? formatMessage({
                  id: 'pdp.product.storeAvailability',
                  defaultMessage: 'Store Availability',
                })
              : formatMessage({
                  id: 'pdp.product.pickupAvailability',
                  defaultMessage: 'Pickup Availability',
                })}
          </Text>
          {editMode ? (
            <Flex direction="column">
              <Text
                variant="body-primary"
                size="md"
                mt={space.l}
                mb={space.m}
                sx={styles.FindStoreLabel}
                data-qa="bm_txt_find_s_nearyou"
              >
                {formatMessage({
                  id: 'pdp.product.findStoreNearYou',
                  defaultMessage: 'Find a Store Near You',
                })}
              </Text>
              <SearchZipCode
                handleSearch={handleZipCodeSearch}
                initialZipCodeValue={zipCode}
                setIsStoreAPIError={setIsStoreAPIError}
              />
            </Flex>
          ) : (
            <Flex mb={space.l} mt={space.l}>
              <Text
                variant="availability-modal-zipCode"
                size="lg"
                sx={styles.ZipCodeText}
                data-qa="bm_txt_aplyd_zipcode"
              >
                {zipCode}
              </Text>
              <Button
                onClick={onZipCodeChange}
                variant="plain"
                size="md"
                ml={space.m}
                sx={styles.PlainButtonStyle}
                data-qa="bm_link_change_zipcode"
              >
                {formatMessage({
                  id: 'pdp.product.changeZipCode',
                  defaultMessage: 'Change Zip Code',
                })}
              </Button>
            </Flex>
          )}
          <Flex direction="column">
            {!!defaultISPUMessaging && (
              <Box sx={styles.productInfoMessageWrapper}>
                <ProductInfoMessage sx={styles.productInfoMessage}>
                  <Flex>
                    <Box>
                      <InfoIcon width="16" height="16" />
                    </Box>
                    <Box>
                      <Text
                        variant="body-primary"
                        size="md"
                        ml="12px"
                        sx={styles.announcementMessage}
                        data-qa="bm_txt_announcement_msg"
                      >
                        {isToggleOnLimitedStoreFeature
                          ? formatMessage({
                              id: 'pdp.product.defaultISPUMessagingIfBopisDisbaled',
                              defaultMessage: 'Available in store',
                            })
                          : defaultISPUMessaging}
                      </Text>
                    </Box>
                  </Flex>
                </ProductInfoMessage>
              </Box>
            )}
            <AvailabilityModalProductItem item={product} containerProps={{ mt: space.l }} />
            {isStoreAPIError ? (
              <>
                <Divider m="24px 0" />
                <Text variant="body-primary" color="red" size="md">
                  {formatMessage({
                    id: 'pdp.product.somethingWentWrong',
                    defaultMessage: 'Something went wrong. Please try again later',
                  })}
                </Text>
              </>
            ) : stores?.length > 0 && zipCode && zipCode !== 'UNDEFINED' ? (
              stores?.map?.((store) => (
                <AvailableStore
                  key={store.ID}
                  store={store}
                  onPickUpInStoreClick={onPickUpInStoreClick}
                  closeModal={handleClose}
                  isFindInStorePickup={isFindInStorePickup}
                  handleAnalyticsAddToCart={handleAnalyticsAddToCart}
                  handleAnalyticsOnClick={handleAnalyticsOnClick}
                  isToggleOnLimitedStoreFeature={isToggleOnLimitedStoreFeature}
                />
              ))
            ) : (
              <>
                <Divider m="24px 0" />
                {zipCode && zipCode !== 'UNDEFINED' && (
                  <Text variant="body-primary" size="md">
                    {errorNoSearchResult}
                  </Text>
                )}
              </>
            )}
          </Flex>
          {zipCode && zipCode !== 'UNDEFINED' && canShowMore && !isStoreAPIError && (
            <Button
              variant="outline"
              m="0 auto"
              mt={space.xl}
              onClick={handleMoreResults}
              sx={styles.moreResults}
              data-qa="bm_btn_moreresults"
            >
              {formatMessage({
                id: 'pdp.product.moreResults',
                defaultMessage: 'More Results',
              })}
            </Button>
          )}
        </Box>
      </ModalContent>
    </Modal>
  )
}

AvailabilityModal.propTypes = {
  zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleClose: PropTypes.func,
  handleSearch: PropTypes.func,
  stores: PropTypes.array,
  defaultISPUMessaging: PropTypes.string,
  product: PropTypes.object,
  canShowMore: PropTypes.bool,
  handleMoreResults: PropTypes.func,
  errorNoSearchResult: PropTypes.string,
  onPickUpInStoreClick: PropTypes.func,
  isFindInStorePickup: PropTypes.bool,
  isStoreAPIError: PropTypes.bool,
  setIsStoreAPIError: PropTypes.func,
  setClickedData: PropTypes.func,
  handleAnalyticsAddToCart: PropTypes.func,
}

AvailabilityModal.defaultProps = {
  stores: [],
  handleClose: () => {},
  handleSearch: () => {},
  onPickUpInStoreClick: () => {},
  handleMoreResults: () => {},
  handleAnalyticsAddToCart: () => {},
}

export default withErrorBoundaryWrapper(memo(AvailabilityModal))
