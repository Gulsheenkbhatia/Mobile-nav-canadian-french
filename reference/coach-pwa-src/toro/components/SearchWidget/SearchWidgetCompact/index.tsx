import { RefObject } from 'react'
import useDisclosure from 'toro/hooks/useDisclosure'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Drawer from 'toro/components/Drawer'
import DrawerBody from 'toro/components/DrawerBody'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerCloseButton from 'toro/components/DrawerCloseButton'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'

import SearchWidget from 'toro/components/SearchWidget'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { isSearchV2EnabledAtom, isSearchInDrawerActiveAtom } from 'store/search.atom'
import { MenuSearchIconV2 } from 'toro/icons'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

interface SearchWidgetCompactProps {
  onOpen?: () => void
  liveEventConfig?: Record<string, unknown>
}

const SearchWidgetCompact = ({ onOpen: onOpenProp, liveEventConfig }: SearchWidgetCompactProps) => {
  const setIsSearchInDrawerActive = useUpdateAtom(isSearchInDrawerActiveAtom)
  const isPdpv7Template = useTemplate([TemplateName.pdpv7])
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      setIsSearchInDrawerActive(true)
      onOpenProp?.()
    },
  })
  const {
    navFlyoutStylings: { enableNewNavMenu: isNewNavEnabled },
  } = usePreference({
    navFlyoutStylings: ['enableNewNavMenu'],
  })

  const isSearchV2Enabled = useAtomValue(isSearchV2EnabledAtom)
  const isNewNavOrSearchV2InDrawerActive = isNewNavEnabled || isSearchV2Enabled
  const styles = useMultiStyleConfig('SearchWidgetCompact', {
    variant: isNewNavOrSearchV2InDrawerActive ? 'mobileV2' : '',
  })

  const { SearchIcon } = useMultiStyleConfig('Icons')

  const focusInput = (inputRef: RefObject<HTMLInputElement>): void => {
    inputRef.current?.focus()
  }

  const handleClose = (): void => {
    onClose()
    setIsSearchInDrawerActive(false)
  }

  const searchWidgetVariant = isSearchV2Enabled
    ? 'searchV2'
    : isNewNavEnabled
    ? 'mobileV2'
    : 'mobile'

  return (
    <>
      <Box sx={styles.childrenStyle}>
        <Button
          sx={{
            ...styles.searchIconButton,
            ...(isPdpv7Template && {
              top: '0px',
            }),
          }}
          aria-label="Search"
          data-qa="cm_icon_search"
          size="content"
          variant="link"
          onClick={onOpen}
        >
          {isPdpv7Template ? (
            <MenuSearchIconV2 width="30px" height="20px" data-qa="pdpv7_btn_searchicon" />
          ) : (
            <SearchIcon />
          )}
        </Button>
      </Box>
      <Drawer isOpen={isOpen} placement={'left'} onClose={handleClose}>
        <DrawerOverlay>
          <DrawerContent sx={styles.drawerContent}>
            {!isSearchV2Enabled && <DrawerCloseButton sx={styles.drawerCloseButton} />}
            <DrawerBody p="0">
              <Flex flexDirection="column" height="100%" overflowX="hidden">
                <Box sx={styles.searchWidgetContainer}>
                  <SearchWidget
                    variant={searchWidgetVariant}
                    onNavigation={handleClose}
                    compact
                    focusInput={focusInput}
                    liveEventConfig={liveEventConfig}
                  />
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default SearchWidgetCompact
