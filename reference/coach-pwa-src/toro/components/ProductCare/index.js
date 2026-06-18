import React from 'react'
import Head from 'next/head'
import Accordion from 'toro/components/Accordion'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionPanel from 'toro/components/AccordionPanel'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import HtmlContent from 'toro/components/HtmlContent'
import AccordionIcon from 'toro/components/AccordionIcon'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const ProductCare = ({
  html = undefined,
  style = undefined,
  accordion = undefined,
  items = undefined,
}) => {
  if (!html && !items) {
    return null
  }
  return (
    <Flex flex="1 1 auto" mt="35px">
      <Head>
        <style id="product-care-style">{style}</style>
      </Head>
      {!accordion && html && <HtmlContent content={html} />}
      {accordion && items && (
        <Accordion allowToggle minWidth="100%">
          {items.map((el, i) => (
            <AccordionItem key={i} id={i}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <HtmlContent content={el.title} />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {el.nestedItems ? (
                  <Accordion>
                    {el.nestedItems.map((ele, ind) => (
                      <AccordionItem key={`${i}${ind}`} id={`${i}${ind}`}>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <HtmlContent content={ele.title} />
                          </Box>
                        </AccordionButton>
                        <AccordionPanel>
                          <HtmlContent content={ele.content} />
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <HtmlContent content={el.content} />
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Flex>
  )
}

export default withErrorBoundaryWrapper(ProductCare)
