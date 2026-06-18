export default {
  parts: ['SocialMediaAreaWrapper', 'SocialMediaAreaLabel'],
  baseStyle: ({ theme }) => ({
    SocialMediaAreaWrapper: {
      py: 'l',
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'space-between',
      w: '100%',
      pr: 'mar',
    },
    SocialMediaAreaLabel: {
      fontSize: 'sm',
      fontWeight: 'normal',
      color: theme.colors.main.black,
    },
    FacebookWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },
    TulipSvg: {
      width: '0',
    },
  }),
}
