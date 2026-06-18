import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import isArray from 'lodash/isArray'
import { WorkIcon, EverydayIcon, PartyIcon, BeachIcon, TravelIcon } from 'toro/icons'

const iconComponents = {
  work: WorkIcon,
  everyday: EverydayIcon,
  party: PartyIcon,
  beach: BeachIcon,
  travel: TravelIcon,
}

const getBenefitIcon = (icon) => {
  const IconComponent = iconComponents[icon]
  return IconComponent ? <IconComponent width={16} height={16} /> : null
}

export default function BenefitsModule({ benefits, benefitsTitle, variant }) {
  const styles = useMultiStyleConfig('BenefitsModule', { variant })

  if (!isArray(benefits) || benefits?.length < 2) {
    return null
  }

  return (
    <Box className="occasion-module" sx={styles.benefitsContainer}>
      <Text sx={styles.benefitsTitle}>{benefitsTitle}</Text>
      <Flex align="center" sx={styles.benefitsItemsWrapper} data-qa="m_pdp_occasion_module">
        {benefits?.map(({ benefit, benefitImage }, idx) => (
          <Flex align="center" key={`${idx}-${benefitImage}`} sx={styles.benefitItem}>
            {benefitImage && (
              <Box padding="var(--spacing-2)" bg="#f7f7f7" borderRadius="50%">
                {getBenefitIcon(benefitImage)}
              </Box>
            )}
            <Text sx={styles.benefitText(benefitImage)}>{benefit}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}
