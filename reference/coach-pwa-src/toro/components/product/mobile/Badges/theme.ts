const fontStyles = (theme) => ({
  ...theme.typography['text-cta2-xs'],
  fontWeight: '400',
  textTransform: 'none',
  color: 'var(--color-primary, #000003)',
})

const backgroundStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(6px)',
}

export const variants = {
  marketingContentPdpV6: {
    ...backgroundStyles,
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: '1',
    padding: 'var(--spacing-3) var(--spacing-2) 10px var(--spacing-2)',
    display: 'inline-block',
    borderRadius: '4px',
  },
  pdpv6InventoryStatus: {
    ...backgroundStyles,
    background: 'var(--color-neutral-light)',
    color: 'var(--color-primary)',
    padding: 'var(--spacing-3) var(--spacing-3) 10px var(--spacing-3)',
    display: 'inline-block',
    margin: '0',
    position: 'absolute',
    bottom: '-1px',
    borderRadius: '0 8px 0 0',
    '&::after': {
      content: '""',
      position: 'absolute',
      backgroundColor: 'transparent',
      bottom: 0,
      right: '-20px',
      height: '10px',
      width: '20px',
      borderBottomLeftRadius: '6px',
      boxShadow: '-8px 0.3px 0 var(--color-neutral-light)',
    },
  },
}

export default {
  baseStyle: {},
  variants: {
    marketingContentPdpV6: ({ theme }) => ({
      ...fontStyles(theme),
      ...variants.marketingContentPdpV6,
    }),
    pdpv6InventoryStatus: ({ theme }) => ({
      ...fontStyles(theme),
      ...variants.pdpv6InventoryStatus,
    }),
    bentoCarouselBadge: ({ theme }) => ({
      ...variants.marketingContentPdpV6,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(2px)',
      border: '1px solid var(--color-white-base)',
    }),
  },
  // The default size and variant values
  defaultProps: {},
}
