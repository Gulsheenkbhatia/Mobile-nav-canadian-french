import { memo } from 'react'
import withSlotStyles from 'toro/cms/helpers/withSlotStyles'

// component for simple content slots rendering with styles
const ContentSlot = ({ content, Component, ...props }) => {
  const StyledComponent = withSlotStyles(Component)
  return (
    <div className="cms-slot">
      <StyledComponent {...content} {...props} />
    </div>
  )
}

export default memo(ContentSlot)
