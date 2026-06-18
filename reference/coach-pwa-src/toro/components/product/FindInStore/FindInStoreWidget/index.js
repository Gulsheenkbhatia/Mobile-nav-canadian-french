import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { useIntl } from 'react-intl'
import LocationIcon from 'design-tokens/icon/navigation/location.svg'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'

const FindInStoreWidget = ({
  handleOnPickUpInStoreClick,
  location,
  handleOpenModal,
  isNeedFindStore,
  zipCode,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('FindInStoreWidgetTheme')
  const { isMobile } = useViewportType()
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const {
    storeLocatorConfigs: { isToggleOnLimitedStoreFeature },
  } = usePreference({
    'StoreLocator Configs': ['isToggleOnLimitedStoreFeature'],
  })
  return (
    <Box className="fisButtonWrapper" sx={styles.FindInStoreWrapper}>
      {isNeedFindStore && !isTabbedAdaptivePDPEligible ? (
        <>
          {location && (
            <Button
              w="100%"
              variant="secondary-inverse-background"
              size="lg"
              onClick={handleOnPickUpInStoreClick}
              sx={styles.findAStoreButton}
              data-qa="pdp_btn_pkupin_s"
            >
              {formatMessage({
                id: 'pdp.product.pickUpInStoreButton',
                defaultMessage: 'Pick up in store',
              })}
            </Button>
          )}
          <Box
            sx={isMobile && zipCode ? styles.AvailableAtWrapperMobile : styles.AvailableAtWrapper}
          >
            <Flex justify="space-between">
              <Flex>
                {location && <LocationIcon width="24" height="24" data-qa="pdp_icon_slocation" />}
                <Box as="span" sx={styles.locationName} data-qa="pdp_txt_s_avlbl_at_sname">
                  {location
                    ? formatMessage(
                        {
                          id: 'pdp.product.availableAt',
                          defaultMessage: 'Available at {location}',
                        },
                        { location }
                      )
                    : formatMessage(
                        isToggleOnLimitedStoreFeature
                          ? {
                              id: 'pdp.product.findStoreNear',
                              defaultMessage: 'Find in store near {location}',
                            }
                          : {
                              id: 'pdp.product.notAvailableNear',
                              defaultMessage: 'Not available for pickup near {location}',
                            },
                        { location: zipCode }
                      )}
                </Box>
              </Flex>
              <Flex>
                <Button
                  variant="plain"
                  size="sm"
                  sx={styles.findStoreEdit}
                  onClick={handleOpenModal}
                  data-qa="pdp_link_s_findoredit"
                >
                  {formatMessage(
                    isToggleOnLimitedStoreFeature
                      ? {
                          id: 'pdp.product.changeZipCode',
                          defaultMessage: 'Change Zip Code',
                        }
                      : {
                          id: 'pdp.product.findOrEditStore',
                          defaultMessage: 'Find/Edit Store',
                        }
                  )}
                </Button>
              </Flex>
            </Flex>
          </Box>
        </>
      ) : (
        <Button
          w="100%"
          variant="secondary-inverse-background"
          size="lg"
          onClick={handleOpenModal}
          data-qa="pdp_btn_pkupin_s"
          sx={styles.findAStoreButton}
        >
          {isToggleOnLimitedStoreFeature
            ? formatMessage({
                id: 'pdp.product.findInStoreEnterZipCode',
                defaultMessage: 'Find in Store enter zip code',
              })
            : formatMessage({
                id: 'pdp.product.findAStoreForPickUpButton',
                defaultMessage: 'FIND A STORE FOR PICKUP',
              })}
        </Button>
      )}
    </Box>
  )
}

FindInStoreWidget.propTypes = {
  handleOnPickUpInStoreClick: PropTypes.func,
  location: PropTypes.string,
  handleOpenModal: PropTypes.func,
  isNeedFindStore: PropTypes.bool,
}

FindInStoreWidget.defaultProps = {
  handleOnPickUpInStoreClick: () => {},
  handleOpenModal: () => {},
}

export default withErrorBoundaryWrapper(FindInStoreWidget)
