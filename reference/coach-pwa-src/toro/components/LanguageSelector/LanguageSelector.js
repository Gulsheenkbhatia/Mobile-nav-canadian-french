import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import SelectedCountryInfo from 'toro/components/LanguageSelector/SelectedCountryInfo'
import LanguagesDropdownContent from 'toro/components/LanguageSelector/LanguagesDropdownContent'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import LanguageSelectorModal from 'toro/components/LanguageSelector/LanguageSelectorModal'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const LanguageSelector = ({ content = {} }) => {
  const theme = useTheme()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [redirectLink, setRedirectLink] = useState('')
  const timeoutRef = useRef()
  const ref = useRef()
  const contentRef = useRef()
  const anchorsRef = useRef()
  const focusedAnchorIndexRef = useRef(-1)
  const styles = useMultiStyleConfig('LanguageSelector')

  const ariaLabel =
    content?.selector?.countryFullName &&
    content?.selector?.languageFullName &&
    content?.selector?.languageShortName
      ? `Choose a language for shopping in ${content?.selector?.countryFullName}. The current selection is ${content?.selector?.languageFullName} (${content?.selector?.languageShortName}).`
      : 'Language Selector Dropdown'

  useEffect(() => {
    if (isDropdownOpen && contentRef.current) {
      anchorsRef.current = Array.from(contentRef.current.querySelectorAll('a'))
      focusedAnchorIndexRef.current = -1
    }
  }, [isDropdownOpen])

  useOutsideClick({
    ref,
    handler: () => isDropdownOpen && hidePopover(),
  })

  const handleKeyDown = getKeyboardHandler(['Space', 'Enter', 'ArrowDown', 'ArrowUp'], (e) => {
    if (!isDropdownOpen && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault()
      showPopover()
      return
    }

    if (e.code === 'Tab' && e.target === ref.current) {
      const nextSibling = ref.current.nextElementSibling
      if (nextSibling) {
        nextSibling.querySelector('a')?.focus()
      }
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault()
      focusNextAnchor()
    } else if (e.code === 'ArrowUp') {
      e.preventDefault()
      focusPreviousAnchor()
    }
  })

  const clearTimer = useCallback(() => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const startTimer = useCallback((cb) => {
    clearTimer()
    timeoutRef.current = setTimeout(cb, 500)
  }, [])

  function focusNextAnchor() {
    if (focusedAnchorIndexRef.current < anchorsRef.current?.length - 1) {
      focusedAnchorIndexRef.current++
      anchorsRef.current[focusedAnchorIndexRef.current].focus()
    }
  }

  function focusPreviousAnchor() {
    if (focusedAnchorIndexRef.current > 0) {
      focusedAnchorIndexRef.current--
      anchorsRef.current[focusedAnchorIndexRef.current].focus()
    } else {
      focusedAnchorIndexRef.current = -1
      ref.current?.focus()
    }
  }

  function showPopover() {
    clearTimer()
    setIsDropdownOpen(true)
  }

  function hidePopover() {
    startTimer(() => setIsDropdownOpen(false))
  }

  function handleMouseEnter() {
    showPopover()
  }

  function handleMouseLeave() {
    hidePopover()
  }

  const handleBlur = (event) => {
    const isTargetParent = contentRef.current?.offsetParent?.offsetParent === event.target
    const isRelatedTargetInside = ref.current?.contains(event.relatedTarget)

    if (!isTargetParent && !isRelatedTargetInside) {
      hidePopover()
    }
  }

  return (
    <>
      <LanguageSelectorModal redirectLink={redirectLink} setRedirectLink={setRedirectLink} />
      <Box
        position="relative"
        tabIndex={0}
        ref={ref}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onBlur={handleBlur}
        sx={styles.languageSelectorContainer}
        className="countrySelectorContainer"
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        aria-label={ariaLabel}
      >
        <Flex alignItems="center" cursor="default">
          <SelectedCountryInfo
            selector={content?.selector}
            enableArrow={Boolean(content?.dropdown?.items?.length)}
          />
        </Flex>
        {isDropdownOpen && Boolean(content?.dropdown?.items?.length) && (
          <Box
            as="nav"
            position="absolute"
            top="0"
            left="0"
            zIndex={theme.zIndex.popover}
            sx={styles.languageDropdown}
            className="dropdownContainer"
            role="menu"
            aria-label="Language options"
          >
            <LanguagesDropdownContent
              ref={contentRef}
              content={content?.dropdown}
              selectedFlag={content?.selector?.flag}
              setRedirectLink={setRedirectLink}
            />
          </Box>
        )}
      </Box>
    </>
  )
}

export default memo(LanguageSelector)
