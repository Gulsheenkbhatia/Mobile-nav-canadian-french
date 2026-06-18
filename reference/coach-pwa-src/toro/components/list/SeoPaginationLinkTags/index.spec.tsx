import SeoPaginationLinkTags from 'toro/components/list/SeoPaginationLinkTags'
import { render } from 'test-utils/react'
import Head from 'next/head'
import { useAtomValue } from 'jotai/utils'

const INITIAL_PATH = '/shop/shoes/view-all?colorVal=black'

const MockedHeadComponent = ({ children }) => <div>{children}</div>
jest.mock('next/head')
jest.mocked(Head).mockImplementation(MockedHeadComponent)
jest.mock('jotai/utils')
const mockedUseAtomValue = jest.mocked(useAtomValue)

const makeSetup = (customRenderOptions?) => {
  const component = <SeoPaginationLinkTags />
  const result = render(component, customRenderOptions)
  return result
}

function getLinkHref(container, relValue) {
  const link = container.querySelector(`[rel="${relValue}"]`)
  return link?.getAttribute('href')
}

describe('SeoPaginationLinkTags tests', () => {
  it.each([
    {
      atomValue: { nextUrl: `${INITIAL_PATH}&page=2` },
      expected: {
        prev: undefined,
        next: `${INITIAL_PATH}&page=2&startFrom=2`,
      },
    },
    {
      atomValue: { nextUrl: `${INITIAL_PATH}&page=3`, prevUrl: INITIAL_PATH },
      expected: {
        prev: `${INITIAL_PATH}`,
        next: `${INITIAL_PATH}&page=3&startFrom=3`,
      },
    },
    {
      atomValue: { prevUrl: `${INITIAL_PATH}&page=2` },
      expected: {
        prev: `${INITIAL_PATH}&page=2&startFrom=2`,
        next: undefined,
      },
    },
  ])('should render proper prev and next links', ({ atomValue, expected }) => {
    mockedUseAtomValue.mockImplementation(() => atomValue)
    const { container } = makeSetup()

    expect(getLinkHref(container, 'prev')).toBe(expected.prev)
    expect(getLinkHref(container, 'next')).toBe(expected.next)
  })
})
