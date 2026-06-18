export default {
  parts: ['title', 'body', 'button'],
  baseStyle: ({ theme }) => ({
    title: {
      ...theme.typography['text-display2-s'],
      fontWeight: '400',
    },
    body: {
      ...theme.typography['text-display1-xs'],
      lineHeight: 'var(--line-height-125)',
      fontSize: 'var(--text-14)',
      fontWeight: '400',
    },
    button: {
      ...theme.typography['text-title1-s'],
      fontWeight: '400',
      borderRadius: 'var(--border-radius-m)',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-black-base, #000001)',
      height: '42px',
      width: '135px',
    },
  }),
}
