import Link from 'toro/components/Link'
import Flex from 'toro/components/Flex'
import ImageCoachtopia from '@tapestry-inc/design-tokens/coachtopia/logo/primary-black.svg'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import Divider from 'toro/components/Divider'
import useAnalytics from 'toro/analytics/useAnalytics'

type CoachtopiaLogoButtonProps = {
  divider?: 'horizontal' | 'vertical'
  variant?: 'hp' | 'plp' | 'pdp'
  eventPageLocation?: string
}

const CoachtopiaLogoButton = ({
  divider,
  variant,
  eventPageLocation,
}: CoachtopiaLogoButtonProps) => {
  const {
    coachtopia: {
      coachtopiaHomeURL = '/shop/coachtopia',
      enableCoachtopiaButton = { enable: false, backgroundColor: 'var(--color-white-base)' },
    },
  } = usePreference({
    coachtopia: ['coachtopiaHomeURL', 'enableCoachtopiaButton'],
  })
  const styles = useMultiStyleConfig('CoachtopiaLogoButton', { variant })
  const analytics = useAnalytics()

  const handleClick = () => {
    analytics.send('navClick', {
      eventLocation: 'sub nav',
      text: 'coachtopia',
      eventPageLocation,
    })
  }

  if (!enableCoachtopiaButton?.enable) {
    return null
  }

  return (
    <Flex sx={styles.wrapper} data-qa="coachTopiaBtn">
      <Link
        href={coachtopiaHomeURL}
        sx={{
          ...styles.link,
          ...{ backgroundColor: enableCoachtopiaButton?.backgroundColor },
        }}
        onClick={handleClick}
      >
        <ImageCoachtopia />
      </Link>
      {divider && <Divider orientation={divider} />}
    </Flex>
  )
}

export default CoachtopiaLogoButton
