import { useState, useMemo, useCallback, useEffect } from 'react'
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import SitePreviewIcon from 'toro/components/SitePreview/SitePreviewIcon'
import SitePreviewModalContent from 'toro/components/SitePreview/SitePreviewModalContent'
import SitePreviewShareUrlButton from 'toro/components/SitePreview/SitePreviewShareUrlButton'
import SitePreviewResetButton from 'toro/components/SitePreview/SitePreviewResetButton'
import SiteCacheClearModalContent from 'toro/components/SitePreview/SiteCacheClearModal'
import SitePreviewShareUrlModal from 'toro/components/SitePreview/SitePreviewShareUrlModal'
import usePreference from 'toro/hooks/usePreference_new'
import { isSitePreviewActiveAtom, sitePreviewAtom } from 'store/site-preview.atom'
import { useAtomValue } from 'jotai/utils'
import Cookies from 'js-cookie'
import { COOKIE_SITE_PREVIEW } from 'toro/constants/cookies'
import ExperimentsModalContent from './ExperimentsModalContent'
import SitePreferencesModalContent from './SitePreferencesModalContent'
import ProductDetailsTooltipModalContent from './ProductDetailsTooltipModalContent'
import TemplateEditorContent from 'toro/components/SitePreview/TemplateEditor/TemplateEditorContent'

export default function SitePreview() {
  const [showShareUrlButton, setShowShareUrlButton] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenShareUrlModal,
    onOpen: onOpenShareUrlModal,
    onClose: onCloseShareUrlModal,
  } = useDisclosure({
    onClose: () => setShowShareUrlButton(false),
  })

  const {
    generalConfiguration: { enableNewGlobalHeader },
  } = usePreference({
    generalConfiguration: ['enableNewGlobalHeader'],
  })

  const {
    isOpen: isOpenSiteClearCacheModal,
    onOpen: onOpenSiteClearCacheModal,
    onClose: onCloseSiteClearCacheModal,
  } = useDisclosure()

  const {
    isOpen: isExperimentsModalOpen,
    onOpen: onOpenExperimentsModal,
    onClose: onCloseExperimentsModal,
  } = useDisclosure()

  const {
    isOpen: isPreferencesModalOpen,
    onOpen: onOpenPreferencesModal,
    onClose: onClosePreferencesModal,
  } = useDisclosure()

  const {
    isOpen: isTemplateEditorModalOpen,
    onOpen: onOpenTemplateEditorModal,
    onClose: onCloseTemplateEditorModal,
  } = useDisclosure()

  const {
    isOpen: isProductDetailsTooltipModalOpen,
    onOpen: onOpenProductDetailsTooltipModal,
    onClose: onCloseProductDetailsTooltipModal,
  } = useDisclosure()

  const hoverHandlers = useMemo(() => {
    return {
      onMouseEnter: () => setShowShareUrlButton(true),
      onMouseLeave: () => setShowShareUrlButton(false),
    }
  }, [])
  const { sitePreviewConfig } = useAtomValue(sitePreviewAtom)
  const isSitePreviewActive = useAtomValue(isSitePreviewActiveAtom)

  const onPreviewButtonClick = useCallback((e) => {
    e.target.blur()
    onOpen()
  }, [])

  useEffect(() => {
    if (sitePreviewConfig) {
      Cookies.set(COOKIE_SITE_PREVIEW, JSON.stringify(sitePreviewConfig), {
        secure: true,
        sameSite: 'None',
      })
    }
  }, [])

  const renderAlternativeModal = () => {
    switch (true) {
      case isPreferencesModalOpen:
        return <SitePreferencesModalContent onClose={onClosePreferencesModal} onSubmit={onClose} />
      case isExperimentsModalOpen:
        return <ExperimentsModalContent onClose={onCloseExperimentsModal} />
      case isTemplateEditorModalOpen:
        return (
          <TemplateEditorContent
            onClose={onCloseTemplateEditorModal}
            onSitePreviewModalClose={onClose}
          />
        )
      case isProductDetailsTooltipModalOpen:
        return (
          <ProductDetailsTooltipModalContent
            onClose={onCloseProductDetailsTooltipModal}
            onSubmit={onClose}
          />
        )
      default:
        return (
          <SitePreviewModalContent
            onClose={onClose}
            onOpenSiteClearCacheModal={onOpenSiteClearCacheModal}
            onOpenPreferencesModal={onOpenPreferencesModal}
            openExperimentsModal={onOpenExperimentsModal}
            onOpenProductDetailsTooltipModal={onOpenProductDetailsTooltipModal}
            onOpenTemplateEditorModal={onOpenTemplateEditorModal}
          />
        )
    }
  }

  return (
    <>
      <Box
        position="fixed"
        top={enableNewGlobalHeader ? undefined : 0}
        bottom={enableNewGlobalHeader ? 0 : undefined}
        left="0"
        zIndex="999"
        {...hoverHandlers}
      >
        <Button onClick={onPreviewButtonClick}>
          <SitePreviewIcon />
        </Button>
        {isSitePreviewActive && <SitePreviewResetButton />}
        {showShareUrlButton && (
          <SitePreviewShareUrlButton
            onOpen={onOpenShareUrlModal}
            isSitePreviewDataSet={isSitePreviewActive}
          />
        )}
      </Box>
      <SitePreviewShareUrlModal
        isOpen={isOpenShareUrlModal}
        onClose={onCloseShareUrlModal}
        sitePreviewConfig={sitePreviewConfig}
        isSitePreviewDataSet={isSitePreviewActive}
      />
      <SiteCacheClearModalContent
        isOpen={isOpenSiteClearCacheModal}
        onClose={onCloseSiteClearCacheModal}
      />
      <Modal
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent minWidth="300px" p="10px" overflowY="scroll">
          {renderAlternativeModal()}
        </ModalContent>
      </Modal>
    </>
  )
}
