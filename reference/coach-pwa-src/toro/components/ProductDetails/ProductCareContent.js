import { memo } from 'react'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductCare from 'toro/components/ProductCare'
import CustomSlot from 'toro/cms/components/CustomSlot'
import Accordion from 'toro/components/Accordion'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionPanel from 'toro/components/AccordionPanel'
import isEmpty from 'lodash/isEmpty'

const ProductCareContent = ({ productCare }) => {
  const styles = useMultiStyleConfig('ProductDetailsItem')
  const { AccordionIconExpanded, AccordionIcon } = useMultiStyleConfig('Icons')

  return (
    <>
      {!isEmpty(productCare) && !productCare.content?.hasAccordion && (
        <CustomSlot content={productCare} Component={ProductCare} ignoreHidden="true" />
      )}
      {!isEmpty(productCare) && productCare.content?.hasAccordion && (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: String(productCare.content?.productCareSummary),
            }}
          />
          <br />
          <Accordion allowToggle>
            {(productCare.content?.productCareContent || []).map((pc, idx) => (
              <AccordionItem key={idx}>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton sx={styles.productCareModalButton}>
                        <Box flex="1" textAlign="left">
                          <div dangerouslySetInnerHTML={{ __html: String(pc?.title) }} />
                        </Box>
                        {isExpanded ? (
                          <AccordionIconExpanded width="16px" />
                        ) : (
                          <AccordionIcon width="16px" />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel sx={styles.productCareModalPanel}>
                      <div dangerouslySetInnerHTML={{ __html: String(pc?.body) }} />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </>
  )
}

ProductCareContent.propTypes = {
  productCare: PropTypes.object,
}

ProductCareContent.defaultProps = {
  productCare: {},
}

export default withErrorBoundaryWrapper(memo(ProductCareContent))
