import useToast from 'toro/hooks/useToast'
import { useIntl } from 'react-intl'
import { useCallback, useMemo } from 'react'

const useWishlistNotify = () => {
  const toast = useToast()
  const { formatMessage } = useIntl()

  const notifyAddSuccess = useCallback((productName) => {
    const textPartId = 'plp.wishlist.addItemSuccessText'
    const linkPartId = 'plp.wishlist.addItemSuccessLink'
    const textPart = formatMessage({ id: textPartId }, { product: productName.toUpperCase() })
    const linkPart = formatMessage({
      id: linkPartId,
    })

    if (textPart !== textPartId && linkPart !== linkPartId) {
      toast({
        description: `${textPart} `,
        link: linkPart,
      })
      return
    }

    const fullMessage = formatMessage(
      { id: 'plp.wishlist.addItemSuccess' },
      { product: productName.toUpperCase() }
    )
    toast({
      description: fullMessage,
    })
  }, [])

  const notifyAddError = useCallback((productName) => {
    toast({
      status: 'error',
      description: formatMessage(
        { id: 'plp.wishlist.addItemFailure' },
        { product: productName.toUpperCase() }
      ),
    })
  }, [])

  const notifyRemoveSuccess = useCallback((productName, onUndo) => {
    toast({
      description: formatMessage(
        { id: 'plp.wishlist.removeItemSuccess' },
        { product: productName.toUpperCase() }
      ),
      canUndo: true,
      onUndo,
    })
  }, [])

  const notifyRemoveError = useCallback((productName) => {
    toast({
      status: 'error',
      description: formatMessage(
        { id: 'plp.wishlist.removeItemError' },
        { product: productName.toUpperCase() }
      ),
    })
  }, [])

  return useMemo(
    () => ({
      notifyAddSuccess,
      notifyAddError,
      notifyRemoveSuccess,
      notifyRemoveError,
    }),
    []
  )
}

export default useWishlistNotify
