import React from 'react'
import { render } from 'test-utils/react'
import '@testing-library/jest-dom/extend-expect'
import LanguagesDropdownContent from './LanguagesDropdownContent'
import isCA from 'toro/helpers/isCA'

jest.mock('toro/analytics/useAnalytics', () => jest.fn(() => ({ send: jest.fn() })))
jest.mock('toro/helpers/isCA')

const contentData = {
  title: 'CHANGE LOCATION',
  items: [
    {
      label: 'United Kingdom (£GBP)',
      flag: 'gb',
      languages: [
        {
          name: 'EN',
          href: 'https://staging1.katespade.co.uk',
        },
      ],
      dataQA: {
        flag: 'd_hdr_cs_drpdwn_flag_gb',
        label: 'd_hdr_cs_drpdwn_label_gb',
        lang: 'd_hdr_cs_drpdwn_lang_en_GB',
      },
    },
    {
      label: 'Germany (€EUR)',
      flag: 'de',
      languages: [
        {
          name: 'DE',
          href: 'https://staging1.katespade.de/',
        },
      ],
      dataQA: {
        flag: 'd_hdr_cs_drpdwn_flag_de',
        label: 'd_hdr_cs_drpdwn_label_de',
        lang: 'd_hdr_cs_drpdwn_lang_de_DE',
      },
    },
    {
      label: 'Ireland (€EUR)',
      flag: 'ie',
      languages: [
        {
          name: 'EN',
          href: 'https://staging1.katespade.eu/ie',
        },
      ],
      dataQA: {
        flag: 'd_hdr_cs_drpdwn_flag_ie_active',
        label: 'd_hdr_cs_drpdwn_label_ie_active',
        lang: 'd_hdr_cs_drpdwn_lang_en_IE_active',
      },
    },

    {
      label: 'France (€EUR)',
      flag: 'fr',
      languages: [
        {
          name: 'EN',
          href: 'https://staging1.katespade.eu/fr',
        },
      ],
      dataQA: {
        flag: 'd_hdr_cs_drpdwn_flag_fr',
        label: 'd_hdr_cs_drpdwn_label_fr',
        lang: 'd_hdr_cs_drpdwn_lang_en_FR',
      },
    },

    {
      label: 'Italy (€EUR)',
      flag: 'it',
      languages: [
        {
          name: 'EN',
          href: 'https://staging1.katespade.eu/it',
        },
      ],
      dataQA: {
        flag: 'd_hdr_cs_drpdwn_flag_it',
        label: 'd_hdr_cs_drpdwn_label_it',
        lang: 'd_hdr_cs_drpdwn_lang_en_IT',
      },
    },
  ],
  viewMore: {
    viewMoreText: '',
  },
  selectedItemIndex: 2,
  selectedLanguageIndex: 0,
}

const contentDataWithoutDataQAFlagAndLabel = {
  title: 'CHANGE LOCATION',
  items: [
    {
      label: 'United Kingdom (£GBP)',
      flag: 'gb',
      languages: [
        {
          name: 'EN',
          href: 'https://staging1.katespade.co.uk',
        },
      ],
      dataQA: {
        lang: 'd_hdr_cs_drpdwn_lang_en_GB',
      },
    },
    {
      label: 'Germany (€EUR)',
      flag: 'de',
      languages: [
        {
          name: 'DE',
          href: 'https://staging1.katespade.de/',
        },
      ],
      dataQA: {
        lang: 'd_hdr_cs_drpdwn_lang_de_DE',
      },
    },
  ],
  viewMore: {
    viewMoreText: ['View more options'],
    viewMoreLink: 'https://www.coach.com/country-selector',
  },
  selectedItemIndex: 2,
  selectedLanguageIndex: 1,
}

describe('LanguagesDropdownContent', () => {
  beforeEach(() => {
    isCA.mockReturnValue(true)
  })
  it('renders dropdown with correct content when flag and label attribute of dataQA is not present', () => {
    const { getByText } = render(
      <LanguagesDropdownContent content={contentDataWithoutDataQAFlagAndLabel} selectedFlag="gb" />
    )
    const changeLocationText = getByText('CHANGE LOCATION')
    expect(changeLocationText).toBeVisible()
    expect(getByText('DE')).toBeVisible()
    expect(getByText('United Kingdom (£GBP)')).toBeVisible()
  })

  it('renders dropdown with correct content when isCA is false', () => {
    isCA.mockReturnValue(false)
    const { getByText } = render(
      <LanguagesDropdownContent content={contentDataWithoutDataQAFlagAndLabel} selectedFlag="gb" />
    )
    expect(getByText('United Kingdom (£GBP)')).toBeVisible()
  })

  it('renders dropdown with correct content', () => {
    const { getByText } = render(
      <LanguagesDropdownContent content={contentData} selectedFlag="us" />
    )
    const changeLocationText = getByText('CHANGE LOCATION')
    expect(changeLocationText).toBeInTheDocument()

    expect(getByText('DE')).toBeInTheDocument()
    expect(getByText('United Kingdom (£GBP)')).toBeInTheDocument()
  })

  it('when a language link is clicked', async () => {
    const setRedirectLinkMock = jest.fn()

    const { user } = render(
      <LanguagesDropdownContent
        content={contentData}
        selectedFlag="ie"
        setRedirectLink={setRedirectLinkMock}
      />
    )

    const languageLinkClick = document.querySelector('.languageClick')
    await user.click(languageLinkClick)

    expect(setRedirectLinkMock).toHaveBeenCalled()
  })

  it('triggers a language country selector text is clicked', async () => {
    const setRedirectLinkMock = jest.fn()

    const { user } = render(
      <LanguagesDropdownContent
        content={contentData}
        selectedFlag="ie"
        setRedirectLink={setRedirectLinkMock}
      />
    )
    const DropDownlanguage = document.querySelector('.DropDownlanguagelink')
    await user.click(DropDownlanguage)
    expect(setRedirectLinkMock).toHaveBeenCalled()
  })
  it('redirects when a different language link is clicked', async () => {
    const setRedirectLinkMock = jest.fn()
    const { user, getByText } = render(
      <LanguagesDropdownContent
        content={contentData}
        selectedFlag="us"
        setRedirectLink={setRedirectLinkMock}
      />
    )

    await user.click(getByText('DE'))
    expect(setRedirectLinkMock).toHaveBeenCalled()
  })

  it('does not redirect when clicking on the already selected language', async () => {
    const setRedirectLinkMock = jest.fn()
    const { user, getByText } = render(
      <LanguagesDropdownContent
        content={contentData}
        selectedFlag="de"
        setRedirectLink={setRedirectLinkMock}
      />
    )
    await user.click(getByText('DE'))
    expect(setRedirectLinkMock).not.toHaveBeenCalled()
  })
})
