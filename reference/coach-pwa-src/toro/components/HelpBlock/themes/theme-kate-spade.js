export default {
  baseStyle: ({ theme }) => ({
    helpBlockContent: {
      '.nosearch-help-block__container .helpblock_icon .icon': {
        backgroundImage:
          'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjYyNTQgMjAuNjQyMkwxNy45NjUgMjAuNDIzM0wxNy4zNzIgMjAuNzg3MUMxNS4zNTI2IDIyLjAyNiAxMi45NzczIDIyLjU1MDkgMTAuNjI1NCAyMi4yNzgyQzguMjgwMDEgMjIuMDA2MyA2LjA5MjMyIDIwLjk1NjcgNC40MTAyMSAxOS4yOTZDMi41MTUwNSAxNy4zMTEgMS40NjkwNyAxNC42NjE2IDEuNDk3MDQgMTEuOTEzM0MxLjUyNTA4IDkuMTU4NjEgMi42Mjk5MiA2LjUyNTE0IDQuNTczNTIgNC41Nzc5NkM2LjUxNzA0IDIuNjMwODkgOS4xNDQzNiAxLjUyNTExIDExLjg5MTYgMS40OTcwNEMxNC42MzI3IDEuNDY5MDQgMTcuMjc2MiAyLjUxNjE4IDE5LjI1NzUgNC40MTUwNUMyMC45MTI1IDYuMDkzMSAyMS45NjI4IDguMjc2MzggMjIuMjQxMyAxMC42MjAxQzIyLjUyMDUgMTIuOTcwMSAyMi4wMDggMTUuMzQ1OCAyMC43ODUzIDE3LjM3MDFMMjAuNDI5NCAxNy45NTkzTDIwLjY0NTIgMTguNjEzTDIxLjY0NTggMjEuNjQzMkwxOC42MjU0IDIwLjY0MjJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyLjk5Mjk5Ii8+Cjwvc3ZnPgo=)',
      },
      '& .helpblock_icon .icon': {
        height: '24px',
        width: '24px',
      },
      '& .helpblock_message1': {
        ...theme.typography['text-display2-m'],
      },
      '& .helpblock_message2': {
        ...theme.typography['text-body2-m'],
      },
      '& .helpblock_contactus a': {
        ...theme.typography['text-cta1-m'],
      },
      '@media (max-width: 544px)': {
        '& .helpblock_message1': {
          ...theme.typography['text-display2-xs'],
        },
        '& .helpblock_message2': {
          ...theme.typography['text-body2-s'],
        },
      },
      '@media (max-width: 768px)': {
        '.nosearch-help-block__container .helpblock_icon .icon': {
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjYyNTQgMjAuNjQyMkwxNy45NjUgMjAuNDIzM0wxNy4zNzIgMjAuNzg3MUMxNS4zNTI2IDIyLjAyNiAxMi45NzczIDIyLjU1MDkgMTAuNjI1NCAyMi4yNzgyQzguMjgwMDEgMjIuMDA2MyA2LjA5MjMyIDIwLjk1NjcgNC40MTAyMSAxOS4yOTZDMi41MTUwNSAxNy4zMTEgMS40NjkwNyAxNC42NjE2IDEuNDk3MDQgMTEuOTEzM0MxLjUyNTA4IDkuMTU4NjEgMi42Mjk5MiA2LjUyNTE0IDQuNTczNTIgNC41Nzc5NkM2LjUxNzA0IDIuNjMwODkgOS4xNDQzNiAxLjUyNTExIDExLjg5MTYgMS40OTcwNEMxNC42MzI3IDEuNDY5MDQgMTcuMjc2MiAyLjUxNjE4IDE5LjI1NzUgNC40MTUwNUMyMC45MTI1IDYuMDkzMSAyMS45NjI4IDguMjc2MzggMjIuMjQxMyAxMC42MjAxQzIyLjUyMDUgMTIuOTcwMSAyMi4wMDggMTUuMzQ1OCAyMC43ODUzIDE3LjM3MDFMMjAuNDI5NCAxNy45NTkzTDIwLjY0NTIgMTguNjEzTDIxLjY0NTggMjEuNjQzMkwxOC42MjU0IDIwLjY0MjJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyLjk5Mjk5Ii8+Cjwvc3ZnPgo=)',
        },
      },
    },
  }),
}
