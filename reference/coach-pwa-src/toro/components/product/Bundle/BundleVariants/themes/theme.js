export default {
  parts: ['bundleHeadline', 'atbControlsWrapper'],
  baseStyle: ({ theme }) => ({
    bundleHeadline: (isDesktop) => ({
      fontSize: isDesktop && theme.fontSizes.lg,
      fontFamily: isDesktop ? theme.fontFamily.primaryNormal : theme.fontFamily.primaryBold,
      pt: '10px',
    }),
    BundleVariantSwatchesContainer: {
      mb: '14px',
    },
    BundleVariantSwatches: (selected) => ({
      m: `0 ${theme.space.s1} ${theme.space.sm1}`,
      maxWidth: '80px',
      borderRadius: theme.borderRadius.rounded,
      border: selected
        ? `${theme.borderWidth.default} solid`
        : `${theme.borderWidth.default} solid`,
      borderColor: selected ? theme.colors.black : theme.colors.white,
      padding: selected ? '3px' : 0,
      boxSizing: 'content-box',
    }),
    BundleVariantSwatchesImage: {
      borderRadius: '50%',
      w: '32px',
      h: '32px',
    },
    atbControlsWrapper: {
      '.chakra-select__wrapper': {
        mr: 'mar',
      },
    },
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      atbControlsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            mr: 'var(--spacing-2)',
            mt: 'var(--spacing-2)',
          },
        },
      },
    }),
  },
}
