export default {
  baseStyle: ({ containerBackgroundColor }) => ({
    categoryName: {
      textDecoration: 'none',
      fontWeight: '400',
      fontSize: 'var(--text-12)',
      color: 'var(--color-primary)',
      cursor: 'pointer',
      lineHeight: 'var(--line-height-xl)',
      position: 'relative',
      top: '-2px',
      letterSpacing: '0.2px',
      height: '9px',
    },
    scrollableWrapper: {
      borderBottom: '1px solid var(--color-black-10)',
      backgroundColor: containerBackgroundColor,
    },
    linksWrapper: {
      pl: 'var(--spacing-3)',
      pr: 'var(--spacing-3)',
      gap: '18px',
    },
    link: {
      pt: 'var(--spacing-4)',
      pb: '10px',
    },
  }),
  variants: {
    homeT1: ({ containerBackgroundColor }) => ({
      linksWrapper: {
        gap: '16px',
      },
      scrollableWrapper: {
        borderTop: '1px solid var(--color-black-10)',
        justifyContent: 'center',
        backgroundColor: containerBackgroundColor,
      },
      categoryName: {
        textDecoration: 'none',
        fontWeight: '400',
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        cursor: 'pointer',
        lineHeight: 'var(--line-height-xl)',
        position: 'relative',
        top: '-4px',
        letterSpacing: '0.2px',
        height: '10px',
      },
      link: {
        pt: '22px',
        pb: 'var(--spacing-4)',
      },
    }),
    homeT2: ({ theme, containerBackgroundColor }) => ({
      link: {
        pt: '15.3px',
        pb: '15.3px',
      },
      scrollableWrapper: {
        borderBottom: 'none',
        justifyContent: 'center',
        backgroundColor: containerBackgroundColor,
      },
      categoryName: {
        textDecoration: 'none',
        fontWeight: '400',
        fontSize: 'var(--text-14)',
        color: 'var(--color-primary)',
        cursor: 'pointer',
        lineHeight: 'var(--line-height-xl)',
        position: 'relative',
        top: '-4px',
        letterSpacing: '0.2px',
        height: '10px',
      },
      linksWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          gap: '28px',
        },
      },
    }),
    shopBy: ({ theme }) => ({
      link: {
        pt: 'var(--spacing-4)',
        pb: 'var(--spacing-2)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          p: 'var(--spacing-2) 0',
        },
      },
      linksWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          p: 0,
          gap: 'var(--spacing-6)',
        },
      },
      categoryName: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-text-filter-pill-default)',
          fontSize: 'var(--text-14)',
          height: 'auto',
          top: 0,
        },
      },
    }),
  },
}
