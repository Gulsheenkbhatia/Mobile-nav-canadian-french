import { CustomRenderOptions, render, screen } from 'test-utils/react'
import CustomizeAndMonogramV6, { CustomizeAndMonogramV6Props } from './CustomizeAndMonogramV6'
import { preferencesAtom, PreferencesAtomType } from 'store/preferences.atom'
import userEvent from '@testing-library/user-event'
import { ContextValuesType } from 'test-utils/ContextValuesTypes'

const mockPreferencesAtomValue: PreferencesAtomType = {
  Customizer: {
    customizerTextConfigs: {
      title: 'Test Custom Title',
      body: 'Test custom body text',
      ctaText: 'Test CTA Button',
    },
  },
}

const atomValues: ContextValuesType['JotaiProviderContext'] = new Map([
  [preferencesAtom, mockPreferencesAtomValue],
])

const defaultProps: CustomizeAndMonogramV6Props = {
  onClick: jest.fn(),
}

const setup = (
  props: Partial<CustomizeAndMonogramV6Props> = {},
  options: CustomRenderOptions = {}
) => {
  return render(<CustomizeAndMonogramV6 {...defaultProps} {...props} />, {
    contexts: { JotaiProviderContext: atomValues },
    ...options,
  })
}

describe('CustomizeAndMonogramV6', () => {
  it('should display custom title and body text from preferences', () => {
    setup()

    const imageContainer = screen.queryByTestId('customize_it_mediaContainer')
    expect(imageContainer).not.toBeInTheDocument()

    const title = screen.getByTestId('customize_it_headline')
    expect(title).toBeVisible()
    expect(title).toHaveTextContent(mockPreferencesAtomValue.Customizer.customizerTextConfigs.title)

    const body = screen.getByTestId('customize_it_body')
    expect(body).toBeVisible()
    expect(body).toHaveTextContent(mockPreferencesAtomValue.Customizer.customizerTextConfigs.body)

    const ctaButton = screen.getByTestId('customize_it_cta')
    expect(ctaButton).toBeVisible()
    expect(ctaButton).toHaveTextContent(
      mockPreferencesAtomValue.Customizer.customizerTextConfigs.ctaText
    )
  })

  it('should display image container when image is provided in config', () => {
    setup(defaultProps, {
      contexts: {
        JotaiProviderContext: new Map([
          [
            preferencesAtom,
            {
              ...mockPreferencesAtomValue,
              Customizer: {
                ...mockPreferencesAtomValue.Customizer,
                customizerTextConfigs: {
                  ...mockPreferencesAtomValue.Customizer.customizerTextConfigs,
                  imageSRC: 'https://example.com/test-image.jpg',
                },
              },
            },
          ],
        ]),
      },
    })

    const imageContainer = screen.getByTestId('customize_it_mediaContainer')
    expect(imageContainer).toBeVisible()
  })

  it('should display default values if no data is stored in config', () => {
    setup(defaultProps, {
      contexts: {
        JotaiProviderContext: new Map([
          [
            preferencesAtom,
            {
              ...mockPreferencesAtomValue,
              Customizer: {
                ...mockPreferencesAtomValue.Customizer,
                customizerTextConfigs: {},
              },
            },
          ],
        ]),
      },
    })

    const imageContainer = screen.queryByTestId('customize_it_mediaContainer')
    expect(imageContainer).not.toBeInTheDocument()

    const title = screen.getByTestId('customize_it_headline')
    expect(title).toBeVisible()
    expect(title).toHaveTextContent('Make it yours.')

    const body = screen.getByTestId('customize_it_body')
    expect(body).toBeVisible()
    expect(body).toHaveTextContent('Choose the colors, hardware, then finish it with a monogram.')

    const ctaButton = screen.getByTestId('customize_it_cta')
    expect(ctaButton).toBeVisible()
    expect(ctaButton).toHaveTextContent('Customize It!')
  })

  it('should call onClick when CTA button is clicked', async () => {
    const user = userEvent.setup()

    setup()

    const ctaButton = screen.getByTestId('customize_it_cta')
    expect(ctaButton).toBeVisible()
    expect(ctaButton).toBeEnabled()

    await user.click(ctaButton)

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })
})
