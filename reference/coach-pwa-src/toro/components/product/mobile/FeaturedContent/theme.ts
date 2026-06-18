export default {
  parts: ['container', 'header', 'imageWrapper', 'image'],
  baseStyle: ({ theme }) => ({
    container: {
      padding: 'var(--spacing-6) var(--spacing-3) var(--spacing-4)',
      backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
    },
    header: {
      ...theme.typography['text-display4-xs'],
      color: 'var(--color-black, #000)',
    },
    imageWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'var(--spacing-6)',
    },
    image: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
  }),
}
