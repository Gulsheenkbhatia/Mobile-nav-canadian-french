import dynamic from 'next/dynamic'
import withOffload from './withOffload'
import { render, waitFor, act, screen } from '@testing-library/react'
import { useEffect } from 'react'

const LOADED_ID = 'lodaded'
const FALLBACK_ID = 'fallback'

const mockComponentLoad = jest.fn()

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((...props) => {
    const dynamicModule = jest.requireActual('next/dynamic')
    const dynamicActualComp = dynamicModule.default
    const RequiredComponent = dynamicActualComp(props[0])
    return RequiredComponent
  }),
}))

const DynamicComponent = dynamic(() =>
  import('toro/components/Box').then((ComponentModule) => {
    mockComponentLoad()
    return ComponentModule
  })
)

const ParentComponent = ({ loadOnMount = false, options = {} }) => {
  const [load, OffloadedComponent] = withOffload(DynamicComponent, options)
  useEffect(() => {
    if (loadOnMount) {
      load()
    }
  }, [loadOnMount])

  return <OffloadedComponent data-testid={LOADED_ID} />
}

describe('withOffload higher-order component', () => {
  it('Prevents dynamic component from getting loaded initially', () => {
    render(<ParentComponent />)
    expect(mockComponentLoad).not.toBeCalled()
  })

  it('Loads dynamic component when load function is called', async () => {
    await act(() => render(<ParentComponent loadOnMount />))
    expect(mockComponentLoad).toBeCalled()
    expect(screen.getByTestId(LOADED_ID)).toBeInTheDocument()
  })

  it('Renders fallback component until main component is loaded', () => {
    const { getByTestId } = render(
      <ParentComponent options={{ fallback: () => <div data-testid={FALLBACK_ID} /> }} />
    )
    expect(getByTestId(FALLBACK_ID)).toBeInTheDocument()
  })

  it('Forcefully loads component without having to call load function when forceLoad is true', async () => {
    const { getByTestId } = render(<ParentComponent options={{ forceLoad: true }} />)
    await waitFor(() => {
      expect(getByTestId(LOADED_ID)).toBeInTheDocument()
    })
  })
})
