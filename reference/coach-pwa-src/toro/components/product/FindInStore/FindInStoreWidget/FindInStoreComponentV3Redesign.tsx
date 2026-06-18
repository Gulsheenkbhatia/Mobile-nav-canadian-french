import { useIntl } from 'react-intl'
import get from 'lodash/get'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import capitalize from 'lodash/capitalize'
import Button from 'toro/components/Button'
import {
  NavChevronRightIcon,
  BopisLocation as LocationIcon,
  AddToBagPlus as AddToBagIcon,
  BopisStoreIcon,
  BopisArrowRightIcon,
  NavChevronRightBoldIcon,
} from 'toro/icons'
import BopisLocationFilledIcon from 'toro/icons/bopis-location-filled.svg'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import usePreference from 'toro/hooks/usePreference_new'
import { StoreInventoryMessage } from 'toro/components/product/FindInStore/StoreInventoryMessage'
import Template from 'toro/components/Template'

type Props = {
  handleOnPickUpInStoreClick?: () => void
  location: string
  handleOpenModal?: () => void
  isNeedFindStore: boolean
  zipCode: string
  closestStore?: any
}

const FindInStoreComponentV3Redesign = ({
  handleOnPickUpInStoreClick,
  location,
  handleOpenModal,
  isNeedFindStore,
  zipCode,
  closestStore,
}: Props) => {
  const { formatMessage } = useIntl()
  const isPDPv41ExperienceEnabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPDPv42ExperienceEnabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isPDPv41Enabled = isPDPv41ExperienceEnabled && isTabbedAdaptivePDPEligible
  const isPDPv42Enabled = isPDPv42ExperienceEnabled && isTabbedAdaptivePDPEligible
  const isPDPv6 = useTemplate([TemplateName.pdpv6])
  const isPDPv5_1 = useTemplate([TemplateName.pdpv5_1])
  const {
    storeLocatorConfigs: { isToggleOnLimitedStoreFeature, hideSubtitleFindInStore = false },
  } = usePreference({
    'StoreLocator Configs': ['isToggleOnLimitedStoreFeature', 'hideSubtitleFindInStore'],
  })

  const storeAvailability = get(closestStore, 'storeAvailability.[0]')

  const getVariant = () => {
    if (isPDPv6 || isPDPv5_1) {
      return null
    }
    return isPDPv41Enabled || isPDPv42Enabled ? 'bopisV4Enhanced' : 'bopisV3Redesign'
  }
  const variant = getVariant()

  const styles = useMultiStyleConfig('FindInStoreWidgetTheme', {
    variant,
  })

  const renderStoreIcon = () => {
    if (isPDPv6) {
      return <BopisStoreIcon width="24px" height="24px" />
    }
    if (isPDPv5_1) {
      return <BopisLocationFilledIcon width="9px" height="14px" />
    }
    return <LocationIcon width="30px" height="30px" />
  }

  const renderArrowIcon = () => {
    if (isPDPv6) {
      return (
        <Flex sx={styles.pickUpSearchStoreButton}>
          {formatMessage({
            id: 'pdp.product.pickupButton',
            defaultMessage: 'Pickup',
          })}
          <BopisArrowRightIcon height="14px" width="14px" />
        </Flex>
      )
    }
    if (isPDPv5_1) {
      return (
        <Box m="auto" mr="unset">
          <NavChevronRightBoldIcon height="16px" width="16px" />
        </Box>
      )
    }
    return (
      <Box m="auto" mr="unset">
        <NavChevronRightIcon height="28px" width="28px" />
      </Box>
    )
  }

  const renderBagIcon = () => {
    if (isPDPv6) {
      return (
        <Flex sx={styles.pickUpSearchStoreButton} onClick={handleOnPickUpInStoreClick}>
          {formatMessage({
            id: 'pdp.product.pickupButton',
            defaultMessage: 'Pickup',
          })}
          <BopisArrowRightIcon height="14px" width="14px" />
        </Flex>
      )
    }
    if (isPDPv5_1) {
      return (
        <Button
          variant="icon-only"
          onClick={handleOnPickUpInStoreClick}
          data-qa="pdp_btn_pkupin_s"
          className="find-a-store-pick-up-ready"
          sx={styles.addToBagBtn}
        >
          <AddToBagIcon width="17px" height="20px" />
        </Button>
      )
    }
    return (
      <Button
        variant="icon-only"
        onClick={handleOnPickUpInStoreClick}
        data-qa="pdp_btn_pkupin_s"
        className="find-a-store-pick-up-ready"
        minWidth="20px"
        m="auto"
        mr="12.5px"
      >
        <AddToBagIcon width="20px" height="23px" />
      </Button>
    )
  }

  const pickUpSearchStore = (
    <Button
      w="100%"
      sx={{ height: 'auto' }}
      variant="unstyled"
      size="lg"
      onClick={handleOpenModal}
      data-qa="pdp_btn_pkupin_s"
    >
      <Flex flexDirection="row" sx={styles.pickUpSearchStoreWrapper}>
        <Box m="auto 0" sx={styles.pickUpSearchStoreIcon}>
          {renderStoreIcon()}
        </Box>
        <Flex
          flexDirection="column"
          justifyContent={hideSubtitleFindInStore ? 'center' : 'flex-start'}
          sx={styles.pickUpTextWrapper}
        >
          <Box as="span" sx={styles.pickUpMainText}>
            {capitalize(
              isToggleOnLimitedStoreFeature
                ? formatMessage({
                    id: 'pdp.product.findInStore',
                    defaultMessage: 'Find in Store',
                  })
                : formatMessage({
                    id: 'pdp.product.pickUpInStore',
                    defaultMessage: 'Pick up in-store',
                  })
            )}
          </Box>
          {!isPDPv5_1 &&
            !hideSubtitleFindInStore &&
            (isToggleOnLimitedStoreFeature ? (
              <Box
                as="span"
                variant="link"
                size="sm"
                data-qa="pdp_link_s_findoredit"
                sx={styles.changeLink}
              >
                {formatMessage({
                  id: 'pdp.product.enterZipCode',
                  defaultMessage: 'Enter zip code',
                })}
              </Box>
            ) : (
              <Box as="span" sx={styles.pickUpLowerText}>
                {formatMessage({
                  id: 'pdp.product.getItWithinThreeHours',
                  defaultMessage: 'Get it within 3 hours',
                })}
              </Box>
            ))}
        </Flex>
        {(!isToggleOnLimitedStoreFeature || isPDPv5_1) && renderArrowIcon()}
      </Flex>
    </Button>
  )

  const pickUpNotAvailable = () => {
    if (isPDPv5_1) {
      return (
        <Flex flexDirection="row" sx={styles.pickUpWrapper}>
          <Flex flexDirection="column" alignItems="flex-start" sx={styles.pickUpTextWrapper}>
            <Flex sx={styles.pickUpTextRow}>
              <Box sx={styles.pickUpSearchStoreIcon}>{renderStoreIcon()}</Box>
              <Box as="span" data-qa="pdp_txt_s_avlbl_at_sname" sx={styles.pickUpMainText}>
                {formatMessage(
                  isToggleOnLimitedStoreFeature
                    ? {
                        id: 'pdp.product.findInStoreNotAvailableNear',
                        defaultMessage: 'Not available near {location}',
                      }
                    : {
                        id: 'pdp.product.pickUpNotAvailableNear',
                        defaultMessage: 'Pick up not available near {location}',
                      },
                  { location: zipCode }
                )}
              </Box>
            </Flex>
            <Button
              variant="link"
              size="sm"
              onClick={handleOpenModal}
              data-qa="pdp_link_s_findoredit"
              sx={styles.changeLink}
            >
              {formatMessage({
                id: 'pdp.product.changeLocation',
                defaultMessage: 'Change location',
              })}
            </Button>
          </Flex>
          {renderArrowIcon()}
        </Flex>
      )
    }

    return (
      <>
        <Box m="auto 0" sx={styles.pickUpSearchStoreIcon}>
          {renderStoreIcon()}
        </Box>
        <Flex flexDirection="column" alignItems="flex-start" sx={styles.pickUpTextWrapper}>
          <Box as="span" data-qa="pdp_txt_s_avlbl_at_sname" sx={styles.pickUpMainText}>
            {isToggleOnLimitedStoreFeature
              ? formatMessage(
                  {
                    id: 'pdp.product.findStoreNear',
                    defaultMessage: 'Find in store near {location}',
                  },
                  { location: zipCode }
                )
              : formatMessage(
                  {
                    id: 'pdp.product.pickUpNotAvailableNear',
                    defaultMessage: 'Pick up not available near {location}',
                  },
                  { location: zipCode }
                )}
          </Box>
          <Button
            variant="link"
            size="sm"
            onClick={handleOpenModal}
            data-qa="pdp_link_s_findoredit"
            sx={styles.changeLink}
          >
            {formatMessage({
              id: 'pdp.product.changeZipCode',
              defaultMessage: 'Change zip code',
            })}
          </Button>
        </Flex>
      </>
    )
  }

  const pickUpWithChosenStore = () => {
    if (isPDPv5_1) {
      return (
        <Flex sx={styles.pickUpWrapper}>
          <Flex flexDirection="column" alignItems="flex-start" sx={styles.pickUpTextWrapper}>
            <Flex sx={styles.pickUpTextRow}>
              <Box sx={styles.pickUpSearchStoreIcon}>{renderStoreIcon()}</Box>
              <Box as="span" data-qa="pdp_txt_s_avlbl_at_sname" sx={styles.pickUpMainText}>
                {formatMessage(
                  isToggleOnLimitedStoreFeature
                    ? {
                        id: 'pdp.product.findInStoreAvailableNear',
                        defaultMessage: 'Available near {location}',
                      }
                    : {
                        id: 'pdp.product.pickUpAvailableNear',
                        defaultMessage: 'Pick up available near {location}',
                      },
                  { location: zipCode }
                )}
              </Box>
            </Flex>
            <Button
              variant="link"
              size="sm"
              onClick={handleOpenModal}
              data-qa="pdp_link_s_findoredit"
              sx={styles.changeLink}
            >
              {formatMessage({
                id: 'pdp.product.changeLocation',
                defaultMessage: 'Change location',
              })}
            </Button>
          </Flex>
          {renderBagIcon()}
        </Flex>
      )
    }

    return (
      <>
        <Box m="auto 0" sx={styles.pickUpSearchStoreIcon}>
          {renderStoreIcon()}
        </Box>
        <Flex flexDirection="column" alignItems="flex-start" sx={styles.pickUpTextWrapper}>
          <Box as="span" sx={styles.pickUpMainText}>
            {formatMessage(
              isToggleOnLimitedStoreFeature
                ? {
                    id: 'pdp.product.findInStore',
                    defaultMessage: 'Find in Store',
                  }
                : {
                    id: 'pdp.product.pickUpInStore',
                    defaultMessage: 'Pick up in-store',
                  }
            )}
          </Box>
          <Box as="p" data-qa="pdp_txt_s_avlbl_at_sname" sx={styles.pickUpLowerText}>
            {formatMessage(
              {
                id: 'pdp.product.getItAt',
                defaultMessage: 'Get it at {location}',
              },
              { location }
            )}
            <Button
              variant="link"
              size="sm"
              onClick={handleOpenModal}
              data-qa="pdp_link_s_findoredit"
              sx={styles.changeLink}
              ml="var(--spacing-1)"
            >
              {formatMessage({
                id: 'pdp.product.changeStore',
                defaultMessage: 'Change',
              })}
            </Button>
          </Box>
          <Template forIDs={[TemplateName.pdpv5_1, TemplateName.pdpv6]}>
            <StoreInventoryMessage storeAvailability={storeAvailability} altVersion="withUrgency" />
          </Template>
        </Flex>
        {renderBagIcon()}
      </>
    )
  }

  return (
    <Flex sx={styles.PickUpInStoreWrapper}>
      {isNeedFindStore
        ? location
          ? pickUpWithChosenStore()
          : pickUpNotAvailable()
        : pickUpSearchStore}
    </Flex>
  )
}

FindInStoreComponentV3Redesign.defaultProps = {
  handleOnPickUpInStoreClick: () => {},
  handleOpenModal: () => {},
}

export default withErrorBoundaryWrapper(FindInStoreComponentV3Redesign)
