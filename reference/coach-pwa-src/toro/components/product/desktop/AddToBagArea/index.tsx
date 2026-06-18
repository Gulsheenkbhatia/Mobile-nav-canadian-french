import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import StylesProvider from 'toro/components/StylesProvider'
import AddToBagButton from 'toro/components/product/desktop/AddToBagArea/AddToBagButton'
import Flex from 'toro/components/Flex'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import AlternateCta from 'toro/components/product/desktop/AddToBagArea/AlternateCta'
import MembershipButton from 'toro/components/product/desktop/AddToBagArea/MembershipButton'
import SessionContext from 'toro/components/SessionContext'
import useProductData from 'toro/hooks/useProductData'
import get from 'lodash/get'
import { useContext } from 'react'
import { orderingStatusAtom, isCustomizedProductAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { ORDERING_STATUS } from 'toro/helpers/productVariations'
import { isSubBrandActiveAtom } from 'store/global.atom'
import TooltipVariationMessages from './TooltipVariationMessages'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import InventoryCalloutBadge from 'toro/components/product/mobile/Badges/InventoryCalloutBadge'
import { BadgeVariant } from 'toro/components/badges/Badge'

const AddToBagArea = ({ isMinimized = false, isSticky = false }) => {
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const isCustomizedProduct = useAtomValue(isCustomizedProductAtom)
  const styles = useMultiStyleConfig('AddToBagArea', {
    variant: isSubBrandActive ? 'coachtopia' : null,
    isCustomizedProduct,
  })
  const { session } = useContext(SessionContext)
  const orderingStatus = useAtomValue(orderingStatusAtom)
  const membershipExclusiveProduct = useProductData('master.customAttributes.c_isMemberExclusive')
  const isLoggedIn = !!get(session, 'user.userEmail')
  const membershipExclusiveProductCTAEnabled =
    membershipExclusiveProduct && !isLoggedIn && orderingStatus !== ORDERING_STATUS.soldOut

  return (
    <StylesProvider value={styles}>
      <Flex
        className={`atb-area ${isMinimized ? 'atb-area-minimized' : ''}`}
        sx={styles.rootContainer}
        data-qa="pdp_attribute_wrapper"
      >
        {!isSticky && (
          <Template forIDs={[TemplateName.pdpv6, TemplateName.pdpv5_1]}>
            <TooltipVariationMessages />
          </Template>
        )}
        {!isSticky && (
          <Experiment
            forMobile
            forIDs={`${EXPERIMENTS.SOCIAL_PROOF_MESSAGE_PDP}-${EXPERIMENTS.LOW_INVENTORY_ABOVE_ATB}`}
          >
            <Template forIDs={[TemplateName.pdpv6]}>
              <InventoryCalloutBadge variant={BadgeVariant.LowInventoryAboveATB} />
            </Template>
          </Experiment>
        )}
        {membershipExclusiveProductCTAEnabled ? (
          <MembershipButton />
        ) : (
          <Flex sx={styles.addToBagControlsWrapper}>
            <AddToBagButton />
            <AlternateCta />
          </Flex>
        )}
      </Flex>
    </StylesProvider>
  )
}

export default withErrorBoundaryWrapper(AddToBagArea)
