import { SystemStyleObject } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import { useIntl } from 'react-intl'
import useAnalytics from 'toro/analytics/useAnalytics'
import Flex from 'toro/components/Flex'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import usePreference from 'toro/hooks/usePreference_new'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'
import { SparkleIcon, EditorsNotesIcon } from 'toro/icons'

type ReviewSummaryProps = {
  styles: Record<string, SystemStyleObject>
  summary?: string
  showCta?: boolean
  ctaProps?: {
    onClick: () => void
    target: string
    rel: string
    link: string
  }
}

export default function ReviewSummary({ styles, summary, showCta, ctaProps }: ReviewSummaryProps) {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const productId = useSelectedVariantData('id')

  const {
    toggleSiteFeatures: { enableAiSummaryReview = false },
  } = usePreference({
    ToggleSiteFeatures: ['enableAiSummaryReview'],
  })

  const { ref: inViewRef } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        analytics.send('reviewInteraction', {
          eventLocation: 'product',
          eventAction: 'ai summary impression',
          eventLabel: productId,
        })
      }
    },
  })

  if (!summary || !enableAiSummaryReview) {
    return null
  }

  const title = formatMessage({
    id: 'pdp.product.reviewSummaryTitle',
    defaultMessage: 'What our customers think:',
  })

  const hint = formatMessage({
    id: 'pdp.product.reviewSummaryHint',
    defaultMessage: 'Buyer highlights, summarized by AI',
  })

  const writeAReviewCta = formatMessage({
    id: 'pdp.product.writeAReviewInSummary',
    defaultMessage: 'Write a Review',
  })

  return (
    <Flex ref={inViewRef} sx={styles.reviewSummaryContainer}>
      <Text sx={styles.reviewSummaryTitle}>{title}</Text>
      <Text sx={styles.reviewSummaryContent}>{summary}</Text>
      <Flex sx={styles.reviewSummaryHintContainer}>
        <Flex sx={styles.reviewSummaryHintIcon}>
          <SparkleIcon />
        </Flex>
        <Text sx={styles.reviewSummaryHintText}>{hint}</Text>
      </Flex>
      {showCta && (
        <Link
          href={ctaProps.link}
          rel={ctaProps.rel}
          target={ctaProps.target}
          onClick={ctaProps.onClick}
          sx={styles.reviewSummaryCta}
          data-qa="rnr_link_writerev"
        >
          <EditorsNotesIcon />
          <span>{writeAReviewCta}</span>
        </Link>
      )}
    </Flex>
  )
}
