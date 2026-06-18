export default {
  variants: {
    baseStyle: ({ theme }) => ({
      backgroundColor: theme.colors.main.white,
      color: theme.colors.main.black,
      border: `1px solid ${theme.colors.main.black}`,
    }),
    productTile: ({ theme }) => ({
      backgroundColor: theme.colors.neutral.base,
      color: theme.colors.main.white,
    }),
    inspiration: () => ({
      zIndex: 1,
    }),
    memberExclusive: ({ theme }) => ({
      height: '67px',
      width: '194px',
      borderRadius: theme.borderRadius,
      backgroundColor: theme.colors.main.black,
      '--popper-arrow-bg': theme.colors.main.black,
      color: theme.colors.main.white,
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: '12px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      lineHeight: '1.4',
      letterSpacing: '0.2px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
}
