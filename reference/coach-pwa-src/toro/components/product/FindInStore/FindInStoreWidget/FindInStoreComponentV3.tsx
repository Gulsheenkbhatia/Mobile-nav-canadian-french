import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { useIntl } from 'react-intl'
import { StoreIcon, NavChevronRightIcon } from 'toro/icons'
import capitalize from 'lodash/capitalize'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import usePreference from 'toro/hooks/usePreference_new'

const FindInStoreComponentV3 = ({
  handleOnPickUpInStoreClick,
  location,
  handleOpenModal,
  isNeedFindStore,
  zipCode,
}) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('FindInStoreWidgetTheme')
  const { isMobile } = useViewportType()
  const {
    storeLocatorConfigs: { isToggleOnLimitedStoreFeature },
  } = usePreference({
    'StoreLocator Configs': ['isToggleOnLimitedStoreFeature'],
  })
  return (
    <Box sx={styles.FindInStoreWrapper}>
      {isNeedFindStore ? (
        <>
          {location && (
            <Button
              w="100%"
              variant="unstyled"
              size="lg"
              onClick={handleOnPickUpInStoreClick}
              data-qa="pdp_btn_pkupin_s"
              sx={styles.PickUpButton}
              className="find-a-store-pick-up-ready"
            >
              {formatMessage({ id: 'pdp.product.pickUpInStoreButton' })}
              <Box ml="auto">
                <NavChevronRightIcon height="28px" width="28px" />
              </Box>
            </Button>
          )}
          <Box
            sx={isMobile && zipCode ? styles.AvailableAtWrapperMobile : styles.AvailableAtWrapper}
          >
            <Flex justify="space-between">
              <Flex grow="1" sx={styles.availableAtContainer}>
                <StoreIcon width="16" height="16" overflow="visible" data-qa="pdp_icon_slocation" />
                <Box as="span" sx={styles.locationName} data-qa="pdp_txt_s_avlbl_at_sname">
                  {location
                    ? formatMessage(
                        {
                          id: 'pdp.product.availableAt',
                          defaultMessage: '{location}',
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
                            }
                      )}
                </Box>
              </Flex>
              <Flex>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleOpenModal}
                  data-qa="pdp_link_s_findoredit"
                  sx={styles.FindStoreButton}
                >
                  {isToggleOnLimitedStoreFeature
                    ? formatMessage({
                        id: 'pdp.product.changeZipCode',
                        defaultMessage: 'Change Zip Code',
                      })
                    : formatMessage({
                        id: 'pdp.product.findOrEditStore',
                        defaultMessage: 'Find or Edit Store',
                      })}
                </Button>
              </Flex>
            </Flex>
          </Box>
        </>
      ) : (
        <Button
          w="100%"
          variant="unstyled"
          size="lg"
          onClick={handleOpenModal}
          data-qa="pdp_btn_pkupin_s"
          sx={{ ...styles.findAStoreButton, ...styles.PickUpButton }}
        >
          {capitalize(
            isToggleOnLimitedStoreFeature
              ? formatMessage({
                  id: 'pdp.product.findInStoreEnterZipCode',
                  defaultMessage: 'Find in Store enter zip code',
                })
              : formatMessage({
                  id: 'pdp.product.findAStoreForPickUpButton',
                  defaultMessage: 'Find a store for pickup',
                })
          )}
          <Box ml="auto">
            <NavChevronRightIcon height="28px" width="28px" />
          </Box>
        </Button>
      )}
    </Box>
  )
}

FindInStoreComponentV3.propTypes = {
  handleOnPickUpInStoreClick: PropTypes.func,
  location: PropTypes.string,
  handleOpenModal: PropTypes.func,
  isNeedFindStore: PropTypes.bool,
}

FindInStoreComponentV3.defaultProps = {
  handleOnPickUpInStoreClick: () => {},
  handleOpenModal: () => {},
}

export default withErrorBoundaryWrapper(FindInStoreComponentV3)
