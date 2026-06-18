export default {
  parts: [
    'cardTitle',
    'cardValue',
    'cardRoot',
    'title',
    'root',
    'container',
    'viewOurDataSources',
    'cardDescription',
    'cardLink',
  ],
  baseStyle: ({ theme }) => ({
    root: {
      '& .splide__list': {
        paddingBottom: 'var(--spacing-8) !important',
      },
      marginBottom: { base: 'var(--spacing-12)', md: 104 },
    },
    globeIcon: {
      '.ac-video-controls': {
        display: 'none',
      },
    },
    title: {
      fontSize: { md: 'var(--text-44)', base: 'var(--text-26)' },
      textAlign: 'center',
      fontFamily: 'var(--font-face1-extrabold)',
      fontWeight: 'inherit',
      maxWidth: { md: '872px' },
      margin: 'var(--spacing-2) var(--spacing-3) var(--spacing-4)',
    },
    viewOurDataSources: {
      mt: 'var(--spacing-6)',
      textAlign: 'center',
      fontWeight: 500,
      color: '#000001',
      textTransform: 'capitalize',
      fontSize: 'var(--text-12)',
      fontFamily: 'var(--font-face1-medium)',
      '& a': {
        position: 'relative',
        '&::after': {
          content: '""',
          height: '1px',
          width: '100%',
          position: 'absolute',
          backgroundColor: 'var(--color-primary)',
          left: 0,
          top: '100%',
        },
      },
    },
    carouselDesktopRoot: (renderSlider) => ({
      maxWidth: renderSlider ? 'none' : 1400,
      margin: renderSlider ? '0' : '0 auto',
      '& .splide': {
        maxWidth: 1400,
        margin: '0 auto',
        padding: renderSlider ? '0 var(--spacing-10)' : 0,
      },
      '& .splide__arrow svg': {
        height: 'var(--spacing-12)',
        width: 'var(--spacing-12)',
      },
      '& .splide__arrow--next': {
        right: 0,
      },
      '& .splide__arrow--prev': {
        left: 0,
      },
      '& .env-impact-slide': {
        height: renderSlider ? '100%' : { base: '100%', md: 'auto' },
      },
    }),
    cardRoot: {
      padding: 'var(--spacing-3) var(--spacing-4)',
      boxShadow:
        '0px -1px 4px rgba(0, 0, 0, 0.04), 0px 4px 4px rgba(0, 0, 0, 0.04), 0px 8px 24px rgba(0, 0, 0, 0.04)',
      maxWidth: { base: '216px', md: '244px' },
      width: '100%',
      boxSizing: 'border-box',
      flex: 1,
      margin: { md: '0 var(--spacing-3)' },
      height: '100%',
      '&:first-child': {
        marginLeft: 0,
      },
      '&:last-child': {
        marginRight: 0,
      },
    },
    cardValue: {
      ...theme.typography['text-display2-xl'],
      fontSize: 'var(--text-44)',
      marginBottom: 'var(--spacing-3)',
      fontWeight: '500',
      letterSpacing: 'var(--letter-spacing-s)',
      textAlign: 'left',
    },
    cardDescription: {
      ...theme.typography['text-body1-m'],
      fontSize: 'var(--text-12)',
      marginTop: 'var(--spacing-4)',
      fontWeight: '500',
      fontFamily: 'var(--font-face1-medium)',
      letterSpacing: 'var(--letter-spacing-s)',
    },
    cardTitle: (hasTitle) => ({
      ...theme.typography['text-body1-m'],
      marginBottom: 'var(--spacing-6)',
      fontWeight: 'inherit',
      marginTop: hasTitle ? 0 : 'var(--spacing-16)',
    }),
    cardLink: {
      color: 'var(--color-primary)',
      textTransform: 'capitalize',
      fontSize: 'var(--text-12)',
      marginTop: 'var(--spacing-2)',
      fontFamily: 'var(--font-face1-medium)',
      position: 'relative',
      '&::after': {
        content: '""',
        height: '1px',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'var(--color-primary)',
        left: 0,
        top: '100%',
      },
    },
    container: {
      '& .splide__track': {
        paddingTop: 'var(--spacing-2)',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      title: {
        ...theme.typography['text-display1-m'],
        lineHeight: theme.lineHeights.xs,
        letterSpacing: theme.letterSpacings.xs,
      },
      cardValue: {
        letterSpacing: 'var(--letter-spacing-xs)',
        marginBottom: '7px',
      },
      root: {
        marginBottom: 0,
        padding: '35px 0 0',
      },
      container: {
        '& .splide__track': {
          paddingTop: '6px',
          paddingBottom: 'var(--spacing-2)',
        },
      },
      viewOurDataSources: {
        marginTop: '18px',
      },
      cardTitle: (hasTitle) => ({
        ...theme.typography['text-body1-m'],
        marginBottom: '31px',
        marginTop: hasTitle ? 0 : '59px',
      }),
      cardDescription: {
        marginTop: '10px',
      },
    }),
    redesignEnvCarousel: ({ theme }) => ({
      cardRoot: {
        p: 'var(--spacing-4)',
        maxWidth: { base: '196px', md: '232px' },
        '&:not(:has(svg))': {
          pt: '40px',
        },
        '@media (min-width: 769px)': {
          mr: 'var(--spacing-3)',
          ml: 0,
        },
        '& svg': {
          w: '24px',
          h: '24px',
          '@media (min-width: 769px)': {
            w: '48px',
            h: '48px',
          },
        },
      },
      cardTitle: {
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        fontWeight: 800,
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        mt: 'var(--spacing-3)',
      },
      cardDescription: {
        mt: '10px',
        mb: '2px',
        '@media (min-width: 769px)': {
          mb: '10px',
        },
      },
      root: {
        '& .splide__slide': {
          mr: 'var(--spacing-3) !important',
        },
      },
    }),
  },
}
