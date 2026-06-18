import cheerio from 'toro/lib/cheerio'
import {
  type CheerioSelection,
  type ClpRecommendationsConfig,
  getClpRecommendationsConfig,
} from 'toro/helpers/recommendations'

const asSelection = (html: string) => cheerio.load(html, null, false).root()

type TestCase = {
  description: string
  input: CheerioSelection
  expected: ClpRecommendationsConfig
}

const testCases: TestCase[] = [
  {
    description: 'returns disabled when input is undefined',
    input: undefined,
    expected: { enabled: false, schema: null },
  },
  {
    description: 'returns disabled when input is null',
    input: null,
    expected: { enabled: false, schema: null },
  },
  {
    description: 'returns disabled when string has no .page-rec',
    input: '<div />',
    expected: { enabled: false, schema: null },
  },
  {
    description: 'enables when string has .page-rec without schema',
    input: '<div class="page-rec" />',
    expected: { enabled: true, schema: null },
  },
  {
    description: 'reads schema when string has .page-rec with data-schema',
    input: '<div class="page-rec" data-schema="recommendation-schema" />',
    expected: { enabled: true, schema: 'recommendation-schema' },
  },
  {
    description: 'returns disabled when cheerio selection has no .page-rec',
    input: asSelection('<div />'),
    expected: { enabled: false, schema: null },
  },
  {
    description: 'enables when cheerio selection has .page-rec without schema',
    input: asSelection('<div class="page-rec" />'),
    expected: { enabled: true, schema: null },
  },
  {
    description: 'reads schema when cheerio selection has .page-rec with data-schema',
    input: asSelection('<div class="page-rec" data-schema="recommendation-schema" />'),
    expected: { enabled: true, schema: 'recommendation-schema' },
  },
]

describe('getClpRecommendationsConfig (table-driven)', () => {
  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(getClpRecommendationsConfig(input)).toEqual(expected)
    })
  })
})
