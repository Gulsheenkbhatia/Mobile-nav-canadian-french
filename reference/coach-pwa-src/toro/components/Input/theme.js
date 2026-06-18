export default {
  baseStyle: {},
  variants: {
    'filter-input': ({ theme }) => ({
      field: {
        backgroundColor: 'transparent',
        padding: '21px 6px 6px 14px',
        width: '1%',
        flexGrow: '1',
        height: '45px',
        border: `${theme.borderWidth.default} solid ${theme.colors.main.inactive}`,
        borderRadius: theme.borderRadius.default,
        color: theme.colors.main.gray,
        placeholder: '',
        fontSize: theme.fontSizes.sm,
        _focus: {
          borderColor: theme.colors.main.black,
        },
        '&[aria-invalid]': {
          borderColor: theme.colors.error.primary,
        },
      },
    }),
    'email-input': ({ theme }) => ({
      field: {
        backgroundColor: 'transparent',
        padding: '14px 16px',
        width: '100%',
        height: '44px',
        border: `${theme.borderWidth.default} solid ${theme.colors.main.inactive}`,
        borderRadius: theme.borderRadius.default,
      },
    }),
    flyout: ({ theme }) => ({
      field: {
        // we need !important because global-styles.css is overriding the padding
        backgroundColor: 'transparent',
        paddingY: '14px !important',
        paddingLeft: `${theme.space.m} !important`,
        paddingRight: `calc(2 * ${theme.space.m} + 40px) !important`,
        width: '100%',
        height: '44px',
        border: `${theme.borderWidth.default} solid ${theme.colors.main.inactive}`,
        borderRadius: theme.borderRadius.default,
        color: theme.colors.main.gray,
        fontSize: theme.fontSizes.md,
        _focus: {
          borderColor: theme.colors.main.black,
        },
        _placeholder: {
          color: theme.colors.main.gray,
        },
        '&[aria-invalid]': {
          borderColor: theme.colors.error.primary,
        },
      },
    }),
  },
  sizes: {},
}
