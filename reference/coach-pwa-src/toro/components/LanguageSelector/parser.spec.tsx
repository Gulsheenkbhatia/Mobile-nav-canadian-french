import languageSelectorParser from 'toro/components/LanguageSelector/parser'

const htmlNull = null
const htmlUndefined = undefined

const htmlValid = `
  <div class="dropdown country-selector">
    <label data-qa="selected-label">English (US)</label>
    <svg data-qa="selected-flag"><use href="#us-flag"></use></svg>
  </div>
  <div class="dropdown-title">Select your language</div>
  <div class="dropdown-item locale-items active" data-qa="item-1">
    <a class="dropdown-item-locale"><svg data-qa="flag-1"><use href="#us-flag"></use></svg>English (US)</a>
    <a class="dropdown-item-lang" href="##en-us##" data-qa="lang-1">US</a>
  </div>
  <div class="dropdown-item locale-items" data-qa="item-2">
    <a class="dropdown-item-locale"><svg data-qa="flag-2"><use href="#fr-flag"></use></svg>French (FR)</a>
    <a class="dropdown-item-lang active" href="##fr-fr##" data-qa="lang-2">France</a>
  </div>
  <div class="country-selector-viewmore">
    <a class="dropdown-item-lang" href="https://www.coach.com/country-selector"><span>View More</span></a>
  </div>
`

const htmlMissingElements = `
  <div class="dropdown country-selector">
    <label>English (US)</label>
    <svg></svg>
  </div>
  <div class="dropdown-title">Select your language</div>
  <div class="dropdown-item locale-items" data-qa="item-1">
    <a class="dropdown-item-locale"><svg><use></use></svg>English (US)</a>
  </div>
`

const htmlMissingUrl = `
  <div class="dropdown country-selector">
    <label data-qa="selected-label">English (US)</label>
    <svg data-qa="selected-flag"><use href="#us-flag"></use></svg>
  </div>
  <div class="dropdown-title">Select your language</div>
  <div class="dropdown-item locale-items active" data-qa="item-1">
    <a class="dropdown-item-locale"><svg data-qa="flag-1"><use href="#us-flag"></use></svg>English (US)</a>
    <a class="dropdown-item-lang" href="##en-us##" data-qa="lang-1">US</a>
  </div>
  <div class="dropdown-item locale-items" data-qa="item-2">
    <a class="dropdown-item-locale"><svg data-qa="flag-2"><use href="#fr-flag"></use></svg>French (FR)</a>
    <a class="dropdown-item-lang" href="##de-de##" data-qa="lang-2">Germany</a>
  </div>
  <div class="country-selector-viewmore">
    <a class="dropdown-item-lang" href="https://www.coach.com/country-selector"><span>View More</span></a>
  </div>
`

const expectedResultNullUndefined = {}

const expectedResultValid = {
  selector: {
    label: 'English (US)',
    flag: 'us-flag',
    dataQA: {
      flag: 'selected-flag',
      label: 'selected-label',
    },
  },
  dropdown: {
    title: 'Select your language',
    items: [
      {
        label: 'English (US)',
        flag: 'us-flag',
        languages: [
          {
            name: 'US',
            href: 'https://www.coach.com/',
          },
        ],
        dataQA: {
          flag: 'flag-1',
          label: 'item-1',
          lang: 'lang-1',
        },
      },
      {
        label: 'French (FR)',
        flag: 'fr-flag',
        languages: [
          {
            name: 'France',
            href: 'https://eu.coach.com/in/en/',
          },
        ],
        dataQA: {
          flag: 'flag-2',
          label: 'item-2',
          lang: 'lang-2',
        },
      },
    ],
    viewMore: {
      viewMoreText: 'View More',
      viewMoreLink: 'https://www.coach.com/country-selector',
    },
    selectedItemIndex: 0,
    selectedLanguageIndex: 0,
  },
}

const expectedResultMissingElements = {
  selector: {
    label: 'English (US)',
    flag: undefined,
    dataQA: {
      flag: undefined,
      label: undefined,
    },
  },
  dropdown: {
    title: 'Select your language',
    items: [
      {
        label: 'English (US)',
        flag: undefined,
        languages: [],
        dataQA: {
          flag: undefined,
          label: 'item-1',
          lang: undefined,
        },
      },
    ],
    viewMore: {
      viewMoreText: '',
      viewMoreLink: undefined,
    },
    selectedItemIndex: 0,
    selectedLanguageIndex: 0,
  },
}

const expectedResultMissingUrl = {
  selector: {
    label: 'English (US)',
    flag: 'us-flag',
    dataQA: {
      flag: 'selected-flag',
      label: 'selected-label',
    },
  },
  dropdown: {
    title: 'Select your language',
    items: [
      {
        label: 'English (US)',
        flag: 'us-flag',
        languages: [
          {
            name: 'US',
            href: 'https://www.coach.com/',
          },
        ],
        dataQA: {
          flag: 'flag-1',
          label: 'item-1',
          lang: 'lang-1',
        },
      },
      {
        label: 'French (FR)',
        flag: 'fr-flag',
        languages: [
          {
            name: 'Germany',
            href: '',
          },
        ],
        dataQA: {
          flag: 'flag-2',
          label: 'item-2',
          lang: 'lang-2',
        },
      },
    ],
    viewMore: {
      viewMoreText: 'View More',
      viewMoreLink: 'https://www.coach.com/country-selector',
    },
    selectedItemIndex: 0,
    selectedLanguageIndex: 0,
  },
}

const scenarios = [
  {
    description: 'returns an empty object when html is null',
    html: htmlNull,
    expectedResult: expectedResultNullUndefined,
  },
  {
    description: 'returns an empty object when html is undefined',
    html: htmlUndefined,
    expectedResult: expectedResultNullUndefined,
  },
  {
    description: 'parses the HTML and returns the expected object structure',
    html: htmlValid,
    expectedResult: expectedResultValid,
  },
  {
    description: 'handles missing elements correctly',
    html: htmlMissingElements,
    expectedResult: expectedResultMissingElements,
  },
  {
    description: 'uses empty string when URL is not found in urls object',
    html: htmlMissingUrl,
    expectedResult: expectedResultMissingUrl,
  },
]

describe('languageSelectorParser', () => {
  const urls = {
    'en-us': 'https://www.coach.com/',
    'fr-fr': 'https://eu.coach.com/in/en/',
  }

  it.each(scenarios)('%s', ({ description, html, expectedResult }) => {
    expect(languageSelectorParser(html, urls)).toEqual(expectedResult)
  })
})
