import { useMemo } from 'react'
import { Box, Button, Input, useClipboard } from '@chakra-ui/react'
import { SitePreviewShareUrlModalContentProps } from 'toro/components/SitePreview/sitePreviewTypes'
import { appendPreviewParams } from 'toro/helpers/sitePreview'
import { CloseIcon } from 'toro/icons'

const SitePreviewShareUrlModalContent = ({
  sitePreviewConfig,
  onClose,
}: SitePreviewShareUrlModalContentProps) => {
  const sharedUrl = useMemo(
    () => appendPreviewParams(window.location.href, sitePreviewConfig),
    [sitePreviewConfig]
  )

  const { onCopy } = useClipboard(sharedUrl)

  const handleCopy = () => {
    onCopy()
    onClose()
  }

  return (
    <>
      <CloseIcon
        height="24px"
        width="24px"
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        onClick={onClose}
      />
      <strong>Share preview URL</strong>
      <Box mt="5px" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Input readOnly value={sharedUrl} size="md" p="0px 8px" color="gray" />
        <Button width="140px" mt="10px" onClick={handleCopy}>
          Copy
        </Button>
      </Box>
    </>
  )
}

export default SitePreviewShareUrlModalContent
