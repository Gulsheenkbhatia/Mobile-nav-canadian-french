import React, { Children } from 'react'
import Box from 'toro/components/Box'

/**
 * This component sizes the height of the child element as a percentage of its width.  It expects
 * only a single child.
 *
 * Example:
 *
 * ```js
 *  <Fill height="100%">
 *    <div>this element's height will be the same as its width.</div>
 *  </Fill>
 * ```
 */
export default function Fill({ height, children, ...props }) {
  children = Children.only(children)

  if (height == null) {
    return children
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
      }}
      {...props}
    >
      <Box sx={{ paddingTop: height }} />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          '& > *': {
            width: '100%',
            height: '100%',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
