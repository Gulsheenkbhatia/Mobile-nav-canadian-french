export default {
  baseStyle: () => ({
    width: '100%',
    padding: '24px 16px',
    textAlign: 'center',
    backgroundColor: 'var(--color-neutral-light)',
    borderRadius: '2px',
    '& > div': {
      marginLeft: '12px',
      textAlign: 'left',
    },
    '.styling-advice': {
      '&__title': {
        font: 'var(--text-20) var(--font-primary-bold)',
        lineHeight: '1.2',
        marginBottom: '12px',
        color: 'var(--color-black-base)',
        letterSpacing: '0.2px',
      },
      '&__description': {
        font: 'var(--text-16) var(--font-secondary-normal)',
        color: 'var(--color-black-base)',
        lineHeight: '1.4',
        letterSpacing: '0.2px',
      },
      '&__action': {
        font: 'var(--text-14) var(--font-primary-normal)',
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-primary)',
        textTransform: 'capitalize',
        lineHeight: '1.4',
        letterSpacing: '0.2px',
        borderBottom: '1px solid black',
      },
      '.w-100': {
        width: '100%',
      },
      '.pr-0': {
        paddingRight: '0',
      },
      '.menumobile-additional-content': {
        backgroundColor: 'var(--color-white-base)',
      },
    },
    '&.pdp-styling-advice': {
      padding: '24px 16px',
      textAlign: 'center',
      backgroundColor: 'var(--color-neutral-light)',
      borderRadius: '2px',
    },
    '&.pdp-styling-advice>div': {
      marginLeft: '12px',
      textAlign: 'left',
    },
  }),
}
