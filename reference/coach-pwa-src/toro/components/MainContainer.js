import React from 'react'
import Grid from 'toro/components/Grid'
import useTheme from 'toro/hooks/useTheme'

export default function MainContainer(props) {
  const theme = useTheme()
  const { children, maxWidth = theme.maxLayoutWidth, fullWidth = false, ...restProps } = props

  return children ? (
    <Grid maxWidth={!fullWidth && maxWidth} m="auto" justifyItems="start" {...restProps}>
      {children}
    </Grid>
  ) : null
}
