import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClickableTags from './ClickableTags'

jest.mock('./closeIcon.svg', () => 'mocked-close-icon')
jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})
jest.mock('toro/hooks/useMultiStyleConfig', () =>
  jest.fn(() => ({
    pdpReviewsClickableTag: () => ({}),
    pdpReviewsClickableTagText: () => ({}),
    pdpReviewsClickableTagCount: {},
    clickableTagsContainer: {},
    wordCloudTagsText: {},
    pdpReviewsClearTags: () => ({}),
  }))
)

jest.mock('toro/components/ScrollableContent', () => ({ children, ...props }) => (
  <div data-qa={props['dataQA'] || 'mock_scrollable_clickable_tags'} {...props}>
    {children}
  </div>
))

describe('ClickableTags', () => {
  const properties = [
    {
      key: 'color',
      values: [
        { label: 'Red', count: 10 },
        { label: 'Blue', count: 5 },
      ],
    },
    {
      key: 'size',
      values: [
        { label: 'Small', count: 3 },
        { label: 'Large', count: 7 },
      ],
    },
  ]

  const handleChangeFilter = jest.fn()

  const renderComponent = (ratingsFilter = { filterBy: '' }) => ({
    ...render(
      <ClickableTags
        properties={properties}
        handleChangeFilter={handleChangeFilter}
        ratingsFilter={ratingsFilter}
        allowedFilters={['color', 'size']}
      />
    ),
    user: userEvent.setup({ delay: null }),
  })

  test('renders tags with correct styles', () => {
    const { getByText } = renderComponent()

    const red = getByText('Red')
    const blue = getByText('Blue')
    const small = getByText('Small')
    const large = getByText('Large')

    expect(red).toBeVisible()
    expect(red).toHaveTextContent(/\(\s*10\s*\)/)
    expect(blue).toBeVisible()
    expect(blue).toHaveTextContent(/\(\s*5\s*\)/)
    expect(small).toBeVisible()
    expect(small).toHaveTextContent(/\(\s*3\s*\)/)
    expect(large).toBeVisible()
    expect(large).toHaveTextContent(/\(\s*7\s*\)/)
  })

  test('handles click on tag', async () => {
    const { getByText, user } = renderComponent({
      filterBy: 'size: Large',
    })

    await user.click(getByText('Red'))

    expect(handleChangeFilter).toHaveBeenCalledWith({
      key: 'color',
      value: 'Red',
      count: 10,
      displayLabel: 'Red',
      filterType: 'word cloud',
    })
  })

  describe('AI Topics functionality', () => {
    const topics = [
      { value: 'comfort', count: 5, filter: 'topic(comfort)' },
      { value: 'clasp quality', count: 3, filter: 'topic(clasp quality)' },
      { value: 'durability', count: 8, filter: 'topic(durability)' },
    ]

    const renderComponentWithTopics = (ratingsFilter = { filterBy: '' }) => ({
      ...render(
        <ClickableTags
          properties={[]}
          topics={topics}
          handleChangeFilter={handleChangeFilter}
          ratingsFilter={ratingsFilter}
          allowedFilters={[]}
        />
      ),
      user: userEvent.setup({ delay: null }),
    })

    test('renders AI topics when provided', () => {
      const { getByText } = renderComponentWithTopics()

      const comfort = getByText('comfort')
      const clasp = getByText('clasp quality')
      const durability = getByText('durability')

      expect(comfort).toBeVisible()
      expect(comfort).toHaveTextContent(/\(\s*5\s*\)/)
      expect(clasp).toBeVisible()
      expect(clasp).toHaveTextContent(/\(\s*3\s*\)/)
      expect(durability).toBeVisible()
      expect(durability).toHaveTextContent(/\(\s*8\s*\)/)
    })

    test('prioritizes topics over properties when both are provided', () => {
      const { getByText, queryByText } = render(
        <ClickableTags
          properties={properties}
          topics={topics}
          handleChangeFilter={handleChangeFilter}
          ratingsFilter={{ filterBy: '' }}
          allowedFilters={['color', 'size']}
        />
      )

      expect(getByText('comfort')).toBeVisible()
      expect(getByText('clasp quality')).toBeVisible()
      expect(getByText('durability')).toBeVisible()

      expect(queryByText('Red')).not.toBeInTheDocument()
      expect(queryByText('Blue')).not.toBeInTheDocument()
    })

    test('handles click on AI topic', async () => {
      const { getByText, user } = renderComponentWithTopics()

      await user.click(getByText('comfort'))

      expect(handleChangeFilter).toHaveBeenCalledWith({
        key: 'topic',
        value: 'comfort',
        count: 5,
        displayLabel: 'comfort',
        filterType: 'word cloud',
      })
    })

    test('shows selected state for active topic filter', () => {
      const { getByText } = renderComponentWithTopics({
        filterBy: 'topic:comfort',
      })

      const comfortTag = getByText('comfort').closest('div')
      expect(comfortTag).toBeVisible()
      expect(getByText('comfort')).toBeVisible()
    })

    test('handles multiple topic selection', () => {
      const { getByText } = renderComponentWithTopics({
        filterBy: 'topic:comfort||clasp quality',
      })

      expect(getByText('comfort')).toBeVisible()
      expect(getByText('clasp quality')).toBeVisible()
    })

    test('does not render anything when topics array is empty', () => {
      const { container } = render(
        <ClickableTags
          properties={[]}
          topics={[]}
          handleChangeFilter={handleChangeFilter}
          ratingsFilter={{ filterBy: '' }}
          allowedFilters={[]}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })
})
