import React, { useContext, useEffect, useRef } from 'react'
import Flex from 'toro/components/Flex'
import MiniCartButton from 'toro/components/header/MiniCart/MiniCartButton'
import get from 'lodash/get'
import SessionContext from 'toro/components/SessionContext'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const MiniCart = ({ setIsMiniCartRef, setIsHoveredOnMiniCart }) => {
  const { session } = useContext(SessionContext)
  const cart = get(session, 'cart', {})
  const productItems = get(cart, 'product_items', []) || []
  const triggerRef = useRef()

  useEffect(() => {
    setIsMiniCartRef(triggerRef)
  }, [])

  return (
    <Flex position="relative" justifyContent="center">
      <MiniCartButton
        ref={triggerRef}
        productItems={productItems}
        setIsHoveredOnMiniCart={setIsHoveredOnMiniCart}
      />
    </Flex>
  )
}

export default withErrorBoundaryWrapper(MiniCart)
