export default {
  variants: {
    plpV3: () => ({
      plpCalloutmessage: {
        lineHeight: 'var(--line-height-xl)',
        textAlign: 'center',
      },
    }),
    pdpV3Promo: () => ({
      pdpCalloutmessage: () => ({
        // -12px from both sides need to expand promotions for full width
        marginLeft: '-12px',
        marginRight: '-12px',
        padding: 0,
        _first: {
          marginTop: '0',
        },
      }),
    }),
  },
}
