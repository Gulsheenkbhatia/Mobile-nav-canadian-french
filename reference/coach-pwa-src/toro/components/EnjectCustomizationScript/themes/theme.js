export default {
  baseStyle: () => ({
    '.customization_cta': {
      color: '#212529',
      position: 'relative',
    },
    'button.customization_link': {
      fontSize: '14px',
      lineHeight: '1.4',
      fontFamily: 'HelveticaLTPro-Roman,Arial,sans-serif',
      letterSpacing: '0.2px',
      color: '#000001',
      padding: '0',
      border: 'none',
      background: 'none',
      boxShadow: 'none',
    },
    '.customization_link.customization_link--dot': {
      textIndent: '18px',
    },
    'button.customization_link.customization_link--dot': {
      display: 'inline-block',
      position: 'relative',
    },
    '.customization_link.customization_link--dot:before': {
      width: 'calc(100% - 18px)',
      bottom: '-1px',
    },
    'button.customization_link.customization_link--dot:before': {
      content: "''",
      position: 'absolute',
      height: '1px',
      right: '0',
      background: '#000001',
    },
    '.customization_link.customization_link--dot:after': {
      width: '10px',
      height: '10px',
      marginTop: '-5px',
      borderRadius: '10px',
      marginRight: '2px',
    },
    'button.customization_link.customization_link--dot:after': {
      content: "''",
      position: 'absolute',
      left: '0',
      top: '50%',
      bottom: '0',
      background: '#6c9a4e',
    },
    'button.customization_link.customization_link--edit:before': {
      background: '#000001',
    },
    '.customization_link.customization_link--edit:before': {
      content: "''",
      position: 'absolute',
      width: 'calc(100%)',
      height: '1px',
      left: '0',
      bottom: '-1px',
    },
    'button.customization_link.customization_link--another:before': {
      background: '#000001',
    },
    '.customization_link.customization_link--another:before': {
      content: "''",
      position: 'absolute',
      width: 'calc(100%)',
      height: '1px',
      left: '0',
      bottom: '-1px',
    },
    '.customization_remove--header': {
      marginBottom: '8px',
      fontSize: '20px',
      lineHeight: '1.2',
      fontFamily: 'var(--font-face1-bold)',
      letterSpacing: '0.2px',
      textAlign: 'center',
    },
    '.customization_remove--body': {
      fontFamily: 'var(--font-face2-normal)',
      fontSize: '16px',
      textAlign: 'center',
    },
    '.customization_remove--actions': {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%',
    },
    '.customization_remove--actions > *': {
      flex: '1 0 0',
    },
  }),
}
