import useStyles from 'toro/hooks/useStyles'
import Flex from 'toro/components/Flex'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import SigninMemberButton from 'toro/components/product/SigninMemberButton'
import useProductData from 'toro/hooks/useProductData'
import { selectedVariantAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import TooltipVariationMessages from 'toro/components/product/desktop/AddToBagArea/TooltipVariationMessages'
import get from 'lodash/get'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'

const MembershipButton = () => {
  const styles = useStyles()
  const productVariant = useAtomValue(selectedVariantAtom)
  const pdId = useProductData('id')

  return (
    <Flex sx={styles.membershipButtonArea} flexDirection="column">
      <Template notForIDs={[TemplateName.pdpv6, TemplateName.pdpv5_1, TemplateName.pdpv7]}>
        <TooltipVariationMessages isMembershipExclusiveProduct />
      </Template>
      <SigninMemberButton productData={{ id: get(productVariant, 'id', pdId) }} />
    </Flex>
  )
}

export default withErrorBoundaryWrapper(MembershipButton)
