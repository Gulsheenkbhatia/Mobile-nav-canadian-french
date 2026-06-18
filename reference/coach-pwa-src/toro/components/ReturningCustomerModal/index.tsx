import { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useDisclosure from 'toro/hooks/useDisclosure'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import CloseButton from 'toro/components/CloseButton'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import Link from 'toro/components/Link'
import Modal from 'toro/components/Modal'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import { searchRecentItemsFromCookieAtom } from 'store/search.atom'
import { parseReturnBackModalData } from 'toro/helpers/parseReturnBackModalData'
import usePageType from 'toro/hooks/usePageType'
import useAnalytics from 'toro/analytics/useAnalytics'
import SessionContext from 'toro/components/SessionContext'
import { fetchFullData } from 'helpers/getFullData'
import get from 'lodash/get'
import { RETURN_MODAL_SEEN } from 'toro/constants/cookies'
import Cookies from 'js-cookie'

const defaultTexts = {
  itemsInCart: {
    title: 'Welcome Back!',
    message: 'We saved the styles in your cart (but they could sell out soon).',
    cta: 'VIEW YOUR SHOPPING BAG',
  },
  noItemsInCart: {
    title: 'Still interested?',
    message: 'Pickup where you left off here.',
    cta: 'VIEW PRODUCT DETAILS',
  },
}

const EVENT_ACTIONS_CONTENT = {
  open: 'pick up where i left toast impression',
  click: 'pick up where i left toast click',
  close: 'pick up where i left toast close',
}

const COOKIE_TIME_TO_EXPIRE = 1

const returnModalCookie = Cookies.get(RETURN_MODAL_SEEN)

const ReturningCustomerModal = () => {
  const { locale, defaultLocale } = useRouter()
  const { isPDP } = usePageType()
  const { session } = useContext(SessionContext)
  const styles = useMultiStyleConfig('ReturningCustomerModal')
  const { viewport } = useViewportType()
  const { formatMessage } = useIntl()
  const modalRef = useRef(null)
  const [data, setData] = useState(null)
  const lastSeenFromCookie = useAtomValue(searchRecentItemsFromCookieAtom)
  const isLastSeenProductInitialized = Array.isArray(lastSeenFromCookie)
  const isLastSeenProductAvailable = isLastSeenProductInitialized && !!lastSeenFromCookie.length
  const analytics = useAnalytics()
  const localizedVariant = data?.isCartProducts ? 'itemsInCart' : 'noItemsInCart'

  const setModalCookieAsSeen = () => {
    if (data && isOpen) {
      Cookies.set(RETURN_MODAL_SEEN, 'true', {
        expires: COOKIE_TIME_TO_EXPIRE,
      })
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure({
    onClose: setModalCookieAsSeen,
    defaultIsOpen: false,
  })

  const eventWithAnalytics = (cb, eventAction) => {
    cb?.()
    analytics.send('returningCustomerModalInteraction', {
      eventAction: EVENT_ACTIONS_CONTENT[eventAction],
      eventLabel: get(session.cart, 'product_items', []).length
        ? `items in cart: ${defaultTexts.itemsInCart.cta}`
        : `view product: ${defaultTexts.noItemsInCart.cta}`,
    })
  }

  const onOpenWithAnalytics = () => eventWithAnalytics(onOpen, 'open')
  const onCloseWithAnalytics = () => eventWithAnalytics(onClose, 'close')
  const onClickWithAnalytics = () => eventWithAnalytics(onClose, 'click')

  useOutsideClick({
    ref: modalRef,
    handler: onClose,
  })

  const fetchFullProduct = async (cartProducts) => {
    const cartProductFullInfo = await fetchFullData(cartProducts, {
      includeInventory: true,
      withMaster: false,
      locale: locale || defaultLocale,
    })
    return cartProductFullInfo
  }

  const showPopup = (product, isCartProducts) => {
    const parsedData = parseReturnBackModalData(product, viewport, isCartProducts)
    setData(parsedData)
    if (parsedData) {
      onOpenWithAnalytics()
    }
  }

  useEffect(() => {
    if (returnModalCookie) {
      return
    }
    const setReturningCustomerModalData = async () => {
      const cartProductItems = get(session.cart, 'product_items', [])

      if (cartProductItems.length) {
        const lastCartItem = cartProductItems.slice(-1)
        const cartProductFullInfo = await fetchFullProduct(lastCartItem)
        const lastCartProduct = get(cartProductFullInfo, '[0]')
        showPopup(lastCartProduct, true)
        return
      }
      if (isLastSeenProductAvailable && !isPDP) {
        const lastSeenProductId = lastSeenFromCookie[0]
        const productFullDataResponse = await fetchFullProduct([{ product_id: lastSeenProductId }])
        const lastSeenProduct = get(productFullDataResponse, '[0]')
        showPopup(lastSeenProduct, false)
      }
    }
    if (session.initialized && isLastSeenProductInitialized) {
      setReturningCustomerModalData()
    }
  }, [session.initialized, isLastSeenProductInitialized])

  if (!isOpen || !data || returnModalCookie) return null

  return (
    <Modal isOpen={isOpen} onClose={onCloseWithAnalytics}>
      <Box sx={styles.modalWrapper} ref={modalRef}>
        <Box sx={styles.contentWrapper}>
          <Link href={data.link} onClick={onClickWithAnalytics}>
            <Image sx={styles.image} src={data.imageUrl} alt={data.imageAlt} />
          </Link>
          <Box sx={styles.textContent}>
            <Text sx={styles.modalTitle}>
              {formatMessage({
                id: `pdp.returningCustomer.${localizedVariant}.title`,
                defaultMessage: defaultTexts[localizedVariant].title,
              })}
            </Text>
            <Text sx={styles.modalText}>
              {formatMessage({
                id: `pdp.returningCustomer.${localizedVariant}.message`,
                defaultMessage: defaultTexts[localizedVariant].message,
              })}
            </Text>
            <Link href={data.link} onClick={onClickWithAnalytics}>
              <Button sx={styles.viewBagBtn} variant="primary" size="lg">
                {formatMessage({
                  id: `pdp.returningCustomer.${localizedVariant}.cta`,
                  defaultMessage: defaultTexts[localizedVariant].cta,
                })}
              </Button>
            </Link>
          </Box>
          <CloseButton size="md" onClick={onCloseWithAnalytics} sx={styles.miniCartCloseButton} />
        </Box>
      </Box>
    </Modal>
  )
}

export default ReturningCustomerModal
