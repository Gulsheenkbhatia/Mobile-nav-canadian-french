import { useMultiStyleConfig } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { isShowingShippingAndReturnsModal } from 'store/pdp.atom'
import Text from 'toro/components/Text'
import InfoIcon from 'toro/icons/Info.svg'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

const ShippingAndReturnsModal = dynamic(() => import('toro/components/ShippingAndReturnsModal'), {
  ssr: false,
})

const ShippingAndReturnsWidget = ({ finalSaleText, shippingBody }) => {
  const styles = useMultiStyleConfig('ShippingAndReturnsWidget')
  const [isShowShippingAndReturnModal, setShowShippingAndReturnModal] = useAtom(
    isShowingShippingAndReturnsModal
  )
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])

  const handleIconClick = (e) => {
    e.preventDefault()
    setShowShippingAndReturnModal(!isShowShippingAndReturnModal)
  }

  return (
    <>
      <ShippingAndReturnsModal title={finalSaleText} shippingBody={shippingBody} />
      <Text
        sx={styles.shippingAndReturnLabel}
        className="shipping-return-container"
        {...(isPDPV5Enabled && { 'data-qa': 'Shipping_Return_Container' })}
      >
        {finalSaleText}
        <InfoIcon viewBox="0 0 16 16" style={{ marginLeft: '8px' }} onClick={handleIconClick} />
      </Text>
    </>
  )
}

export default ShippingAndReturnsWidget
