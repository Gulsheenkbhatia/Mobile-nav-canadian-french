import { FC } from 'react'
import withSchemeValidation from 'toro/hocs/withSchemeValidation'
import useViewportType from 'toro/hooks/useViewportType'
import dynamic from 'next/dynamic'

const MobileRecommendations = dynamic(
  () =>
    import('toro/components/list/ThinkPage/ThinkGridRecommendations/MobileThinkRecommendations'),
  {
    ssr: false,
  }
)

const DesktopRecommendations = dynamic(
  () =>
    import('toro/components/list/ThinkPage/ThinkGridRecommendations/DesktopThinkRecommendations'),
  {
    ssr: false,
  }
)

type ThinkGridRecommendationsProps = {
  id: string
  viewMoreText: string
  viewLessText: string
  type: string
  content?: { html: string; id: string; hasVideo: boolean } | null
  title?: string
  subtitle?: string
}

const ThinkGridRecommendations: FC<ThinkGridRecommendationsProps> = (props) => {
  const { isDesktop } = useViewportType()

  if (isDesktop) {
    return <DesktopRecommendations {...props} />
  }

  return <MobileRecommendations {...props} />
}

export default withSchemeValidation(ThinkGridRecommendations, () => null)
