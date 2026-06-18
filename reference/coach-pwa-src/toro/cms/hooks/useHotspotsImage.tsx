import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import CmsAddToBagButton from 'toro/components/CmsAddToBagButton'
import useViewportType from 'toro/hooks/useViewportType'
import {
  addToBagButtonOnEventAtom,
  closeHotspotSizeDrawerAtom,
  openHotspotSizeDrawerAtom,
} from 'store/global.atom'
import { useResetAtom, useUpdateAtom } from 'jotai/utils'
import { fetchHotspotProductData } from 'toro/helpers/fetchHotspotProductData'
import { getToken } from 'toro/lib/shopper-login/helpers/token'
import {
  DATA_ATB_SELECTOR,
  HOTSPOT_HORIZONTAL_OFFSET_DESKTOP,
  HOTSPOT_ICON_SIZE,
  HOTSPOT_PRODUCT_SELECTOR,
  TOOLTIP_WIDTH,
} from 'toro/cms/constants'
import useAnalytics from 'toro/analytics/useAnalytics'
import { handlePromotionEvent } from 'toro/analytics/useCmsAnalytics'
import { MAIN_CONTENT } from 'toro/constants/appConstants'
import { closeHotspotATBTooltip, sanitizeUrl } from 'toro/cms/utils'

type Hotspot = {
  id: string
  target: string
  selector: string
  productId?: string
}

type HotspotConfig = {
  hotspots?: Hotspot[]
}

type HotspotStyles = {
  hotspotIconSize?: string
  tooltipTopMargin?: string
  tooltipBottomMargin?: string
  thresholdSpace?: number
}

type GeneralCTAConfig = {
  label?: string
  linkURL?: string
  linkStyle?: string
  target?: boolean
  ctaTextColor?: string
  ctaBgColor?: string
  ctaWithRoundedEdges?: boolean
  ctaColorInverse?: boolean
  desktopLinkSize?: string
  mobileLinkSize?: string
}

function getHotspotConfig(hotspotsData: HTMLElement, isMobile: boolean): HotspotConfig {
  const configAttr = isMobile ? 'data-mobile-config' : 'data-desktop-config'
  try {
    const hotspotsConfig = JSON.parse(hotspotsData.getAttribute(configAttr) ?? '{}')
    return hotspotsConfig
  } catch (error) {
    const contentId = hotspotsData.getAttribute('data-contentid')
    console.error(`Error parsing JSON data for Hotspots - Content ID: ${contentId}`, error)
    return {}
  }
}

export function getHotspotStyles(
  hotspotIcon: HTMLElement,
  element: HTMLElement
): [string, string, string, string] {
  const leftSpaceOfHotspot = parseFloat(hotspotIcon.style.left)
  const topSpaceOfHotspot = parseFloat(hotspotIcon.style.top)

  const hotspotsData = element.querySelector('.hotspots-data') as HTMLElement
  let hotspotStyles: HotspotStyles = {}
  try {
    hotspotStyles = JSON.parse(hotspotsData?.getAttribute('data-hotspots-values') ?? '{}')
  } catch (error) {
    console.error('Error parsing data-hotspots-values JSON:', error)
  }

  const {
    hotspotIconSize = '0px',
    tooltipTopMargin = '0px',
    tooltipBottomMargin = '0px',
    thresholdSpace = 0,
  } = hotspotStyles

  let [leftSpace, rightSpace, topSpace, bottomSpace] = Array(4).fill('auto')

  if (leftSpaceOfHotspot > thresholdSpace) {
    rightSpace = `calc(100% - ${leftSpaceOfHotspot}% - ${hotspotIconSize})`
  } else {
    leftSpace = hotspotIcon.style.left
  }
  if (topSpaceOfHotspot > thresholdSpace) {
    bottomSpace = `calc(100% - ${topSpaceOfHotspot}% + ${tooltipTopMargin})`
  } else {
    topSpace = `calc(${topSpaceOfHotspot}% + ${tooltipBottomMargin})`
  }

  return [leftSpace, rightSpace, topSpace, bottomSpace]
}

const VERTICAL_OFFSET = 12
const HORIZONTAL_OFFSET_MOBILE = 8

export function computeHotspotTooltipPosition(
  hotspotIcon: HTMLElement,
  containerElement: HTMLElement,
  tooltipPositions: {
    leftSpace: string
    rightSpace: string
    topSpace: string
    bottomSpace: string
  },
  isMobile: boolean = false
) {
  if (!hotspotIcon || !containerElement) {
    return { leftSpace: 'auto', rightSpace: 'auto', topSpace: 'auto', bottomSpace: 'auto' }
  }

  const hotspotRect = hotspotIcon.getBoundingClientRect()
  const containerRect = containerElement.getBoundingClientRect()
  const screenWidth = window.innerWidth

  const left = hotspotRect.left - containerRect.left
  const right = containerRect.right - hotspotRect.right
  const top = hotspotRect.top - containerRect.top + HOTSPOT_ICON_SIZE + VERTICAL_OFFSET
  const bottom = containerRect.bottom - hotspotRect.bottom + HOTSPOT_ICON_SIZE + VERTICAL_OFFSET

  let leftSpace = 'auto'
  let rightSpace = 'auto'
  let topSpace = 'auto'
  let bottomSpace = 'auto'

  if (isMobile) {
    const hotspotCenterX = hotspotRect.left + hotspotRect.width / 2
    const isOnLeftSide = hotspotCenterX < screenWidth / 2

    if (isOnLeftSide) {
      leftSpace = `${left}px`
      if (left + TOOLTIP_WIDTH > screenWidth) {
        leftSpace = `${screenWidth - TOOLTIP_WIDTH - HORIZONTAL_OFFSET_MOBILE}px`
      }
    } else {
      rightSpace = `${right}px`
      if (right + TOOLTIP_WIDTH > screenWidth) {
        rightSpace = `${screenWidth - TOOLTIP_WIDTH - HORIZONTAL_OFFSET_MOBILE}px`
      }
    }
  } else {
    if (tooltipPositions.leftSpace !== 'auto') {
      leftSpace = `${left}px`
      if (left + TOOLTIP_WIDTH > screenWidth) {
        leftSpace = `${screenWidth - TOOLTIP_WIDTH - HOTSPOT_HORIZONTAL_OFFSET_DESKTOP}px`
      }
    }

    if (tooltipPositions.rightSpace !== 'auto') {
      rightSpace = `${right}px`
      if (right + TOOLTIP_WIDTH > screenWidth) {
        rightSpace = `${screenWidth - TOOLTIP_WIDTH - HOTSPOT_HORIZONTAL_OFFSET_DESKTOP}px`
      }
    }
  }
  if (tooltipPositions.topSpace !== 'auto') {
    topSpace = `${top}px`
  }
  if (tooltipPositions.bottomSpace !== 'auto') {
    bottomSpace = `${bottom}px`
  }

  const positions = { left, right, top, bottom }
  const positionsWithPx = { leftSpace, rightSpace, topSpace, bottomSpace }

  return { positionsWithPx, positions, screenWidth }
}

const CTA_STYLE_CLASS_MAP: Record<string, string> = {
  'Primary Button': 'btn-primary',
  'Primary Button - Light': 'btn-primary light',
  'Secondary Button': 'btn-secondary',
  'Secondary Button - Light': 'btn-secondary light',
  'Text Link': 'btn-link',
}

const hotspotAnalyticsData = {
  eventLocation: 'amplience interactive hotspot',
  containerLabel: 'amplience interactive hotspot',
}

export function setPromotionTrackingAttributes(
  el: HTMLElement,
  {
    promotionId,
    promotionName,
    creativeName,
  }: {
    promotionId: string
    promotionName: string
    creativeName: string
  }
): void {
  if (!el) return
  if (promotionId) el.setAttribute('data-promotion-id', promotionId)
  if (promotionName) el.setAttribute('data-promotion-name', promotionName)
  if (creativeName) el.setAttribute('data-creative-name', creativeName)
}

const useHotspotsImage = (): ((element: HTMLElement | null) => void) => {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const resetAddToBagButtonOnEvent = useResetAtom(addToBagButtonOnEventAtom)
  const setAddToBagButtonOnEvent = useUpdateAtom(addToBagButtonOnEventAtom)
  const { isMobile } = useViewportType()
  const analytics = useAnalytics()
  const openSizeDrawer = useUpdateAtom(openHotspotSizeDrawerAtom)
  const closeSizeDrawer = useUpdateAtom(closeHotspotSizeDrawerAtom)
  const productsDataMap = useRef(new Map())
  const imageClickListenersRef = useRef<Array<{ element: HTMLElement; handler: EventListener }>>([])
  const currentAbortControllerRef = useRef<AbortController | null>(null)
  const clearImageClickListeners = useCallback(() => {
    imageClickListenersRef.current.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler)
    })
    imageClickListenersRef.current = []
  }, [])

  const showTooltip = useCallback(async (hotspot: Hotspot, element, hotspotIcon, promotionId) => {
    const rootContainer = document.getElementById(MAIN_CONTENT)
    const globalTooltip = rootContainer?.querySelector('.global-tooltip') as HTMLDivElement
    const hotspotSelector = hotspot.selector
    let productId
    if (!globalTooltip) return

    if (currentAbortControllerRef.current && !currentAbortControllerRef.current.signal.aborted) {
      currentAbortControllerRef.current.abort()
    }

    const isSizedProduct = globalTooltip.getAttribute('data-sized-product')
    const wishlistPid = globalTooltip.getAttribute('data-wishlist-pid')
    if (isSizedProduct) {
      globalTooltip.removeAttribute('data-sized-product')
    }
    if (wishlistPid) {
      globalTooltip.removeAttribute('data-wishlist-pid')
    }
    if (hotspotSelector !== HOTSPOT_PRODUCT_SELECTOR) {
      globalTooltip.innerHTML = hotspot.target
      globalTooltip.classList.remove('product-loading')
      productId = globalTooltip
        .querySelector("[data-show-atb='true']")
        ?.getAttribute('data-atb-pid')
    } else {
      const parsedProductId = new URLSearchParams(`productId=${hotspot.target}`)
      productId = parsedProductId.get('productId')
      globalTooltip.innerHTML = ''
      globalTooltip.classList.add('product-loading')
    }
    const isATBEnabled = element.dataset.atbEnabled === 'true'
    const isproductImageDisabled = element.dataset.productImageDisable === 'true'
    const isProductPriceDisabled = element.dataset.productPriceDisable === 'true'
    const isProductHotspot = hotspotSelector === HOTSPOT_PRODUCT_SELECTOR || hotspot.productId
    globalTooltip.setAttribute('data-atb-enabled', String(isATBEnabled))
    globalTooltip.setAttribute('data-product-image-disable', String(isproductImageDisabled))
    globalTooltip.setAttribute('data-product-price-disable', String(isProductPriceDisabled))

    let customLinkUrl: string | undefined
    let generalCTAConfig: GeneralCTAConfig | null = null
    if (isProductHotspot) {
      customLinkUrl = sanitizeUrl(element.dataset.productLinkUrl)
      const hotspotsData = element.querySelector('.hotspots-data') as HTMLElement | null
      try {
        const generalCTAStr = hotspotsData?.getAttribute('data-general-cta')
        if (generalCTAStr) generalCTAConfig = JSON.parse(generalCTAStr)
      } catch (error) {
        console.error('Error parsing JSON data for General CTA', error)
      }
    }

    const [leftSpace, rightSpace, topSpace, bottomSpace] = getHotspotStyles(hotspotIcon, element)

    const { positionsWithPx, positions, screenWidth } = computeHotspotTooltipPosition(
      hotspotIcon,
      rootContainer,
      {
        leftSpace,
        rightSpace,
        topSpace,
        bottomSpace,
      },
      isMobile
    )

    globalTooltip.style.inset = `${positionsWithPx.topSpace} ${positionsWithPx.rightSpace} ${positionsWithPx.bottomSpace} ${positionsWithPx.leftSpace}`
    globalTooltip.classList.add('active')

    if (hotspot.selector === HOTSPOT_PRODUCT_SELECTOR) {
      const abortController = new AbortController()
      currentAbortControllerRef.current = abortController

      try {
        const { token } = await getToken()
        const res = await fetchHotspotProductData(productId, token, abortController.signal)
        const { html, fault, data } = await res.json()
        if (fault) {
          throw new Error(fault)
        }
        if (
          abortController.signal.aborted ||
          currentAbortControllerRef.current !== abortController
        ) {
          return
        }
        globalTooltip.innerHTML = html
        hotspot.target = html
        hotspot.selector = 'target'
        hotspot.productId = productId
        if (data?.length) {
          productsDataMap.current.set(productId, data[0])
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Error in fetching hotspot product data', err)
        }
      } finally {
        if (currentAbortControllerRef.current === abortController) {
          currentAbortControllerRef.current = null
          globalTooltip.classList.remove('product-loading')
        }
      }
    }
    if (productId && productsDataMap.current.has(productId)) {
      const productData = productsDataMap.current.get(productId)
      analytics.addImpression('viewItemListCategory', [
        {
          ...productData,
          eventLocation: hotspotAnalyticsData.eventLocation,
          item_list_name: hotspotAnalyticsData.containerLabel,
          index: '1',
        },
      ])
      if (productData.defaultVariantGroup?.id) {
        globalTooltip.setAttribute('data-wishlist-pid', productData.defaultVariantGroup.id)
      }
      if (productData.sizes?.length) {
        globalTooltip.setAttribute('data-sized-product', 'true')
      }
      const imageWrapper = globalTooltip.querySelector(
        '.product-tile__image-wrapper'
      ) as HTMLElement
      if (imageWrapper) {
        clearImageClickListeners()
        const image = imageWrapper.querySelector('img')
        setPromotionTrackingAttributes(imageWrapper, {
          promotionId,
          promotionName: productData.id,
          creativeName: image?.src,
        })
        const handleImageClick = (event: MouseEvent) => {
          handlePromotionEvent(event, analytics.send)
        }
        imageWrapper.addEventListener('click', handleImageClick)
        imageClickListenersRef.current.push({
          element: imageWrapper,
          handler: handleImageClick as EventListener,
        })
      }
    }
    if (customLinkUrl) {
      const imageLink = globalTooltip.querySelector(
        '.product-tile__image-wrapper'
      ) as HTMLAnchorElement
      const titleLink = globalTooltip.querySelector('.product-tile__title a') as HTMLAnchorElement
      if (imageLink) imageLink.href = customLinkUrl
      if (titleLink) titleLink.href = customLinkUrl
    }

    if (generalCTAConfig?.label) {
      const atbContainer = globalTooltip.querySelector("[data-show-atb='true']") as HTMLElement
      if (atbContainer) {
        atbContainer.innerHTML = ''
        const ctaLink = document.createElement('a')
        ctaLink.href = sanitizeUrl(generalCTAConfig.linkURL) || customLinkUrl || '#'
        ctaLink.textContent = generalCTAConfig.label

        const styleClass = CTA_STYLE_CLASS_MAP[generalCTAConfig.linkStyle ?? ''] ?? 'btn-link light'
        const classes = ['btn', 'text-cta-underline', 'hotspot-general-cta', styleClass]
        if (generalCTAConfig.ctaWithRoundedEdges) classes.push('cta-rounded')
        if (generalCTAConfig.ctaColorInverse) classes.push('cta-color-inverse')
        if (generalCTAConfig.mobileLinkSize) classes.push(`xs:${generalCTAConfig.mobileLinkSize}`)
        if (generalCTAConfig.desktopLinkSize) classes.push(`m:${generalCTAConfig.desktopLinkSize}`)
        ctaLink.className = classes.join(' ')

        if (generalCTAConfig.target) {
          ctaLink.target = '_blank'
          ctaLink.rel = 'noopener noreferrer'
        }
        if (generalCTAConfig.ctaTextColor) ctaLink.style.color = generalCTAConfig.ctaTextColor
        if (generalCTAConfig.ctaBgColor) ctaLink.style.backgroundColor = generalCTAConfig.ctaBgColor
        atbContainer.appendChild(ctaLink)
      }
    } else if (isATBEnabled) {
      const atbButton = globalTooltip.querySelector(DATA_ATB_SELECTOR) as HTMLDivElement
      if (atbButton) {
        const onSizedProductClick = () => {
          openSizeDrawer({
            atbTooltip: globalTooltip,
            isMobile,
            tooltipPositions: positions,
            tooltipStyledPositions: positionsWithPx,
            screenWidth,
          })
        }
        const atbFromPortal = createPortal(
          <CmsAddToBagButton
            key={productId}
            productId={productId}
            showToastAlways={true}
            tileContainer={globalTooltip}
            atbButton={atbButton}
            disabled={false}
            analyticsData={hotspotAnalyticsData}
            onSizedProductClick={onSizedProductClick}
          />,
          atbButton
        )
        setAddToBagButtonOnEvent(atbFromPortal)
      }
    }
  }, [])

  const addListenersForHotspots = useCallback(
    (hotspots, element: HTMLElement, promotionId: string): (() => void) => {
      const hotspotIcons = element.querySelectorAll('.hotspot-icon') as NodeListOf<HTMLElement>
      if (!hotspotIcons.length) return () => {}

      const toggleTooltip = (hotspotIcon: HTMLElement, hotspot: Hotspot, event: MouseEvent) => {
        const isActive = hotspotIcon.classList.contains('active')
        clearActiveStates()
        if (!isActive) {
          const initialHotspotTooltipData = hotspot.target
          if (!initialHotspotTooltipData.includes('<')) {
            hotspotIcon.setAttribute(
              'data-promotion-name',
              `hotspot product id - ${initialHotspotTooltipData}`
            )
          } else {
            const match = initialHotspotTooltipData.match(/<a [^>]*>(.*?)<\/a>/)
            const hotspotLinkLabel = match ? match[1].replace(/<[^>]+>/g, '').trim() : promotionId
            hotspotIcon.setAttribute(
              'data-promotion-name',
              `hotspot link - ${hotspot.productId || hotspotLinkLabel}`
            )
          }
          hotspotIcon.setAttribute('data-promotion-id', `${promotionId}`)
          handlePromotionEvent(event, analytics.send)
          hotspotIcon.classList.add('active')
          showTooltip(hotspot, element, hotspotIcon, promotionId)
        }
      }

      const handleMouseEnter = (event: MouseEvent) => {
        const hotspotIcon = event.currentTarget as HTMLElement
        const hotspot = hotspots.find((h) => h.id === hotspotIcon.id)
        if (!hotspot) return
        toggleTooltip(hotspotIcon, hotspot, event)
      }

      const handleClick = (event: MouseEvent) => {
        event.stopPropagation()
        const hotspotIcon = event.currentTarget as HTMLElement
        const hotspot = hotspots.find((h) => h.id === hotspotIcon.id)
        if (!hotspot) return
        toggleTooltip(hotspotIcon, hotspot, event)
      }

      const componentRoot = element.closest('[data-component-value]')

      const handleMouseleave = (event: MouseEvent) => {
        const activeHotspot = componentRoot.querySelector('.hotspot-icon.active')
        if (!activeHotspot) return
        const target = event.relatedTarget as HTMLElement
        if (!target) return
        const isMovingToHotspot = target.closest('.hotspot-icon.active')
        const isMovingToTooltip = target.closest('.global-tooltip')
        const isMovingToSizedDrawer = target.closest('.hotspot-size-drawer')
        if (!isMovingToHotspot && !isMovingToTooltip && !isMovingToSizedDrawer) {
          clearActiveStates()
        }
      }

      hotspotIcons.forEach((hotspotIcon) => {
        if (isMobile) {
          hotspotIcon.addEventListener('click', handleClick)
        } else {
          hotspotIcon.addEventListener('mouseenter', handleMouseEnter)
        }
      })
      componentRoot?.addEventListener('mouseleave', handleMouseleave)

      return () => {
        hotspotIcons.forEach((hotspotIcon) => {
          if (isMobile) {
            hotspotIcon.removeEventListener('click', handleClick)
          } else {
            hotspotIcon.removeEventListener('mouseenter', handleMouseEnter)
          }
        })
        componentRoot?.removeEventListener('mouseleave', handleMouseleave)
      }
    },
    [showTooltip, isMobile]
  )

  const clearActiveStates = useCallback((): void => {
    closeHotspotATBTooltip()
    closeSizeDrawer()
    resetAddToBagButtonOnEvent()
  }, [])

  useEffect(() => {
    if (!node) return

    const parentElements = node.querySelectorAll('.mol-hotspots-image') as NodeListOf<HTMLElement>
    if (!parentElements.length) return

    const cleanupFunctions: Array<() => void> = []

    parentElements.forEach((parentElement) => {
      const hotspotsData = parentElement.querySelector('.hotspots-data') as HTMLElement
      if (!hotspotsData) return

      const config = getHotspotConfig(hotspotsData, isMobile)
      const promotionId = hotspotsData.getAttribute('promotionid')
      const hotspots = config?.hotspots as Hotspot[]
      if (!hotspots?.length) return

      const cleanup = addListenersForHotspots(hotspots, parentElement, promotionId)
      cleanupFunctions.push(cleanup)
    })

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isHotspotClick = target.closest('.hotspot-icon.active')
      const isTooltipClick = target.closest('.global-tooltip')
      const isSizedDrawerClick = target.closest('.hotspot-size-drawer')
      if (!isHotspotClick && !isTooltipClick && !isSizedDrawerClick) {
        clearActiveStates()
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
      document.removeEventListener('pointerdown', handleOutsideClick)
      productsDataMap.current.clear()
      clearImageClickListeners()
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort()
      }
      currentAbortControllerRef.current = null
    }
  }, [node, isMobile])

  return setNode
}

export default useHotspotsImage
