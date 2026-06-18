export default {
  parts: [
    'contentLinkAccordionButton',
    'gridItem',
    'gridItemText',
    'gridItemTextSecondary',
    'gridItemTextMobile',
  ],
  baseStyle: ({ theme }) => ({
    contentLinkAccordionButton: {
      position: 'relative',
      py: 'm',
      pl: 0,
      pr: theme.space.s10,
      '&:focus': theme.focus,
      '&:hover': { background: 'transparent' },
    },
    gridItem: { display: 'flex', justifyContent: 'space-around', gap: '24px' },
    gridItemText: {
      mb: theme.space.l,
      letterSpacing: theme.letterSpacings.xl,
      lineHeight: theme.lineHeights.xs,
      fontWeight: 'bold',
    },
    gridItemTextSecondary: {
      mb: theme.space.m,
      letterSpacing: theme.letterSpacings.xs,
      lineHeight: theme.lineHeights.xl,
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
      },
    },
    gridItemTextMobile: {
      fontFamily: theme.fontFamily.primaryBold,
      letterSpacing: theme.letterSpacings.xl,
      fontSize: theme.fontSizes.sm,
      lineHeight: 1.1,
      textTransform: 'uppercase',
    },
    gridItemTextSecondaryMobile: {
      py: 'm',
      px: 0,
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: theme.fontSizes.sm,
    },
    accordionIcon: {
      position: 'absolute',
      top: '0.875rem',
      right: 0,
    },
  }),
}
