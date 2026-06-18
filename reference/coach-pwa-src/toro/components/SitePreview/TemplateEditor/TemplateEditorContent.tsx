import { type FC, useState } from 'react'
import type { UseDisclosureProps } from '@chakra-ui/hooks'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import TemplateTree from 'toro/components/SitePreview/TemplateEditor/TemplateTree'
import StylesProvider from 'toro/components/StylesProvider'
import { useResetAtom, useUpdateAtom } from 'jotai/utils'
import { applyTemplatePreviewAtom, pdpTemplateEditorAtom } from 'store/pdp-template-editor.atom'
import TemplateChangesView from 'toro/components/SitePreview/TemplateEditor/TemplateChangesView'
import useToast from 'toro/hooks/useToast'

type TemplateEditorContentProps = {
  onClose: UseDisclosureProps['onClose']
  onSitePreviewModalClose: UseDisclosureProps['onClose']
}

const TemplateEditorContent: FC<TemplateEditorContentProps> = ({
  onClose,
  onSitePreviewModalClose,
}) => {
  const styles = useMultiStyleConfig('TemplateEditor')
  const resetToDefault = useResetAtom(pdpTemplateEditorAtom)
  const applyChanges = useUpdateAtom(applyTemplatePreviewAtom)
  const toast = useToast()
  const [showChangesView, setShowChangesView] = useState(false)

  const applyChangesHandler = () => {
    applyChanges()
    onSitePreviewModalClose()
    toast({
      description: 'Your changes have been saved and the template is now live',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const toggleShowChangesView = () => {
    setShowChangesView((isVisible) => !isVisible)
  }

  return (
    <StylesProvider value={styles}>
      {showChangesView ? (
        <TemplateChangesView onClose={toggleShowChangesView} />
      ) : (
        <>
          <Box as="h3" sx={styles.title}>
            PDP Template Editor
          </Box>
          <Box sx={styles.main}>
            <TemplateTree />
          </Box>
          <Box sx={styles.footer}>
            <Button onClick={onClose}>Back</Button>
            <Button bg="red.600" onClick={resetToDefault}>
              Reset to Default
            </Button>
            <Button bg="green.600" onClick={applyChangesHandler}>
              Apply Changes
            </Button>
            <Button bg="gray.600" onClick={toggleShowChangesView}>
              View Changes
            </Button>
          </Box>
        </>
      )}
    </StylesProvider>
  )
}

export default TemplateEditorContent
