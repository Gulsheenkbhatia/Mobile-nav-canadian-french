import { memo, FC, useEffect, useRef, Suspense } from 'react'
import { setShowFullProductInfoPdpAtom, showFullProductInfoPdpAtom } from 'store/product-info.atom'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import { PlusIcon } from 'toro/icons'
import Text from 'toro/components/Text'
import { accessorizeItNodeAtom } from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useIntl } from 'react-intl'
import { accessorizeItProductsDataAtom } from 'store/accessorizeIt.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

interface AccessorizeItButtonProps {
  variant?: 'bento'
  withIcon?: boolean
}

const AccessorizeItButton: FC<AccessorizeItButtonProps> = ({ variant, withIcon = true }) => {
  const styles = useMultiStyleConfig('AccessorizeIt', { variant })
  const accessorizeItNode = useAtomValue(accessorizeItNodeAtom)
  const accessorizeItProductsData = useAtomValue(accessorizeItProductsDataAtom)
  const variantId = useSelectedVariantData('id')
  const analytics = useAnalytics()
  const triggeredByAccessorizeIt = useRef(false)

  const isExpanded = useAtomValue(showFullProductInfoPdpAtom)
  const setShowFullProductInfo = useUpdateAtom(setShowFullProductInfoPdpAtom)

  const { formatMessage } = useIntl()
  const buttonText = formatMessage({
    id: 'pdp.product.addACharm',
    defaultMessage: 'Add a Charm',
  })

  const scrollToAccessorizeIt = () => {
    if (accessorizeItNode) {
      accessorizeItNode.scrollIntoView()
    }
  }

  const onClick = () => {
    analytics.send('productInteraction', {
      eventAction: `${buttonText.toLowerCase()} cta click`,
      eventLabel: variantId,
      eventLocationForced: 'product image',
    })

    if (isExpanded) {
      scrollToAccessorizeIt()
      return
    }

    triggeredByAccessorizeIt.current = true
    setShowFullProductInfo(true)
  }

  useEffect(() => {
    if (isExpanded && triggeredByAccessorizeIt.current) {
      const timer = setTimeout(() => {
        scrollToAccessorizeIt()
        triggeredByAccessorizeIt.current = false
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, accessorizeItNode])

  if (
    !(
      accessorizeItProductsData?.charms?.length > 0 || accessorizeItProductsData?.straps?.length > 0
    )
  ) {
    return null
  }

  return (
    <Box
      sx={styles.accessorizeItButtonWrapper}
      className="accessorize-it-button-wrapper"
      data-qa="btn_Add_a_Charm"
    >
      <Button onClick={onClick} sx={styles.accessorizeItButton} className="accessorize-it-button">
        <Text sx={styles.accessorizeItButtonText}>
          {buttonText}
          {!withIcon && ' +'}
        </Text>
        {withIcon && <PlusIcon width="12" height="13" viewBox="0 0 12 13" />}
      </Button>
    </Box>
  )
}

const AccessorizeItButtonWithSuspense: FC<AccessorizeItButtonProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <AccessorizeItButton {...props} />
    </Suspense>
  )
}

export default memo(AccessorizeItButtonWithSuspense)
