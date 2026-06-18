import { Button } from '@chakra-ui/react'
import { SitePreviewShareUrlButtonProps } from 'toro/components/SitePreview/sitePreviewTypes'

const SitePreviewShareUrlButton = ({
  onOpen,
  isSitePreviewDataSet,
}: SitePreviewShareUrlButtonProps) => {
  return (
    <Button
      ml="20px"
      {...(isSitePreviewDataSet
        ? { onClick: onOpen }
        : {
            sx: {
              filter: 'contrast(30%)',
              cursor: 'default',
              opacity: 1,
              '&:hover': {
                backgroundColor: 'var(--color-primary) !important',
              },
            },
          })}
    >
      Share
    </Button>
  )
}

export default SitePreviewShareUrlButton
