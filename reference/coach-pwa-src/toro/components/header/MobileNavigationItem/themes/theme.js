import { NAVIGATION_VARIANTS } from 'toro/components/header/MobileNavigation'

export default {
  parts: [
    'imageContainer',
    'imageBox',
    'navigationItem',
    'callOutDataBox',
    'accordionItemBox',
    'accordionButtonBox',
    'accordionPanelBox',
    'accordionSVG',
  ],
  baseStyle: ({ theme }) => ({
    styles: {
      imageContainer: {
        width: '40px',
        height: '48px',
      },
      imageBox: {
        maxWidth: '40px',
        marginBottom: theme.space.xs,
      },
      navigationItem: (isImageVisible, imageSrc) => ({
        mb: isImageVisible ? 'xs' : null,
        textAlign: 'left',
        ml: isImageVisible && imageSrc ? theme.space.m : '',
        lineHeight: theme.space.mmh,
      }),
      callOutDataBox: (callOutData, calloutinfo) => ({
        color: callOutData[0],
        fontFamily: theme.fontFamily.secondaryNormal,
        fontSize: '0.715rem',
        lineHeight: theme.lineHeights.xl,
        letterSpacing: theme.letterSpacings.l,
        position: 'relative',
        top: '-3px',
        left: '3px',
        minWidth: calloutinfo && '40%',
        ml: '4px',
        _hover: { textDecoration: 'none' },
      }),
      accordionItemBox: {
        border: 'none',
      },
      accordionButtonBox: {
        p: '0',
        '&:focus': theme.focus,
        '&:hover': {
          background: 'transparent',
        },
      },
      accordionPanelBox: {
        pr: '0',
        pl: 'm',
        py: 's',
      },
    },
    variants: {
      [NAVIGATION_VARIANTS.TIER_1]: {
        navigationItem: {
          textVariant: 'cta-primary',
          textSize: 'md',
          textTransform: 'uppercase',
          letterSpacing: theme.letterSpacings.xl,
        },
      },
      [NAVIGATION_VARIANTS.TIER_2]: {
        navigationItem: {
          textVariant: 'body-text-secondary',
          textSize: 'md',
          textTransform: 'capitalize',
        },
      },
      [NAVIGATION_VARIANTS.TIER_3]: {
        navigationItem: {
          textVariant: 'body-text-secondary',
          textSize: 'sm',
          textTransform: 'capitalize',
        },
      },
    },
  }),
}
