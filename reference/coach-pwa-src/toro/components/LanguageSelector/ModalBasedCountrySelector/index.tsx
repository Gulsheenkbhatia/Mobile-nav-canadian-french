import { KeyboardEvent, memo } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useDisclosure from 'toro/hooks/useDisclosure'
import SelectedCountryInfo from 'toro/components/LanguageSelector/SelectedCountryInfo'
import CountrySelectorModal from 'toro/components/LanguageSelector/ModalBasedCountrySelector/CountrySelectorModal'
import getKeyboardHandler from 'helpers/getKeyboardHandler'
import { ModalBasedCountrySelectorProps } from 'toro/components/LanguageSelector/types'
import { createAsyncStorage } from 'store/storage-utils'
import { STORAGE_IS_RETURNING_USER } from 'toro/constants/storageIds'

const MODAL_ID = 'countrySelector'
const ModalBasedCountrySelector = ({
  content,
  showPopupToNewVistorOnLanding,
}: ModalBasedCountrySelectorProps) => {
  const storage = createAsyncStorage(false)
  const isNewVisitor = !storage.getItem(STORAGE_IS_RETURNING_USER)
  const showPopupOnLanding = showPopupToNewVistorOnLanding && isNewVisitor

  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: showPopupOnLanding,
  })

  const handleKeydown = getKeyboardHandler(['Enter', 'Space'], (e: KeyboardEvent<HTMLElement>) => {
    e.preventDefault()
    onOpen()
  })

  return (
    <>
      <CountrySelectorModal
        id={MODAL_ID}
        content={content}
        showModal={isOpen}
        closeModal={onClose}
        showPopupOnLanding={showPopupOnLanding}
      />
      <Box
        position="relative"
        className="countrySelectorContainer"
        onClick={onOpen}
        onKeyDown={handleKeydown}
        tabIndex={0}
        aria-label="Country Selector Modal"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={MODAL_ID}
      >
        <Flex alignItems="center" cursor="pointer">
          <SelectedCountryInfo
            selector={content?.selector}
            enableArrow={Boolean(content?.dropdown?.items?.length)}
          />
        </Flex>
      </Box>
    </>
  )
}

export default memo(ModalBasedCountrySelector)
