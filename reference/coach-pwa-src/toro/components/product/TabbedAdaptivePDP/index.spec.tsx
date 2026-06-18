import React from 'react'
import { render } from '@testing-library/react'
import TabbedAdaptivePDP from 'toro/components/product/TabbedAdaptivePDP'
import TabbedAdaptivePDPUpper from 'toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPUpper'

jest.mock('toro/components/product/TabbedAdaptivePDP/TabbedAdaptivePDPUpper', () => {
  return jest.fn(() => <div>Mocked TabbedAdaptivePDPUpper</div>)
})

describe('TabbedAdaptivePDP', () => {
  it('should render TabbedAdaptivePDPUpper with the correct props', () => {
    const tabbedPDPLower = <div>Mocked TabbedPDPLower</div>
    const { getByText } = render(<TabbedAdaptivePDP tabbedPDPLower={tabbedPDPLower} />)
    expect(getByText('Mocked TabbedAdaptivePDPUpper')).toBeInTheDocument()
    expect(TabbedAdaptivePDPUpper).toHaveBeenCalledWith({ tabbedPDPLower }, {})
  })
})
