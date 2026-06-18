const goneViralRecommendationStyles = (theme) => ({
  button: {
    padding: '10px 14px 10px 9px',
    height: '38px',
  },
  buttonText: {
    ...theme.typography['text-cta2-xxs'],
    marginTop: '3px',
    padding: 0,
  },
})

export default {
  baseStyle: ({ theme }) => ({
    wrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      position: 'relative',
    },
    button: {
      backgroundColor: 'var(--color-white-base)',
      border: '1px solid var(--color-neutral-light-2)',
      borderRadius: '130px',
      padding: '10px 14px 10px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'fit-content',
      height: '36px',
      textTransform: 'none',
      '& svg': {
        marginRight: '3px',
        color: 'var(--color-black-base)',
      },
      '&:hover': {
        backgroundColor: 'var(--color-white-base) !important',
      },
      '@media (min-width: 769px)': {
        '&:hover': {
          backgroundColor: 'var(--color-black-base) !important',
          '& svg': {
            fill: 'var(--color-white-base) !important',
          },
          '& p': {
            color: 'var(--color-white-base) !important',
          },
        },
      },
    },
    icon: {
      width: '19px',
      height: '19px',
    },
    buttonText: {
      fontSize: 'var(--text-10)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-100)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontWeight: 'normal',
    },
  }),
  variants: {
    recomCarouselThink: ({ theme }) => ({
      button: {
        backgroundColor: 'var(--color-neutral-light-1)',
      },
    }),
    collapsibleRVOverlay: ({ theme }) => ({
      wrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
      },
      button: {
        backgroundColor: 'var(--color-white-base)',
        borderRadius: '0 0 0 50%',
        padding: 0,
        width: 'var(--spacing-8)',
        minWidth: 'var(--spacing-8)',
        height: 'var(--spacing-8)',
        minHeight: 'var(--spacing-8)',
        border: 'none',
        '&:hover': {
          backgroundColor: 'var(--color-neutral-light-2) !important',
        },
        '@media (min-width: 769px)': {
          '&:hover': {
            backgroundColor: 'var(--color-neutral-light-2) !important',
            '& svg': {
              fill: 'var(--color-black-base) !important',
            },
          },
        },
      },
      icon: {
        width: '18px',
        height: '18px',
      },
      buttonText: {
        display: 'none',
      },
    }),
    lookbookRecommendations: ({ theme }) => ({
      button: {
        padding: '10px 14px 10px var(--spacing-3)',
        height: '38px',
        '& svg': {
          display: 'block',
        },
      },
      buttonText: {
        marginTop: '3px',
        padding: 0,
        ...theme.typography['text-cta2-xxs'],
        fontWeight: '400',
        color: 'var(--color-black-base)',
      },
    }),
    goneViralRecommendation: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    goneViralRecommendationPLP: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    postATBMobile: ({ theme }) => ({
      button: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: 'var(--spacing-2) var(--spacing-3)',
          '& p': {
            ...theme.typography['text-cta2-s'],
          },
        },
      },
    }),
  },
}
