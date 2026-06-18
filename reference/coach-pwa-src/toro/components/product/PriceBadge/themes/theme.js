export default {
  parts: ['PriceBadgeWrapper', 'PromoText', 'priceBadgeContainer'],
  baseStyle: () => ({
    PriceBadgeWrapper: {
      display: 'block',
      width: '100%',
    },
    PromoText: {
      pt: '10px',
      pb: '40px',
      fontSize: '12px',
    },
    priceBadgeContainer: () => ({}),
    pdpOTDPriceCallout: {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
      color: 'var(--color-black-base)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 700,
      pt: '2px',
    },
  }),
}
