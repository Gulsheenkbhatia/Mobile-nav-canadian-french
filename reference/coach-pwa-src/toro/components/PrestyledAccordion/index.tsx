import { type FC } from 'react'
import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Accordion from 'toro/components/Accordion'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import { type AccordionProps } from '@chakra-ui/react'

interface AccordionItemConfig {
  title: string
  content: JSX.Element
}

interface PrestyledAccordionProps extends AccordionProps {
  variant?: string
  accordionItems: AccordionItemConfig[]
  accordionTitle?: string
}

const PrestyledAccordion: FC<PrestyledAccordionProps> = ({
  variant,
  accordionItems = [],
  accordionTitle,
  ...accordionProps
}) => {
  const styles = useMultiStyleConfig('PrestyledAccordion', { variant })
  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')

  return (
    <Box sx={styles.rootWrapper}>
      <Flex flexDirection="column" sx={styles.wrapper}>
        {accordionTitle && (
          <Text size="sm" variant="body-primary" sx={styles.title}>
            {accordionTitle}
          </Text>
        )}
        <Accordion w="100%" sx={styles.accordionWrapper} {...accordionProps}>
          {accordionItems.map((item, idx) => (
            <AccordionItem
              w="100%"
              border="none"
              key={`accordion-item-${idx}-${item.title}`}
              sx={styles.accordionItem}
            >
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <AccordionButton sx={styles.button}>
                    <Text size="sm" variant="body-primary" sx={styles.buttonText}>
                      {item.title}
                    </Text>
                    {isExpanded ? (
                      <AccordionIconExpanded style={styles.icon} data-qa="icon-expanded" />
                    ) : (
                      <AccordionIcon style={styles.icon} data-qa="icon-collapsed" />
                    )}
                  </AccordionButton>
                  <AccordionPanel sx={styles.panel}>{item.content}</AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Box>
  )
}

export default PrestyledAccordion
