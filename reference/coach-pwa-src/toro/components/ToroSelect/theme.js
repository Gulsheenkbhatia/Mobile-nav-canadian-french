const selectV3 = {
  minWidth: '74px',
  borderRadius: 'var(--border-radius-xs)',
  borderColor: 'var(--color-inactive)',
  height: '57px',
  padding: '10px var(--spacing-4)',
  '&:focus': {
    borderColor: 'var(--color-inactive)',
  },
}

export default {
  baseStyle: () => ({
    select: {
      minWidth: '74px',
    },
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      select: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...selectV3,
        },
      },
    }),
    tabbedPDP: ({ theme }) => ({
      select: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...selectV3,
          height: '48px',
          minWidth: '64px',
        },
      },
    }),
    adaptiveTabbedPDP: () => ({
      select: {
        ...selectV3,
        fontFamily: 'var(--font-face1-extended-normal)',
        paddingLeft: 'var(--spacing-3)',
        height: '56px !important',
        minWidth: '47px',
        border: 'none',
        borderRight: '1px solid var(--color-white-20)',
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-black-base)',
        borderRadius: 0,
        paddingTop: '14px',
        '& + .chakra-select__icon-wrapper': {
          color: 'var(--color-white-base)',
          fontSize: '6px',
          width: '17px',
        },
        '&[disabled]': {
          opacity: 1,
          color: 'var(--color-neutral-base)',
          backgroundColor: 'var(--color-neutral-light-2)',
          borderColor: 'var(--color-black-10)',
          '& + .chakra-select__icon-wrapper': {
            color: 'var(--color-neutral-base)',
          },
        },
      },
    }),
    desktopV5Template: {
      select: {
        position: 'relative',
        height: '50px',
        width: 'auto !important',
        minWidth: 'auto',
        boxSizing: 'content-box',
        padding: '0 var(--spacing-4) 0 var(--spacing-3)',
        backgroundColor: 'var(--color-black-base, #000)',
        color: 'var(--color-white-base, #fff)',
        border: '0 none',
        outline: '0 none',
        cursor: 'pointer',

        '& + .chakra-select__icon-wrapper': {
          color: 'var(--color-white-base, #fff)',
          width: '12px',
          right: '2px',
        },
        '&:disabled + .chakra-select__icon-wrapper': {
          color: 'var(--color-white-base, #fff) !important',
        },
        '&:disabled': {
          background: 'var(--color-black-base, #000) !important',
          color: 'var(--color-white-base, #fff) !important',
          opacity: '1 !important',
          cursor: 'pointer !important',
        },
      },
    },
  },
}
