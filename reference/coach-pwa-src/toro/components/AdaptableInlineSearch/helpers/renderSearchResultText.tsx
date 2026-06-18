import escapeRegExp from 'lodash/escapeRegExp'

export const renderSearchResultText = (
  text: string,
  searchQuery: string,
  highlightStyles: Record<string, any>
) => {
  const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi')
  const parts = text.split(regex).filter(Boolean)
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={`${text}${index}`} style={highlightStyles}>
            {part}
          </span>
        ) : (
          <span key={`${text}${index}`}>{part}</span>
        )
      )}
    </>
  )
}
