import useIcon from 'toro/hooks/useIcon'
import IconContainer from 'toro/components/IconContainer'
import { BagIcon } from 'toro/icons'
import { Provider } from 'jotai'
import { screen, render, renderHook } from '@testing-library/react'

jest.mock('toro/hooks/useViewportType', () => () => ({ isMobile: true }))

jest.mock('toro/icons', () => {
  return {
    ...jest.requireActual('toro/icons'),
    iconIdsMap: {
      get: (id) => () => <div data-testid={`icon-${id}`} />,
      has: (id) => id === 'bag',
    },
  }
})

const Wrapper = ({ children }) => {
  return (
    <Provider>
      <IconContainer />
      {children}
    </Provider>
  )
}

describe('Contextually-populated icon container unit test', () => {
  it('Icon component adds original svg shape for reference to an icon container on render', () => {
    render(<BagIcon />, { wrapper: Wrapper })
    expect(screen.queryByTestId('icon-bag')).toBeTruthy()
  })

  it('useIcon hook adds original svg shape for reference to an icon container on render', () => {
    renderHook(() => useIcon('bag'), { wrapper: Wrapper })
    expect(screen.queryByTestId('icon-bag')).toBeTruthy()
  })

  it('If useIcon gets passed a non-existent icon id it does not get rendered in a container', () => {
    renderHook(() => useIcon(['bag', 'non-existent']), { wrapper: Wrapper })
    expect(screen.queryByTestId('icon-bag')).toBeTruthy()
    expect(screen.queryByTestId('icon-non-existent')).toBeFalsy()
  })
})
