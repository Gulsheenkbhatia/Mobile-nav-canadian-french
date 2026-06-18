import React from 'react'
import ReactDOM from 'react-dom'
import Box from 'toro/components/Box'

const StickyFlyout = ({ children, isFlyoutOpen }) => {
  if (isFlyoutOpen) {
    const overlayProps = {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bg: '#000000',
      opacity: 0.5,
      cursor: 'pointer',
    }
    return ReactDOM.createPortal(
      <Box {...overlayProps}>{children}</Box>,
      document.getElementById('sticky-flyout')
    )
  }

  return <div>{children}</div>
}

export default StickyFlyout
