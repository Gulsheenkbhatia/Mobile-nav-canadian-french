const actionButton = {
  minWidth: '25px',
  height: '25px',
  padding: 0,
}

export default {
  baseStyle: ({ theme }) => ({
    // root styles
    title: {
      ...theme.typography['text-body1-m'],
      textAlign: 'center',
    },
    main: {
      paddingY: 'var(--spacing-2)',
      ...theme.typography['text-body2-m'],
    },
    footer: {
      display: 'flex',
      gap: 'var(--spacing-2)',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    // sortableTree
    draggableItem: {
      display: 'block',
    },
    dragHandler: {
      paddingRight: 8,
      userSelect: 'none',
      touchAction: 'none',
      cursor: 'grab',
    },
    sortableTree: {
      height: '567px',
      overflow: 'auto',
      paddingX: 'var(--spacing-2)',
      paddingTop: 'var(--spacing-2)',
    },
    // item
    itemBox: {
      display: 'flex',
      alignItems: 'center',
      padding: 'var(--spacing-2) var(--spacing-4)',
      border: 'var(--border-width-s) solid var(--color-black-10)',
      borderRadius: 'var(--border-radius-s)',
      backgroundColor: 'var(--color-white-base)',
      '&:has(+ ul, + div)': {
        marginBottom: 'var(--spacing-1)',
      },
    },
    itemLabel: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    addButton: {
      ...actionButton,
      marginLeft: 'auto',
    },
    removeButton: {
      ...actionButton,
      marginLeft: 'var(--spacing-2)',
    },
    // item slot
    treeItemSlot: {
      minHeight: '43px',
      marginBottom: 'var(--spacing-1)',
      padding: 'var(--spacing-2) var(--spacing-4)',
      ...theme.typography['text-body2-m'],
      color: 'var(--color-black-60)',
      border: '2px dashed teal',
      borderRadius: 'var(--border-radius-s)',
      backgroundColor: 'rgba(0, 128, 128, 0.08)',
      cursor: 'pointer',
      '&  .chakra-select': {
        paddingTop: '10px',
      },
    },
    // view changes
    textarea: {
      width: '100%',
      minHeight: '500px',
      padding: 'var(--spacing-4)',
      fontFamily: 'monospace',
      fontSize: 'var(--text-12)',
      border: 'var(--border-width-s) solid var(--color-black-10)',
      borderRadius: 'var(--border-radius-s)',
      backgroundColor: 'var(--color-neutral-light-1)',
      resize: 'vertical',
    },
    radioGroupBox: {
      display: 'flex',
      padding: 'var(--spacing-2)',
      marginX: 'var(--spacing-2)',
      marginBottom: 'var(--spacing-2)',
      border: 'var(--border-width-s) solid var(--color-black-10)',
      borderRadius: 'var(--border-radius-s)',
    },
    radioGroup: {
      display: 'flex',
      gap: 'var(--spacing-4)',
      alignItems: 'center',
    },
    radioLabel: {
      marginRight: 'auto',
    },
    copyButton: {
      backgroundColor: 'gray.600',
      '&:hover:not(:disabled)': {
        backgroundColor: 'gray.600',
      },
      '&:disabled': {
        pointerEvents: 'none',
      },
    },
    // DND library
    dragOverlay: {
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18)',
    },
    indicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: 'var(--color-error-primary)',
      border: '1px solid var(--color-error-primary)',
      transform: 'translateY(-1px)',
      pointerEvents: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: 'var(--spacing-2)',
        height: 'var(--spacing-2)',
        borderRadius: '50%',
        backgroundColor: 'var(--color-error-primary)',
        left: '-4px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    },
  }),
}
