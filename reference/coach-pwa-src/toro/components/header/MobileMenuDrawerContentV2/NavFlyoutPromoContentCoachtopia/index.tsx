import { memo } from 'react'
import { useIntl } from 'react-intl'
import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import type { SystemStyleObject } from '@chakra-ui/react'
import { GlobeIcon } from 'toro/icons'

type NavFlyoutPromoContentProps = {
  content: { pictureHtml: string; styles?: string }
  url: string
  styles: Record<string, SystemStyleObject>
  onClose: () => void
}

const NavFlyoutPromoContentCoachtopia = ({
  content,
  url,
  styles,
  onClose,
}: NavFlyoutPromoContentProps) => {
  const { pictureHtml, styles: pictureStyles } = content
  const { formatMessage } = useIntl()
  return (
    <Box sx={styles?.navFlyoutPromoContent}>
      <HtmlContent content={pictureHtml} sx={pictureStyles} />
      <Link href={url} onClick={onClose}>
        <Button sx={styles?.navFlyoutCTAButton} data-qa="btn_goToCoachtopia">
          <Text variant="body-text-secondary">
            {formatMessage({
              id: 'header.flyoutDrawer.coachtopiaCTA',
              defaultMessage: 'Go to Coachtopia',
            })}
          </Text>
          <GlobeIcon width="16px" height="16px" />
        </Button>
      </Link>
    </Box>
  )
}

export default memo(NavFlyoutPromoContentCoachtopia)
