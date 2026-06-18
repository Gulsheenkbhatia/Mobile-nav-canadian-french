export default {
  parts: [],
  baseStyle: () => ({
    logoWrapper: () => ({
      w: '134px',
    }),
    brandLogo: ({ isReducedHeader }) => ({
      width: isReducedHeader ? '100%' : 134,
      height: 25,
      viewBox: '0 0 76 15',
    }),
  }),
}
