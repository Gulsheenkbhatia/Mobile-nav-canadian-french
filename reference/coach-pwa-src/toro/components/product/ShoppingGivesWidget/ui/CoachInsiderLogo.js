import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import CoachInsiderIconSrc from 'components/assets/coach-insider.png'

export function CoachInsiderLogo({ styles }) {
  return (
    <Flex sx={styles}>
      <Image src={CoachInsiderIconSrc} alt="Coach Insider" ariaLabel="Coach Insider" lazy={false} />
    </Flex>
  )
}
