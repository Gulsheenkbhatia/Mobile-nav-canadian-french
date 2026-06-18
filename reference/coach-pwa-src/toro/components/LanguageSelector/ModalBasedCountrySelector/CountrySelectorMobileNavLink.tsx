import { useCallback } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import useDisclosure from 'toro/hooks/useDisclosure'
import NavLink from 'toro/components/header/NavLink'
import CountrySelectorModal from 'toro/components/LanguageSelector/ModalBasedCountrySelector/CountrySelectorModal'
import { createAsyncStorage } from 'store/storage-utils'
import { STORAGE_IS_RETURNING_USER } from 'toro/constants/storageIds'

const CountrySelectorMobileNavLink = ({ content, showPopupToNewVistorOnLanding, ...linkProps }) => {
  const setIsMobileMenuVisible = useUpdateAtom(isMobileMenuVisibleAtom)
  const storage = createAsyncStorage(false)
  const isNewVisitor = !storage.getItem(STORAGE_IS_RETURNING_USER)
  const showPopupOnLanding = showPopupToNewVistorOnLanding && isNewVisitor

  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: showPopupOnLanding,
  })

  const handleOpenModal = useCallback(() => {
    setIsMobileMenuVisible(false)
    onOpen()
  }, [setIsMobileMenuVisible, onOpen])

  return (
    <>
      <CountrySelectorModal
        id="mobileCountrySelector"
        content={content}
        showModal={isOpen}
        closeModal={onClose}
        showPopupOnLanding={showPopupOnLanding}
      />
      <NavLink {...linkProps} handleClick={handleOpenModal} />
    </>
  )
}

export default CountrySelectorMobileNavLink
