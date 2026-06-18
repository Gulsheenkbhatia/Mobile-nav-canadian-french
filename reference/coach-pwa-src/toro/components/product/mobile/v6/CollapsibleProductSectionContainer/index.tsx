import { type FC, Fragment, ReactNode } from 'react'
import { useExpandableAccordionLogic } from 'toro/hooks/useExpandableAccordionLogic'
import CollapsibleProductSection from 'toro/components/product/mobile/CollapsibleProductSection'

interface CollapsibleProductSectionContainerProps {
  children: ReactNode
}

const CollapsibleProductSectionContainer: FC<CollapsibleProductSectionContainerProps> = ({
  children,
}) => {
  const { shouldShowCollapsible } = useExpandableAccordionLogic()

  const Wrapper = shouldShowCollapsible ? CollapsibleProductSection : Fragment

  return <Wrapper>{children}</Wrapper>
}

export default CollapsibleProductSectionContainer
