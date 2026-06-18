import cheerio from 'toro/lib/cheerio'

export const relativizeFlyoutLinks = (cheerioEl) => {
  const $ = cheerio.load(cheerioEl)
  $('a').each((index, el) => {
    const $a = $(el)
    const href = $a.attr('href')
    const url = new URL(href)
    const tokens = href.split(url.origin)
    $a.attr('href', tokens[1])
  })
}
