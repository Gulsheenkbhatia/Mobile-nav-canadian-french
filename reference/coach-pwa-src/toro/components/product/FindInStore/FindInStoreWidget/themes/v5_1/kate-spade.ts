const wrapperStyle = {
  p: '10px 15px 11px 25px',
  borderRadius: '58px',
  border: '1px solid var(--color-neutral-light-2, #e1e1e1)',
  backgroundColor: 'var(--color-white-base)',
  alignItems: 'center',
  gap: 'var(--spacing-3)',
}

export default {
  parts: [
    'PickUpInStoreWrapper',
    'pickUpSearchStoreWrapper',
    'pickUpMainText',
    'pickUpWrapper',
    'pickUpTextRow',
    'changeLink',
    'pickUpSearchStoreIcon',
    'addToBagBtn',
  ],
  baseStyle: ({ theme }) => ({
    PickUpInStoreWrapper: {
      mb: '18px',
    },
    pickUpSearchStoreWrapper: {
      ...wrapperStyle,
      height: 'var(--spacing-12)',
    },
    pickUpMainText: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-medium)',
      fontSize: 'var(--text-16)',
      fontWeight: 500,
      lineHeight: 'var(--line-height-135)',
      textTransform: 'none',
    },
    pickUpWrapper: {
      ...wrapperStyle,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      minHeight: '61px',
    },
    pickUpTextRow: {
      flexDirection: 'row',
      gap: 'var(--spacing-3)',
    },
    changeLink: {
      ...theme.typography['text-title2-xs'],
      mt: '2px',
      color: 'var(--color-grey-80, #333333)',
      textTransform: 'none',
      fontWeight: '500',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
    pickUpSearchStoreIcon: {
      m: 'auto 0',
    },
    addToBagBtn: {
      m: 'auto',
      mr: 0,
      minWidth: '20px',
      h: 'fit-content',
      '& svg': {
        p: '2px var(--spacing-1) 2px 3px',
        width: '17px',
        height: '20px',
        transform: 'scale(1.5)',
      },
    },
  }),
}
