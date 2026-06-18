import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtom } from 'jotai'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import { useCallback, useEffect, useState, useRef } from 'react'
import Slide, { SlideTransitionState } from 'toro/components/Slide'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Portal from 'toro/components/Portal'
import useTheme from 'toro/hooks/useTheme'
import { CloseHamburgerIcon, CloseIconV2 as CloseHamburgerIconV2 } from 'toro/icons'
import { SystemStyleObject } from '@chakra-ui/react'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  setSearchTermAtom,
  setExposedSearchStatusAtom,
  isSearchV2InDrawerActiveAtom,
} from 'store/search.atom'
import withOffload from 'toro/hocs/withOffload'

import MobileMenuDrawerContentV2 from 'toro/components/header/MobileMenuDrawerContentV2'
import MobileMenuDrawerContent from 'toro/components/header/MobileMenuDrawerContent'
import get from 'lodash/get'

const MobileMenu = () => {
  const {
    navFlyoutStylings: { enableNewNavMenu: isNewNavEnabled },
    generalConfiguration: { enableNewGlobalHeader },
    xgenPreferences: { searchV2Features },
    oneSite: { enableOneSite = false },
  } = usePreference({
    navFlyoutStylings: ['enableNewNavMenu'],
    generalConfiguration: ['enableNewGlobalHeader'],
    xgenPreferences: ['searchV2Features'],
    OneSite: ['enableOneSite'],
  })

  const searchOverlayRedesign = get(searchV2Features, 'SearchOverlayRedesign', false)
  const isSearchV2InDrawerActive = useAtomValue(isSearchV2InDrawerActiveAtom)
  const isNewNavOrSearchV2InDrawerActive = isNewNavEnabled || isSearchV2InDrawerActive
  const styles = useMultiStyleConfig('MobileMenu', {
    variant: isNewNavOrSearchV2InDrawerActive && 'mobileMenuV2',
  })

  const theme = useTheme()
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useAtom(isMobileMenuVisibleAtom)
  const [isVisible, setIsVisible] = useState(false)
  const activeT1ItemRef = useRef(null)
  const setSearchTerm = useUpdateAtom(setSearchTermAtom)
  const setExposedSearchStatus = useUpdateAtom(setExposedSearchStatusAtom)
  const onClose = useCallback(() => {
    setIsMobileMenuVisible(false)
    setSearchTerm('')
    if (searchOverlayRedesign) {
      setExposedSearchStatus(false)
    }
  }, [setIsMobileMenuVisible, setSearchTerm, setExposedSearchStatus])

  const handleOnAnimationComplete = (state: SlideTransitionState) => {
    const isEnter = state === 'enter'
    setIsVisible(isEnter)
    if (isNewNavEnabled && activeT1ItemRef.current && isEnter) {
      activeT1ItemRef.current.scrollIntoView({ block: 'nearest', inline: 'center' })
    }
  }

  useEffect(() => {
    if (isMobileMenuVisible) {
      setIsVisible(true)
      toggleBodyScroll(false)
    } else {
      toggleBodyScroll(true)
    }
    return () => {
      toggleBodyScroll(true)
    }
  }, [isMobileMenuVisible])

  const MobileDrawerContent = isNewNavEnabled ? MobileMenuDrawerContentV2 : MobileMenuDrawerContent

  const [loadMobileDrawerContent, OffloadedMobileDrawerContent] = withOffload(MobileDrawerContent, {
    forceLoad: isMobileMenuVisible,
  })

  useEffect(() => {
    const callbackId = requestIdleCallback(() => {
      loadMobileDrawerContent()
    })
    return () => cancelIdleCallback(callbackId)
  }, [])

  const shouldRenderCloseButton = !isSearchV2InDrawerActive && !enableOneSite

  return (
    <Portal>
      <Box
        sx={styles.mobileMenuContainer}
        display={isVisible ? 'block' : 'none'}
        className={isMobileMenuVisible ? 'drawerOpened' : null}
      >
        <Box
          sx={(styles.mobileMenuDrawerContainer as (boolean) => SystemStyleObject)?.(
            isMobileMenuVisible
          )}
          onClick={onClose}
        >
          <Box sx={styles.contentContainer}>
            <Box w="100%">
              <Slide
                direction={enableNewGlobalHeader ? 'right' : 'left'}
                in={isMobileMenuVisible}
                sx={styles?.drawerWrapper}
                className={isNewNavOrSearchV2InDrawerActive ? '' : 'default'}
                onClick={(e) => e.stopPropagation()}
                onAnimationComplete={handleOnAnimationComplete}
              >
                <Box sx={styles.menuBody} p="0">
                  {shouldRenderCloseButton && (
                    <Button
                      variant="unstyled"
                      right={'unset'}
                      minWidth="none"
                      left={`calc(100vw - ${theme.space.xl})`}
                      onClick={onClose}
                      sx={styles?.closeButton}
                    >
                      {isNewNavEnabled ? (
                        <CloseHamburgerIconV2 aria-hidden data-qa="m_btn_hamburger_close_x" />
                      ) : (
                        <CloseHamburgerIcon
                          fill="white"
                          focusable="false"
                          aria-hidden
                          data-qa="m_btn_hamburger_close_x"
                        />
                      )}
                    </Button>
                  )}
                  <OffloadedMobileDrawerContent
                    styles={styles}
                    isOpen={isMobileMenuVisible}
                    onClose={onClose}
                    activeT1ItemRef={activeT1ItemRef}
                  />
                </Box>
              </Slide>
            </Box>
          </Box>
        </Box>
      </Box>
    </Portal>
  )
}

export default MobileMenu
