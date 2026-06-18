import { useState, memo, useEffect, useCallback } from 'react'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import CloseButton from 'toro/components/CloseButton'
import Drawer from 'toro/components/Drawer'
import Box from 'toro/components/Box'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { selectedSizeAtom, setSelectedSizeAtom, recommendedFitGuideSizeAtom } from 'store/pdp.atom'
import StylesProvider from 'toro/components/StylesProvider'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import SelectSizeContainer from 'toro/components/product/mobile/v7/SizeSelectorModern/SelectSizeContainer'
import FitGuide from 'toro/components/product/mobile/v7/SizeSelectorModern/FitGuide'

type View = 'sizes' | 'fitGuide'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const SelectSizeDrawer = ({ isOpen, onClose }: Props) => {
  const styles = useMultiStyleConfig('SizeSelectorModern')
  const confirmedSize = useAtomValue(selectedSizeAtom)
  const setConfirmedSize = useUpdateAtom(setSelectedSizeAtom)
  const recommendedSize = useAtomValue(recommendedFitGuideSizeAtom)
  const [draftSize, setDraftSize] = useState<string>(confirmedSize)
  const [view, setView] = useState<View>('sizes')

  useEffect(() => {
    if (isOpen) {
      setDraftSize(confirmedSize)
      setView('sizes')
    }
  }, [isOpen, confirmedSize])

  const handleConfirm = useCallback(() => {
    setConfirmedSize(draftSize)
    onClose()
  }, [draftSize, setConfirmedSize, onClose])

  const handleOpenFitGuide = useCallback(() => setView('fitGuide'), [])
  const handleClose = useCallback(() => {
    setView('sizes')
    onClose()
  }, [onClose])

  const isFullScreen = view === 'fitGuide'

  const handleNotifyClick = useCallback(() => {
    setDraftSize('')
    onClose()
  }, [draftSize, setConfirmedSize, onClose])
  return (
    <StylesProvider value={styles}>
      <Drawer placement="bottom" isOpen={isOpen} onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent
          borderTopRadius={'2xl'}
          sx={styles.shoeSizeDrawerContent}
          height={isFullScreen ? '80vh' : 'auto'}
        >
          {isFullScreen && (
            <CloseButton sx={styles.shoeSizeDrawerCloseButton} onClick={() => setView('sizes')} />
          )}

          {!isFullScreen && <Box sx={styles.shoeSizeDrawerBar} />}
          {view === 'sizes' && (
            <SelectSizeContainer
              draftSize={draftSize}
              onChangeSize={setDraftSize}
              onConfirm={handleConfirm}
              onOpenFitGuide={handleOpenFitGuide}
              recommendedSize={recommendedSize}
              onNotifyClick={handleNotifyClick}
            />
          )}
          {view === 'fitGuide' && <FitGuide draftSize={draftSize} />}
        </DrawerContent>
      </Drawer>
    </StylesProvider>
  )
}

export default memo(SelectSizeDrawer)
