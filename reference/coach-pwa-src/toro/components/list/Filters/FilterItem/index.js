import dynamic from 'next/dynamic'
import { memo, useCallback, useMemo } from 'react'
import camelCase from 'lodash/camelCase'
import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import AccordionItem from 'toro/components/AccordionItem'
import AccordionPanel from 'toro/components/AccordionPanel'
import AccordionButton from 'toro/components/AccordionButton'
import FilterBusyOverlay from 'toro/components/list/Filters/FilterBusyOverlay'
import { REFINEMENT_TYPE } from 'toro/helpers/refinements'
import {
  activeFiltersCountAtom,
  isFiltersDrawerAnimationCompleteAtom,
  isLoadFilterComponentsAtom,
} from 'store/search-results.atom'
import { useAtom } from 'jotai'

const FilterCheckboxes = dynamic(() => import('toro/components/list/Filters/FilterCheckboxes'), {
  ssr: false,
})
const FilterColors = dynamic(() => import('toro/components/list/Filters/FilterColors'), {
  ssr: false,
})
const FilterPrice = dynamic(() => import('toro/components/list/Filters/FilterPrice'), {
  ssr: false,
})
const FilterButtons = dynamic(() => import('toro/components/list/Filters/FilterButtons'), {
  ssr: false,
})

export const FILTERS_COMPONENTS = {
  [REFINEMENT_TYPE.DEFAULT]: (props) => <FilterButtons {...props} />,
  [REFINEMENT_TYPE.ATTRIBUTE]: (props) => <FilterButtons {...props} />,
  [REFINEMENT_TYPE.CHECKBOX]: (props) => <FilterCheckboxes {...props} />,
  [REFINEMENT_TYPE.COLOR]: (props) => <FilterColors {...props} />,
  [REFINEMENT_TYPE.PRICE]: (props) => <FilterPrice {...props} />,
  [REFINEMENT_TYPE.HIDDEN]: () => null,
}

function FilterItem({
  styles,
  isMobile,
  refinement,
  accordionIconExpanded,
  accordionIconCollapsed,
  handleAccordionButtonKeyDown,
}) {
  const loadFilterComponents = useLoadFilterComponents()

  return (
    <AccordionItem sx={styles.accordionSVG} onMouseEnter={loadFilterComponents}>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton
              sx={styles.accordionButton}
              onKeyDown={handleAccordionButtonKeyDown}
              data-qa="plpfltr_body_fltr_acord"
              _focus={{ outline: 'none' }}
            >
              <AccordionButtonText styles={styles.FilterAccordionText} refinement={refinement} />
              {isExpanded ? accordionIconExpanded : accordionIconCollapsed}
            </AccordionButton>
          </h2>
          <AccordionPanel
            px={0}
            pt={0}
            pb="l"
            sx={styles[refinement.type] ?? null}
            data-qa="d_plpfltr_body_fltr_acord_colpsd"
          >
            <FilterComponent isMobile={isMobile} styles={styles} refinement={refinement} />
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export function useLoadFilterComponents() {
  const [isLoadFilterComponents, setLoadFilterComponents] = useAtom(isLoadFilterComponentsAtom)

  return useCallback(() => {
    if (isLoadFilterComponents) return

    setLoadFilterComponents(true)
  }, [isLoadFilterComponents])
}

function FilterComponent({ isMobile, refinement, styles }) {
  const isLoadFilterComponents = useAtomValue(isLoadFilterComponentsAtom)
  const isFiltersDrawerAnimationComplete = useAtomValue(isFiltersDrawerAnimationCompleteAtom)

  /*
   * Desktop - waiting only for chunks
   * Mobile - waiting for chunks and open drawer animation complete
   * */
  if (!isLoadFilterComponents) return null
  const Component = FILTERS_COMPONENTS[refinement.type]

  if (!isMobile || isFiltersDrawerAnimationComplete) {
    return (
      <FilterBusyOverlay refinement={refinement} styles={styles}>
        <Component refinement={refinement} styles={styles} />
      </FilterBusyOverlay>
    )
  }

  return null
}

function useActiveOptionsCount({ refinementId }) {
  const activeFiltersMap = useAtomValue(activeFiltersCountAtom)

  return useMemo(() => activeFiltersMap?.[refinementId], [refinementId, activeFiltersMap])
}

function AccordionButtonText({ styles, refinement }) {
  const activeFilterCount = useActiveOptionsCount({ refinementId: refinement.id })

  return (
    <Box flex="1" textAlign="left" textTransform="uppercase">
      <Text
        variant="body-primary"
        size="md"
        data-qa={'plpfltr_txt_fltr_acord_title' + `_${camelCase(refinement.name)}`}
        sx={styles}
      >
        {activeFilterCount ? `${refinement.name} (${activeFilterCount})` : refinement.name}
      </Text>
    </Box>
  )
}

export default memo(FilterItem)
