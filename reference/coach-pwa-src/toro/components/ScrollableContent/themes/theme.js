const mainWrapperCommonStyles = (fadeColor, stopPosition = 100) => ({
  ...mainWrapper(fadeColor),
  marginRight: 0,
  '&::before': {
    left: 0,
    background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, ${fadeColor} ${stopPosition}%)`,
  },
  '&::after': {
    right: 0,
    background: `linear-gradient(90deg, rgba(240, 240, 240, 0.00) 0%, ${fadeColor} ${stopPosition}%)`,
  },
})

const mainWrapper = (fadeColor) => ({
  overflow: 'hidden',
  position: 'relative',
  '&::before, &::after': {
    content: fadeColor ? '""' : null,
    position: 'absolute',
    top: 0,
    width: '45px',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&::before': {
    left: 0,
    background: fadeColor ? `linear-gradient(to right, ${fadeColor}, transparent 50%)` : null,
  },
  '&::after': {
    right: 0,
    background: fadeColor ? `linear-gradient(to left, ${fadeColor}, transparent 50%)` : null,
  },
  '&.leftFadeHidden::before, &.rightFadeHidden::after': {
    width: 0,
  },
})

const wrapper = {
  overflowX: 'auto',
  '::-webkit-scrollbar': {
    display: 'none',
  },
}

export default {
  parts: ['mainWrapper'],
  baseStyle: () => ({
    mainWrapper: (fadeColor = '#000') => mainWrapper(fadeColor),
    wrapper: wrapper,
  }),
  variants: {
    plpV3: () => ({
      mainWrapper: (fadeColor) => ({
        ...mainWrapperCommonStyles(fadeColor),
      }),
    }),
    desktopFilterV3: () => ({
      mainWrapper: (fadeColor) => ({
        ...mainWrapperCommonStyles(fadeColor, 50),
        overflow: 'unset',
        minWidth: '1px',
      }),
    }),
    homeT1: () => ({
      mainWrapper: (fadeColor) => ({
        ...mainWrapper(fadeColor),
        '&::before, &::after': {
          content: 'unset',
        },
      }),
    }),
    pdpv6ColorSwatch: () => ({
      mainWrapper: () => ({
        ...mainWrapper(),
        overflow: 'unset',
        minWidth: '1px',
        marginRight: 0,
        '&::before': {
          left: 0,
        },
        '&::after': {
          right: 0,
        },
      }),
    }),
    tabbedRecommendation: ({ theme }) => ({
      mainWrapper: (fadeColor) => ({
        ...mainWrapperCommonStyles(fadeColor),
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
        },
      }),
    }),
  },
}
