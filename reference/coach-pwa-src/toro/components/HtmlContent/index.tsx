import {
  memo,
  useCallback,
  useEffect,
  useState,
  forwardRef,
  useRef,
  ForwardRefRenderFunction,
} from 'react'
import { useRouter } from 'next/router'
import Box from 'toro/components/Box'
import doLazyLoadImages from 'toro/helpers/lazyLoadImages'
import doLazyLoadVideos from 'toro/helpers/lazyLoadVideos'
import doPlaysInLine from 'toro/helpers/playsInLine'
import useViewportType from 'toro/hooks/useViewportType'
import {
  useMediaAssets,
  productsDrawerInit,
  shortsVideoControl,
  mainDesktopShortsVideoHandler,
} from 'toro/helpers/mediaAssets'
import useDataCompUrlClickHandler from 'toro/hooks/useDataCompUrlClickHandler'
import { useEmailCaptureSubmitHandle } from 'toro/helpers/handleSubmitSfccFormEmailCapture'
import { useCountdownBanner } from 'toro/helpers/bannerCountdown'
import { useFeatureBenefit } from 'toro/cms/hooks/useFeatureBenefit'
import { useHeroBannerInit } from 'toro/helpers/useHeroBannerInit'
import { applySplideSlidersForNode } from 'toro/helpers/home'
import { useModal } from 'toro/helpers/useModal'
import isFunction from 'lodash/isFunction'
import withPromoModal from 'toro/hocs/withPromoModal'
import { useAtomValue } from 'jotai/utils'
import { isSubBrandActiveAtom, subBrandAtom } from 'store/global.atom'
import { usePlpBlock } from 'toro/helpers/plpContentBlock'
import { useAccordionBlock } from 'toro/helpers/accordion'
import initializeSlotLinks from 'toro/helpers/initializeSlotLinks'
import useHotspotsImage from 'toro/cms/hooks/useHotspotsImage'
import { useShoppableVideoImage } from 'toro/helpers/shoppableVideoImage'
import { useTabbedContent } from 'toro/cms/hooks/useTabbedContent'
import { useTabbedSlider } from 'toro/cms/hooks/useTabbedSlider'
import { useContentHub } from 'toro/cms/hooks/useContentHub'
import { useArticleSubNav } from 'toro/cms/hooks/useArticleSubNav'
import { useCountdownClock } from 'toro/cms/hooks/useCountdownClock'
import { useMarqueeTicker } from 'toro/cms/hooks/useMarqueeTicker'
import useStaffStart from 'toro/hooks/useStaffStart'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import { useViewMore } from 'toro/cms/hooks/useViewMore'
import useSetHeaderHeightToAnchorMenu from 'toro/cms/hooks/useAnchorLinkMenu'
import useHydrateAddToBagButtons from 'toro/hooks/useHydrateAddToBagButtons'
import { useDropdownToggle } from 'toro/cms/hooks/useDropDownToggle'
import { useProductDrawer } from 'toro/cms/hooks/useProductDrawer'
import { useSliderPaginateValue } from 'toro/cms/hooks/useSliderPaginateValue'
import { useGiftConciergeLauncher } from 'toro/cms/hooks/useGiftConciergeLauncher'
import { PropsOf } from '@chakra-ui/react'
import { useFadeAnimationInitializer } from 'toro/hooks/useFadeAnimationInitializer'
import { useVideoModal } from 'toro/hooks/useVideoModal'

const BoxWithPromoModal = withPromoModal(Box)

interface HtmlContentProps extends PropsOf<typeof Box> {
  content: string
  lazyLoadImages?: boolean
  lazyLoadVideos?: boolean
  playsInLine?: boolean
  isPromoModal?: boolean
  onClickCmsAnalytics?: (event: React.MouseEvent) => void
  onSliderMove?: ((...args: any[]) => void) | null
}

function fireScriptForCoveredPromo(node) {
  if (!node) {
    return
  }

  const promoNode = node?.querySelector('.product-tile__container')

  if (!promoNode) {
    return
  }

  const coveredPromoElement = promoNode?.querySelector('#bridgeContainer')
  const coveredPromoScript = promoNode?.querySelector('script')?.innerHTML

  if (coveredPromoElement) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fireScriptCoveredPromo = new Function(coveredPromoScript)
      fireScriptCoveredPromo && fireScriptCoveredPromo?.()
    } catch (e) {
      console.error(e)
    }
  }
}

function setMediaSizesAttributes(type, current) {
  const medias = current?.querySelectorAll(type) || []
  medias.forEach((el, index) => {
    const defaultWidth = el.getAttribute('width')
    const defaultHeight = el.getAttribute('height')
    let targetWidth
    let targetHeight

    if (el.clientWidth) {
      targetWidth = el.clientWidth
      targetHeight = el.clientHeight
    } else {
      // check parent container
      let parent = el.parentElement
      if (!parent) {
        return
      }
      // if it's an image usually the closest parent is a <picture> so we skip that
      if (parent.tagName === 'PICTURE') {
        parent = parent.parentElement
      }
      targetWidth = parent.clientWidth
      targetHeight = parent.clientHeight
    }
    // Skip until layout is non-zero; otherwise responsive <picture> imgs (e.g. hotspot
    // banners) get width="0" and fail to paint until the next reflow, if at all.
    if (!targetWidth || !targetHeight) {
      return
    }
    medias[index].setAttribute('width', defaultWidth ? defaultWidth : targetWidth)
    medias[index].setAttribute('height', defaultHeight ? defaultHeight : targetHeight)
  })
}

const HtmlContent: ForwardRefRenderFunction<HTMLElement, HtmlContentProps> = (
  {
    content,
    lazyLoadImages = false,
    lazyLoadVideos = false,
    playsInLine = false,
    isPromoModal,
    onClickCmsAnalytics,
    onSliderMove = null,
    ...props
  },
  ref
) => {
  const [updatedContent, setUpdatedContent] = useState(content)
  const { isDesktop, viewport } = useViewportType()
  const cleanupFunctionsRef = useRef([])
  const setContentNode = useDataCompUrlClickHandler()
  const staffStart = useStaffStart()
  const rootNode = useRef(null)
  const { onClick } = useCmsAnalytics(rootNode)
  const initializeAiGiftConciergeLauncher = useGiftConciergeLauncher()

  useEffect(() => {
    setUpdatedContent(content)
  }, [content])

  const handleSubmitSfccFormEmailCapture = useEmailCaptureSubmitHandle(setUpdatedContent)
  const startCountdown = useCountdownBanner()
  const { initializeFeatureBenefit, isWithCollapsibleContent } = useFeatureBenefit()
  const { initializeDropdownToggle } = useDropdownToggle(isDesktop)
  const { initProductDrawerTriggers } = useProductDrawer()
  const mediaAssets = useMediaAssets(onClick)
  const heroBannerInit = useHeroBannerInit()
  const bannerModals = useModal()
  const hotspotsImage = useHotspotsImage()
  const router = useRouter()
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const subBrand = useAtomValue(subBrandAtom)
  const initializePlpBlock = usePlpBlock()
  const initializeAccordion = useAccordionBlock()
  const initializeShoppableVideoImage = useShoppableVideoImage()
  const initializeViewMore = useViewMore()
  useCountdownClock()
  const initializeMarqueeTicker = useMarqueeTicker()
  useTabbedContent()
  const initializeTabbedSlider = useTabbedSlider()
  const initializeContentHub = useContentHub(isDesktop)
  const initializeArticleSubNav = useArticleSubNav()
  const initializeAnchorMenu = useSetHeaderHeightToAnchorMenu()
  const { hydrateAddToBagButtons, addToBagButtons } = useHydrateAddToBagButtons()
  const initializeSlidePaginateValue = useSliderPaginateValue()
  const initializeFadeAnimation = useFadeAnimationInitializer()
  const { initVideoModalTriggers } = useVideoModal()

  const elRefSetter = useCallback(
    (node) => {
      if (node) {
        try {
          if (ref) {
            isFunction(ref) ? ref(node) : (ref.current = node)
          }
          rootNode.current = node
          setContentNode(node)
          startCountdown(node)
          initializeMarqueeTicker(node)
          mediaAssets(node)
          heroBannerInit(node)
          bannerModals(node)
          requestAnimationFrame(() => hotspotsImage(node))
          initializeSlotLinks(node, {
            onNavigation: (href: string) => {
              void router.push(href)
            },
            subBrand,
            isSubBrandActive,
          })
          if (!isDesktop || isWithCollapsibleContent(node)) {
            initializeFeatureBenefit(node)
          }
          if (isDesktop) {
            productsDrawerInit()
          }
          applySplideSlidersForNode(node, { lazyLoadImages, lazyLoadVideos, onSliderMove })
          hydrateAddToBagButtons(node)
          doLazyLoadImages(
            node,
            { lazyAttribute: 'data-loading', showImmediately: !lazyLoadImages },
            viewport
          )
          doLazyLoadVideos(node, {
            lazyAttribute: 'data-loading',
            viewport,
            showImmediately: !lazyLoadVideos,
          })
          if (playsInLine) {
            doPlaysInLine(node)
          }
          fireScriptForCoveredPromo(node)
          staffStart(node)
          setMediaSizesAttributes('img', node)
          setMediaSizesAttributes('video', node)
          handleSubmitSfccFormEmailCapture(node)
          initializePlpBlock(node)
          initializeAccordion(node)
          initializeShoppableVideoImage(node)
          initializeViewMore(node)
          initializeAnchorMenu(node)
          initializeDropdownToggle(node)
          initProductDrawerTriggers(node)
          initVideoModalTriggers(node)
          initializeTabbedSlider(node)
          initializeContentHub(node)
          initializeArticleSubNav(node)
          initializeSlidePaginateValue(node)
          initializeAiGiftConciergeLauncher(node)
          initializeFadeAnimation(node)
        } catch (e) {
          console.warn('error running side effects on HtmlContent', e)
        }
      }
    },
    [isDesktop]
  )

  useEffect(() => {
    shortsVideoControl(isDesktop)
    const cleanUpFunctions = mainDesktopShortsVideoHandler(isDesktop, onClickCmsAnalytics)
    if (cleanUpFunctions?.length) {
      cleanupFunctionsRef.current = [...cleanupFunctionsRef.current, ...cleanUpFunctions]
    }
    return () => {
      if (cleanupFunctionsRef.current.length) {
        cleanupFunctionsRef.current.forEach((cleanupFn) => cleanupFn?.())
        cleanupFunctionsRef.current = []
      }
    }
  }, [isDesktop, onClickCmsAnalytics])

  if (!updatedContent) {
    return null
  }

  return (
    <>
      <BoxWithPromoModal
        ref={elRefSetter}
        onClick={onClick}
        dangerouslySetInnerHTML={{ __html: updatedContent }}
        isPromoModal={isPromoModal}
        {...props}
      />
      {addToBagButtons}
    </>
  )
}

export default memo(forwardRef(HtmlContent))
