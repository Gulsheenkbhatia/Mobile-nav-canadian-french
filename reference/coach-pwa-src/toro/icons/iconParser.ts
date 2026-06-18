import isString from 'lodash/isString'

// Matches only the <svg ...> tag, to not remove any other internal attributes
const svgMarkupStartPattern = /<svg[^>]*>/
const dimensionsPattern = /(width|height)="(\d+)" /g

const parseIcon = (id: IconId, rawSvg: string) => {
  if (!isString(rawSvg) || !svgMarkupStartPattern.test(rawSvg)) {
    return ''
  }

  return rawSvg.replace(svgMarkupStartPattern, (match) => {
    return match.replace(dimensionsPattern, '').replace('<svg', `<svg id="icon-${id}"`)
  })
}

const parseIcons = (rawSvgMap: Map<IconId, string>) => {
  const output = []
  rawSvgMap.forEach((rawSvg, id) => {
    output.push(parseIcon(id, rawSvg))
  })
  return output.join('\n')
}

export default parseIcons
