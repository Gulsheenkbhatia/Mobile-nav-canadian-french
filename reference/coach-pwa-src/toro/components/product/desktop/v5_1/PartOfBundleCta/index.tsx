import { useMultiStyleConfig } from '@chakra-ui/react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Link from 'toro/components/Link'
import { NavChevronRightBoldIcon } from 'toro/icons'
import Image from 'toro/components/Image'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import useProductData from 'toro/hooks/useProductData'
import { BundleProperties } from 'toro/components/product/desktop/v5_1/PartOfBundleCta/types'
import { BUNDLE_CTA_DATA_QA_ID } from 'toro/components/product/desktop/v5_1/PartOfBundleCta/constants'

const PartOfBundleCta = () => {
  const styles = useMultiStyleConfig('PartOfBundleCta')
  const { toggleSiteFeatures } = usePreferenceNew({
    ToggleSiteFeatures: ['showBundleOnPLP'],
  })
  const { bundleUrl, bundleMsg, bundleLinkText, bundleContentImages }: BundleProperties =
    useProductData('associatedBundle.bundleProperties') || {}
  const image = bundleContentImages?.images?.[0] || {}

  if (!(bundleUrl && toggleSiteFeatures.showBundleOnPLP)) return null

  return (
    <Link
      sx={styles.box}
      href={bundleUrl}
      data-qa={BUNDLE_CTA_DATA_QA_ID}
      aria-label={bundleLinkText}
    >
      <Image sx={styles.image} src={image.absURL} alt={image.alt} w={35} h={35} objectFit="cover" />
      {bundleMsg}
      <NavChevronRightBoldIcon
        role="presentation"
        width={18}
        height={18}
        data-qa="icon-nav-bundle"
      />
    </Link>
  )
}

export default withErrorBoundaryWrapper(PartOfBundleCta)
