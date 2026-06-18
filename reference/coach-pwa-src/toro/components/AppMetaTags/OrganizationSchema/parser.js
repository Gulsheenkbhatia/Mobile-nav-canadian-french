import cheerio from 'toro/lib/cheerio'

export default function organizationSchemaParser(html) {
  if (!html) return {}

  const $ = cheerio.load(html)

  const json = $('body').html()

  return {
    json,
  }
}
