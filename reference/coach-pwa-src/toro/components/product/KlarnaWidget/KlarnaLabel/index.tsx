import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Button from 'toro/components/Button'
import { useMultiStyleConfig } from '@chakra-ui/react'
import InfoIcon from 'toro/icons/Info.svg'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'

type KlarnaLabelProps = {
  textMain: { value: string }
  learnMoreLabel?: { url: string }
  logo?: { alt: string; url?: string }
  onClick: () => void
  onMouseEnter: () => void
}

const KlarnaLabel = ({
  textMain,
  logo,
  learnMoreLabel,
  onClick,
  onMouseEnter,
}: KlarnaLabelProps) => {
  const isPDPv5Enabled = useTemplate([TemplateName.pdpv5])
  const styles = useMultiStyleConfig('KlarnaWidgetTheme')

  return (
    <Flex
      wrap="wrap"
      data-qa={isPDPv5Enabled ? 'Klarna_Pay' : 'cm_body_pdt_pomocallout'}
      sx={styles?.container}
      className="klarna-container"
      mt="none"
    >
      {textMain?.value && (
        <Box sx={styles.details} className="klarna-details">
          {textMain?.value}
          {logo?.alt && (
            <Image
              showAs="span"
              imgResponsive={{ width: '42px', height: 'auto' }}
              m="0 4px"
              src={logo.url}
              alt={logo.alt}
              lazy
              fetchpriority="low"
              containerProps={{
                display: 'inline-flex',
                verticalAlign: { base: 'bottom', md: 'baseline' },
              }}
            />
          )}
          {learnMoreLabel?.url && (
            <Button
              sx={styles.details}
              className="klarna-learn-more"
              variant="link"
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              data-qa="Klarna_Learn_More_CTA"
            >
              <InfoIcon viewBox="0 0 16 16" />
            </Button>
          )}
        </Box>
      )}
    </Flex>
  )
}

export default KlarnaLabel
