import { IPHONE_PRO_SCREEN_WIDTH } from 'toro/constants/adaptiveExperience'

const plpCalloutmessage = (theme) => ({
  textTransform: 'uppercase',
  fontSize: 'xxs',
  fontFamily: theme.fontFamily.primaryNormal,
  fontWeight: 'normal',
  lineHeight: 'var(--line-height-135)',
  letterSpacing: 'var(--letter-spacing-xs)',
  textAlign: 'left',
  color: theme.colors.main.black,
})

const pdpCalloutmessage = (theme) => ({
  padding: '6px var(--spacing-0)',
  fontSize: 'xs',
  fontWeight: 'normal',
  lineHeight: '1.4',
  letterSpacing: '0.2px',
  textAlign: 'left',
  fontFamily: theme.fontFamily.primaryNormal,
  color: theme.colors.main.primary,
  borderTop: `1px ${theme.colors.main.inactive}`,
  _first: {
    marginTop: theme.space.s,
  },
})

export default {
  baseStyle: ({ theme }) => ({
    pdpCalloutmessage: () => ({
      ...pdpCalloutmessage(theme),
    }),
    plpCalloutmessage: plpCalloutmessage(theme),
  }),
  variants: {
    plpV3: ({ theme }) => ({
      plpCalloutmessage: {
        ...plpCalloutmessage(theme),
        textTransform: 'none',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-success-primary)',
        lineHeight: 'var(--line-height-120)',
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      pdpCalloutmessage: () => ({
        ...pdpCalloutmessage(theme),
        py: 'var(--spacing-1)',
        _first: {
          marginTop: 0,
        },
      }),
    }),
    pdpV41UponLand: {
      pdpCalloutmessage: () => ({
        mt: '6px',
        fontFamily: 'var(--font-face1-normal)',
        // we need to override promo messages font size for large devices (DIGIT-22227)
        '& span': {
          [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
            fontSize: 'var(--text-14) !important',
          },
        },
      }),
    },
    pdpV42Parallax: {
      pdpCalloutmessage: () => ({
        fontFamily: 'var(--font-face1-normal)',
        mb: 'var(--spacing-3)',
        // we need to override promo messages font size for large devices (DIGIT-22227)
        '& span': {
          [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
            fontSize: 'var(--text-14) !important',
          },
        },
      }),
    },
    pdpV41Parallax: {
      pdpCalloutmessage: () => ({
        p: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-face1-normal)',
        mt: '14px',
        mb: 'var(--spacing-4)',
        '&:first-child': {
          mt: '10px',
        },
        '&:last-child': {
          mb: '4px',
        },
      }),
    },
    pdpV3Promo: () => ({
      pdpCalloutmessage: () => ({
        // -12px from both sides need to expand promotions for full width
        // margin-top -16px need to reduce space between promo and product image
        marginLeft: '-12px',
        marginRight: '-12px',
        padding: 0,
        _first: {
          marginTop: '-16px',
        },
      }),
    }),
    pdpV3PricingPromo: {
      pdpCalloutmessage: () => ({
        m: `0 0 var(--spacing-4)`,
        p: 0,
      }),
    },
    pdpV4Rotation: ({ theme }) => ({
      pdpCalloutmessage: () => ({
        ...pdpCalloutmessage(theme),
        padding: 0,
        _first: {
          marginTop: 0,
        },
      }),
    }),
    pdpV5_1: () => ({
      calloutMessageWrapper: {
        marginBottom: '18px',
      },
    }),
  },
}
