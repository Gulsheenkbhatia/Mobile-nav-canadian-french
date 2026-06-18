import { memo, useMemo } from 'react'
import Accordion from 'toro/components/Accordion'
import FilterItem from 'toro/components/list/Filters/FilterItem'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function FiltersAccordion({
  styles,
  isMobile,
  accordionRef,
  disableScroll,
  refinementsToRender,
  isKeyboardScrolling,
  handleAccordionChange,
  handleAccordionScroll,
  expandedRefinementIndexes,
  handleAccordionButtonKeyDown,
}) {
  const AccordionIcons = useAccordionIcons({ styles: styles.AccordionIconColor })

  return (
    <Accordion
      pr="m"
      mr="-m"
      allowToggle
      tabIndex="-1"
      allowMultiple
      ref={accordionRef}
      index={expandedRefinementIndexes}
      className={`${!disableScroll ? 'custom-scrollbar' : ''} ${
        isKeyboardScrolling ? 'is-keyboard-scrolling' : ''
      }`}
      _focus={{ outline: 'none' }}
      onScroll={handleAccordionScroll}
      onChange={handleAccordionChange}
      maxHeight={!isMobile ? `calc(100vh - 96px)` : null}
    >
      {refinementsToRender?.map((refinement) => (
        <FilterItem
          styles={styles}
          isMobile={isMobile}
          refinement={refinement}
          key={`filter-${refinement.id}`}
          accordionIconExpanded={AccordionIcons.IconExpanded}
          accordionIconCollapsed={AccordionIcons.IconCollapsed}
          handleAccordionButtonKeyDown={handleAccordionButtonKeyDown}
        />
      ))}
    </Accordion>
  )
}

function useAccordionIcons({ styles }) {
  const { AccordionIcon, AccordionIconExpanded } = useMultiStyleConfig('Icons')

  return useMemo(() => {
    const IconExpanded = (
      <AccordionIconExpanded sx={styles} data-qa="plpfltr_icon_fltr_acord_up_arrow" />
    )
    const IconCollapsed = <AccordionIcon sx={styles} data-qa="plpfltr_icon_fltr_acord_down_arrow" />

    return {
      IconExpanded,
      IconCollapsed,
    }
  }, [styles])
}

export default memo(FiltersAccordion)
