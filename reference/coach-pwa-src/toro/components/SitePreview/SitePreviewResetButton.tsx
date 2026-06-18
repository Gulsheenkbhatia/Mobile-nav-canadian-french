import { Button } from '@chakra-ui/react'
import SitePreviewResetIcon from 'toro/components/SitePreview/SitePreviewResetIcon'
import { stopPreviewHandler } from 'toro/helpers/sitePreview'

const SitePreviewResetButton = () => {
  return (
    <Button
      ml="5"
      onClick={() => {
        stopPreviewHandler()
      }}
    >
      <SitePreviewResetIcon />
    </Button>
  )
}

export default SitePreviewResetButton
