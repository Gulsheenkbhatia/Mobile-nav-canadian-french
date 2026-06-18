import { variants } from './theme'

const fontStyles = (theme) => ({
  ...theme.typography['text-title2-xs'],
  fontWeight: '500',
  fontSize: 'var(--text-14)',
  textTransform: 'none',
  color: 'var(--color-primary, #000003)',
})

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
      background: 'var(--color-product-image-bg)',
      color: 'var(--color-black-base)',
      '&::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 0,
        right: '-20px',
        height: '10px',
        width: '20px',
        borderBottomLeftRadius: '6px',
        boxShadow: '-8px 0.3px 0 var(--color-product-image-bg)',
      },
    }),
    lowInventoryAboveATB: ({ theme }) => ({
      ...fontStyles(theme),
      ...theme.typography['text-body1-m'],
      display: 'flex',
      marginBottom: 'var(--spacing-1)',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: 'var(--spacing-2)',
      borderRadius: 'var(--spacing-2)',
    }),
  },
  // The default size and variant values
  defaultProps: {},
}
