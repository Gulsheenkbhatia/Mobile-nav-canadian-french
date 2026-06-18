export default {
  parts: ['reviewcta', 'topContent'],
  baseStyle: ({ theme }) => ({
    ugcContainer: {
      root: {
        '& ': {
          minHeight: 'auto',
          marginBottom: 'var(--spacing-12)',
        },
      },
    },
    reviewcta: (pageType) => ({
      ...theme.typography[pageType === 'plp' ? 'text-cta1-s' : 'text-cta1-m'],
      borderColor: theme.colors.main.white,
      textDecoration: 'underline',
    }),
    topContent: () => ({
      '& #home_body_slot_wyng': {
        textAlign: 'center',
      },
      '& a.btn-link.btn-small': {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-primary)',
        backgroundColor: 'initial',
        border: '1px solid var(--color-neutral-base)',
        '&:hover': {
          color: 'var(--color-secondary)',
          backgroundColor: 'var(--color-primary)',
          border: `1px solid ${theme.colors.main.white}`,
        },
      },
      '@media (max-width: 768px)': {
        '& .at-text-block': {
          '& .at-headline-text': {
            ...theme.typography['text-display1-m'],
          },
          '& .at-body-text': {
            ...theme.typography['text-display2-s'],
          },
        },
        '& .links-container': {
          ...theme.typography['text-cta1-s'],
        },
      },
    }),
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      topContent: () => ({
        padding: '0px !important',
        '.mol-banner .banner-container.solid-background .mol-header-block': {
          marginTop: '28px !important',
          marginBottom: 'var(--spacing-3) !important',
          paddingLeft: 'var(--spacing-3) !important',
          paddingRight: 'var(--spacing-3) !important',
        },
        'h1, h2': {
          ...theme.typography['text-display1-m'],
          color: 'var(--color-black-base) !important',
          textAlign: 'left',
          marginBottom: '5px !important',
        },
        p: {
          color: 'var(--color-black-base) !important',
          textAlign: 'left',
          marginBottom: 'var(--spacing-3) !important',
          fontFamily: 'var(--font-face1-medium) !important',
        },
        'a.btn, a.btn-secondary': {
          ...theme.typography['text-cta1-s'],
          fontSize: 'var(--text-12)',
          color: 'var(--color-black-base)',
          letterSpacing: 'var(--letter-spacing-xl) !important',
          lineHeight: 'var(--line-height-xs) !important',

          background: 'var(--color-white-base)',
          border: '1px solid var(--colors-signal-inactive, #C4C4C4)',
          borderRadius: 'var(--border-radius-s) !important',
          margin: '0 !important',
          padding: 'var(--spacing-4) var(--spacing-6) !important',
          width: '100%',
        },
      }),
    }),
  },
}
