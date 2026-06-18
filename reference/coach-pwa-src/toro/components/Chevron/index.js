import Box from 'toro/components/Box'

export default function Chevron({ styles, ...props }) {
  const __css = {
    '&:before': {
      borderStyle: 'solid',
      borderWidth: '1px 1px 0 0',
      content: '""',
      display: 'inline-block',
      height: 'var(--text-12)',
      left: 0,
      position: 'relative',
      top: '3px',
      transform: 'rotate(225deg)',
      verticalAlign: 'top',
      width: 'var(--text-12)',
      borderColor: 'var(--color-black-base)',
      ...styles,
    },
  }

  return <Box __css={__css} {...props} />
}
