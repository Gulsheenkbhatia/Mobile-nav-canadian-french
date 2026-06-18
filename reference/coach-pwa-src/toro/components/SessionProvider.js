import React, { useState, useEffect, useMemo, useRef, useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import SessionContext from 'toro/components/SessionContext'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import getAPIURL from 'helpers/getAPIURL'
import { useRouter } from 'next/router'
import { wishlistIdsAtom, updatedWishListAtom } from 'store/wishlist.atom'
import { PWA_SOURCECODE } from 'toro/constants/cookies'
import Cookies from 'js-cookie'
import clearSWPrefetchCache from 'toro/helpers/clearSWPrefetchCache'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import isArray from 'lodash/isArray'
import { getToken, setToken } from 'toro/lib/shopper-login/helpers/token'
import handleResponse from 'toro/lib/shopper-login/helpers/handleResponse'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import { rawMenuDataAtom, isOneCoachNAEnabledAtom } from 'store/menu-data.atom'
import { getVisibleMenuData } from 'toro/helpers/menu'
import { setCartProductIdsAtom } from 'store/miniCartPopover.atom'
import withCorrId from 'helpers/traceability'
import { xgenClientAtom } from 'store/xgen.atom'
import { xgenAlternateUserIdAtom } from 'store/xgen-recommendations.atom'
import { isApplePayAvailable } from 'toro/components/PaymentWidget/helpers'

const initialState = {
  signedIn: false,
  cart: {},
}

const getUpsertCartErrorMessage = (result) => {
  let errMessage = result?.fault?.message
  if (result?.fault?.error?.type === 'ProductItemNotAvailableException') {
    errMessage = `${errMessage}-${result?.fault?.error?.type}`
  }
  return errMessage
}

/**
 * Fetches user session data from a specific URL and provides it to descendant components via `SessionContext`.
 *
 * User and session data such as the number of items in the cart, the user's name, and email should always be
 * fetched when the app mounts, not in `getInitialProps`, otherwise the SSR result would not be cacheable
 * since it would contain user-specific data.
 */
export default function SessionProvider({ url, children, menuData }) {
  const { appData } = useContext(PWAContext)
  const newSessionToggle = get(appData, 'newSessionMgmt')
  const [session, setSession] = useState(initialState)
  const [sessionLoading, setSessionLoading] = useState(false)
  const router = useRouter()
  const [isGuestUser, setIsGuestUser] = useState(false)
  const setWishlistIds = useUpdateAtom(wishlistIdsAtom)
  const setIsWishListUpdated = useUpdateAtom(updatedWishListAtom)
  const setRawMenuData = useUpdateAtom(rawMenuDataAtom)
  const setCartProductIds = useUpdateAtom(setCartProductIdsAtom)
  const [persistedXgenCustomerId, setXgenAlternateUserId] = useAtom(xgenAlternateUserIdAtom)
  const lastPwaSrcCookieValue = useRef()
  const xgenClient = useAtomValue(xgenClientAtom)
  const localeData = normalizeLocalizationContent(get(appData, 'locale'))
  const locale = get(localeData, 'locale')
  const addToCartUrl = `/add-to-cart?locale=${locale}`
  const updateCartUrl = `/update-cart?locale=${locale}`
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)

  const fullMenuData = useMemo(() => {
    if (isOneCoachNAEnabled && !!menuData?.[0]) {
      return menuData[0]
    }

    return menuData
  }, [])

  const fetchWithCorrId = withCorrId()

  const getBasketId = (session) => {
    return get(session, 'cart.baskets.0.basket_id') || get(session, 'cart.basket_id')
  }

  const fetchUserData = async () => {
    const src = router?.query?.src

    const response = await fetchWithCorrId(
      getAPIURL(`/user?locale=${locale}${src ? `&src=${src}` : ''}`)
    )

    const { isError, data, error } = await handleResponse(response)

    if (isError) {
      // If entered, there is no recovery until issue is resovled (ie outages, etc).
      console.error(
        error?.message || 'An unknown error occurred in attempting to fetch the user info.',
        error
      )

      return false
    } else {
      const useEmail = data?.userEmail ?? persistedXgenCustomerId

      if (useEmail) {
        setXgenAlternateUserId(useEmail)
        xgenClient?.recommendations?.setCustomerId(useEmail)
      }

      /*
        Page data can vary based on the SRC value, so we're purging the SW prefetch cache whenever
        the PWA SRC cookie value changes, to avoid serving incorrect or stale content from the SW.
       */
      const pwaSrcCookie = Cookies.get(PWA_SOURCECODE)
      if (pwaSrcCookie !== lastPwaSrcCookieValue.current) {
        lastPwaSrcCookieValue.current = pwaSrcCookie
        clearSWPrefetchCache()
      }

      return data
    }
  }

  const fetchSession = async () => {
    const response = await fetchWithCorrId(url)

    const { isError, data, error } = await handleResponse(response)

    if (isError) {
      // If entered, there is no recovery until issue is resovled (ie outages, etc).
      console.error(
        error?.message || 'An unknown error occurred in attempting to fetch a session.',
        error
      )

      return false
    } else {
      const userData = await fetchUserData()

      const session = {
        ...data,
        cart: get(data, 'cart.baskets.0', {}),
        user: userData,
        initialized: true,
      }

      setToken(get(data, 'bearerToken'))
      setSession(session)

      return session
    }
  }

  const fetchCart = async () => {
    const { token } = await getToken()
    const headers = {
      Authorization: token,
    }

    const response = await fetchWithCorrId(getAPIURL('/user/cart'), {
      headers,
    })

    const { isError, data, error } = await handleResponse(response)

    if (isError) {
      // If entered, there is no recovery until issue is resovled (ie outages, etc).
      console.error(
        error?.message || "An unknown error occurred in attempting to fetch the user's cart.",
        error
      )
    } else {
      setSession((prev) => ({
        ...prev,
        cart: get(data, 'cart.baskets.0', {}),
      }))
    }
  }

  const isApplePayEligible = useMemo(isApplePayAvailable, [])
  const context = useMemo(() => {
    return {
      session,
      isGuestUser,
      sessionLoading,
      actions: {
        fetchSession,

        /**
         * Adds items to the cart
         * @param {Object} options
         * @param {Object} options.product Product data object
         * @param {Number} options.quantity The quantity to add to the cart
         * @param {Object} options.otherParams Additional data to submit to api/addToCart
         */
        async addToCart(params) {
          const { product, quantity, id, location, bundle, storeId, productId, ...otherParams } =
            params

          const context = {
            session: session,
            isGuestUser,
            arguments: params,
          }

          const { token: bearerToken, updatedSession } = await getToken()
          const basketId = getBasketId(otherParams?.updatedSession || updatedSession || session)

          context.getToken = {
            updatedSession,
            basketId,
          }

          context.basketId = basketId

          const response =
            bundle?.length > 0
              ? await fetchWithCorrId(getAPIURL(addToCartUrl), {
                  method: 'POST',
                  body: JSON.stringify({
                    bundle,
                    basketId,
                    token: bearerToken,
                    isApplePayEligible,
                  }),
                })
              : await fetchWithCorrId(getAPIURL(addToCartUrl), {
                  method: 'POST',
                  body: storeId
                    ? JSON.stringify({
                        sku: productId || get(product, 'id'),
                        quantity,
                        basketId,
                        storeId,
                        token: bearerToken,
                        isApplePayEligible,
                        ...otherParams,
                      })
                    : id
                    ? JSON.stringify({
                        basketId,
                        id,
                        location,
                        isApplePayEligible,
                      })
                    : JSON.stringify({
                        sku: productId || get(product, 'id'),
                        quantity,
                        basketId,
                        token: bearerToken,
                        isApplePayEligible,
                        ...otherParams,
                      }),
                })

          const { isError, error } = await handleResponse(response)

          if (isError) {
            context.fault = error?.fault
            throw new Error(getUpsertCartErrorMessage(error) || 'Error adding to cart')
          } else {
            await fetchCart()
          }
        },

        /**
         * Updates the item in the cart. Use this function to update the quantity of a product
         * in the cart or remove a product from the cart.
         * @param {Object} options
         * @param {Object} options.product Cart product to be updated
         * @param {number} options.quantity Expected quantity value
         * @param {Object} options.otherParams Additional data to submit to api/cart/update
         */
        async updateCart(params) {
          const { product, itemId, quantity, productId, ...otherParams } = params

          const { token: bearerToken, updatedSession } = await getToken()
          const basketId = getBasketId(updatedSession || session)

          let currentId = itemId

          if (updatedSession) {
            // we need to get actual item_id from new created cart's product for proper updating of the same item in active cart
            const productItems = get(updatedSession, 'cart.baskets.0.basket_id.product_items', [])
            const productInNewBasket = productItems.find(
              (item) => item?.product_id === get(product, 'id')
            )

            currentId = get(productInNewBasket, 'item_id')

            // If the product is not added to the cart, add to cart instead
            if (!currentId) {
              // Update session
              setSession(updatedSession)
              await this.addToCart({
                ...params,
                updatedSession,
              })
              return
            }
          }

          const response = await fetchWithCorrId(getAPIURL(updateCartUrl), {
            method: 'POST',
            body: JSON.stringify({
              sku: productId || get(product, 'id'),
              quantity,
              basketId,
              token: bearerToken,
              itemId: currentId,
              isApplePayEligible,
              ...otherParams,
            }),
          })

          const { isError, error } = await handleResponse(response)

          if (isError) {
            throw new Error(getUpsertCartErrorMessage(error) || 'Error updating to cart')
          } else {
            await fetchCart()
          }
        },

        /**
         * Apply coupon for a current cart.
         * @param {Object} options
         * @param {string} options.basketId Cart id where coupon should be applied
         * @param {string} options.couponId Coupon id which should be applied
         */
        async applyCartCoupon(params) {
          const { basketId, couponId } = params
          try {
            if (!basketId || !couponId) return
            const payload = JSON.stringify({ couponId, basketId })
            const { token } = await getToken()
            const couponStatusResponse = await fetchWithCorrId(getAPIURL('/cart-coupons'), {
              method: 'POST',
              body: payload,
              headers: {
                Authorization: token,
              },
            })

            return await couponStatusResponse.json()
          } catch (e) {
            console.error('Error due request for coupon status', e)
          }
        },
      },
    }
  }, [session, sessionLoading])

  useEffect(() => {
    const getSession = async () => {
      setSessionLoading(true)
      // TODO:  Do cleanup with DIGIT-35317
      if (newSessionToggle) {
        const { token, updatedSession = {} } = await getToken()
        const [userData, cartResponse] = await Promise.all([
          fetchUserData(),
          fetchWithCorrId(getAPIURL('/user/cart'), {
            headers: { Authorization: token },
          }),
        ])
        const { data } = await handleResponse(cartResponse)
        // Create session with token, user data, and cart data
        const sessionWithToken = {
          ...updatedSession,
          cart: get(data, 'cart.baskets.0', {}),
          user: userData,
          customerId: data.customerId,
          initialized: true,
          bearerToken: token,
        }
        setSession((prev) => ({
          ...prev,
          ...sessionWithToken,
        }))
      } else {
        await fetchSession()
      }
      setSessionLoading(false)
    }

    const getCart = async () => {
      setSessionLoading(true)
      await fetchCart()
      setSessionLoading(false)
    }

    getSession()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getCart()
      }
    }
    // Fetch fresh session when user is focusing on tab with app
    document.addEventListener('visibilitychange', handleVisibilityChange, false)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [url])

  useEffect(() => {
    if (!session) {
      return
    }

    const isGuest = get(session, 'user.CustomerGroups.customerGroups[0].name', '')
      .toLowerCase()
      .includes('guest')
    setIsGuestUser(isGuest)

    const getWishList = () => {
      const wishlistIds = get(session, 'user.CustomerGroups.customerGroups.0.wishlistIDs', [])
      if (!isArray(wishlistIds)) {
        setWishlistIds([])
      } else {
        setWishlistIds(wishlistIds)
      }
      if (get(session, 'user.CustomerGroups.customerGroups.0.wishlistIDs')) {
        setIsWishListUpdated(wishlistIds)
      }
    }
    getWishList()

    if (session.cart) {
      setCartProductIds(session.cart)
    }
  }, [session])

  useEffect(() => {
    const isGuest = get(session, 'user.CustomerGroups.customerGroups[0].name', '').includes('Guest')
    const isSourceCodeAvailable = get(session, 'user.sourceCodeGroupID')
    if (!isGuest || isSourceCodeAvailable) {
      const visibleMenuData = getVisibleMenuData(fullMenuData, session)
      setRawMenuData(visibleMenuData)
    }
  }, [session?.user])

  return <SessionContext.Provider value={context}>{children}</SessionContext.Provider>
}

SessionProvider.propTypes = {
  /**
   * A URL to fetch when the app mounts which establishes a user session and returns user and cart data
   */
  url: PropTypes.string,
}
