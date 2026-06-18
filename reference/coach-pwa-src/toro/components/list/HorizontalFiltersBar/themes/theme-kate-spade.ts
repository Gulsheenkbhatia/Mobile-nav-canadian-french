export const HORIZONTAL_FILTERS_WRAPPER_Z_INDEX = 12

export default {
  parts: ['horizontalFilterWrapper', 'clearAllStyles'],
  baseStyle: () => ({
    horizontalFilterWrapper: {
      paddingBottom: 'var(--spacing-1)',
      top: '-1px',
      marginTop: '-40px',
      paddingTop: '21px',
      backgroundColor: 'var(--color-neutral-light-1)',
      zIndex: HORIZONTAL_FILTERS_WRAPPER_Z_INDEX,
    },
    clearAllStyles: {
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-xxs)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
  }),
  variants: {
    srp: {
      horizontalFilterWrapper: {
        marginTop: '-25px',
      },
    },
    plpV3: () => ({
      clearAllStyles: {
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-m)',
      },
    }),
  },
}
