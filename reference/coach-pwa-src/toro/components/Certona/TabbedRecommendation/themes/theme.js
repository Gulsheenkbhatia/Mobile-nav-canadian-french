export default {
  parts: [
    'certonaTabbedContainer',
    'title',
    'tabs',
    'tabList',
    'tabListPLP',
    'tab',
    'selectedTab',
    'viewAllContainer',
    'viewAllProductLink',
    'viewAllText',
  ],
  baseStyle: ({ theme }) => ({
    certonaTabbedContainer: {
      py: 'var(--spacing-6)',
      bg: 'var(--color-neutral-light)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        py: 'var(--spacing-12)',
        backgroundColor: 'var(--color-neutral-light-1)',
      },
    },
    tabs: {
      pt: 'var(--spacing-3)',
      pl: 'var(--spacing-3)',
    },
    tabList: {
      gap: 'var(--spacing-2)',
      pr: 'var(--spacing-3)',
    },
    tab: {
      p: '7px var(--spacing-3)',
      border: '1px solid var(--color-neutral-light-2)',
      borderRadius: '20px',
      backgroundColor: 'var(--color-secondary)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontWeight: 400,
      fontSize: 'var(--text-12)',
      color: 'var(--color-primary)',
      lineHeight: 1,
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    selectedTab: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white-base)',
    },
    viewAllContainer: {
      width: '100%',
      px: 'var(--spacing-3)',
      pt: 'var(--spacing-3)',
    },
    viewAllProductLink: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      padding: 'var(--spacing-3)',
      backgroundColor: 'transparent',
      borderRadius: '20px',
      border: '1px solid var(--color-black-base)',
      textAlign: 'center',

      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-black-base)',

        '& span': {
          color: 'var(--color-secondary)',
        },
        '& path': {
          stroke: 'var(--color-secondary)',
        },
      },
    },
    viewAllText: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      color: 'var(--color-primary)',
      lineHeight: 1,
      letterSpacing: 'var(--letter-spacing-xs)',
      textTransform: 'capitalize',
    },
    title: {
      fontSize: 'var(--text-24)',
      fontFamily: 'var(--font-face1-bold)',
      lineHeight: 1,
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'left',
      pr: 'var(--spacing-3)',
      pl: 'var(--spacing-3)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        px: 'var(--spacing-12)',
        textAlign: 'center',
        ...theme.typography['text-display4-xs'],
        fontWeight: 700,
      },
    },
    fallbackMessageContainer: {
      display: 'flex',
      height: '219px',
      padding: '0px var(--spacing-4)',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderRadius: 'var(--border-radius-s)',
      border: '1px solid var(--color-neutral-light-2)',
      background: 'var(-color-neutral-light)',
      margin: 'var(--spacing-4) var(--spacing-3) var(--spacing-1)',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mx: 'var(--spacing-12)',
        borderRadius: '10px',
        height: '323px',
        borderColor: 'var(--color-neutral-light-3)',
      },
    },
    fallbackMessage: {
      ...theme.typography['text-body1-s'],
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textAlign: 'center',
      marginTop: '10px',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-l'],

        '& strong': {
          ...theme.typography['text-display4-xs'],
          fontWeight: 700,
        },
      },
    },
  }),
  variants: {
    tabbedRecommendation: ({ theme }) => ({
      tabs: {
        pt: 'var(--spacing-3)',
        pl: '0',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pt: 'var(--spacing-4)',
        },
      },
      tabList: {
        gap: 'var(--spacing-2)',
        pr: 'var(--spacing-3)',
        pl: 'var(--spacing-3)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          flexWrap: 'wrap',
          justifyContent: 'center',
          px: '20px',
        },
      },
      tabListPLP: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          flexWrap: 'wrap',
          justifyContent: 'center',
          px: 0,
        },
      },
      tab: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          p: 'var(--spacing-2) var(--spacing-3)',
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      viewAllContainer: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          justifyContent: 'center',
          padding: 'var(--spacing-4) 20px 0',
        },
      },
      viewAllProductLink: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: 'fit-content',
          padding: '0 var(--spacing-6)',
          height: '36px',
        },
      },
      viewAllText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta2-xxs'],
          fontWeight: 400,
        },
      },
    }),
    tabbedPDPRecommendation: {
      certonaTabbedContainer: {
        bg: 'unset',
        pb: 'var(--spacing-10)',
      },
      title: {
        fontSize: 'var(--text-24)',
      },
    },
    inlinePDPv6: {
      tabs: {
        pt: '23px',
      },
      tab: {
        p: '10px var(--spacing-3) var(--spacing-2)',
        lineHeight: 'var(--line-height-125)',
      },
    },
  },
}
