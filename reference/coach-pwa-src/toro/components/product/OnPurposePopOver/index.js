import Box from 'toro/components/Box'

function OnPurposePopOver({ children, ...props }) {
  return (
    <Box {...props} sx={props.sx}>
      {children}
    </Box>
  )
}

export default OnPurposePopOver
