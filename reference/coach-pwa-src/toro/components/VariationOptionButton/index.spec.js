import React from 'react'
import { cleanup, render } from '@testing-library/react'
import VariationOptionButton from 'toro/components/VariationOptionButton/index.js'
import get from 'lodash/get'

jest.mock('toro/hooks/useMultiStyleConfig', () => () => ({
  sizeVariationButton: {},
}))
jest.mock('lodash/get')

describe('VariationOptionButton', () => {
  const baseProps = {
    label: 'Size',
    variantType: 'Size',
    isQuickView: false,
    isBundleVariant: false,
    isNewMegaPDPEligible: false,
    isNeutralSizingApplicable: false,
  }

  afterEach(cleanup)

  it('renders correctly with minimum props', () => {
    const { getByRole } = render(<VariationOptionButton {...baseProps} />)
    expect(getByRole('button')).toBeTruthy()
  })

  it('applies selected class when selected is true', () => {
    const { getByRole } = render(<VariationOptionButton {...baseProps} selected={true} />)
    expect(getByRole('button')).toHaveClass('selected')
  })

  it('applies allow-disabled class when disabled and allowClickOnDisabled are true', () => {
    const { getByRole } = render(
      <VariationOptionButton {...baseProps} disabled={true} allowClickOnDisabled={true} />
    )
    expect(getByRole('button')).toHaveClass('allow-disabled')
  })

  it('applies material-button class when label is not size and isNewMegaPDPEligible is true', () => {
    const { getByRole } = render(
      <VariationOptionButton {...baseProps} label="Material" isNewMegaPDPEligible={true} />
    )
    expect(getByRole('button')).toHaveClass('material-button')
  })

  it('sets data-qa attribute based on variantType and state', () => {
    get.mockImplementation((obj, path) => path)
    const { getByRole } = render(<VariationOptionButton {...baseProps} selected={true} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_slctd')
  })

  it('handles variantType as size affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Size', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_slctd')
  })

  it('handles variantType as size, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Size', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_dsbld')
  })

  it('handles variantType as size, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Size', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_enbld')
  })

  it('handles variantType as width and selected as true affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Width', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_width_swatch_slctd')
  })

  it('handles variantType as width, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Width', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_width_swatch_dsbld')
  })

  it('handles variantType as width, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Width', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_width_swatch_enbld')
  })

  it('handles variantType as material affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Material', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_material_swatch_slctd')
  })

  it('handles variantType as material, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Material', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_material_swatch_dsbld')
  })

  it('handles variantType as material, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Material', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_material_swatch_enbld')
  })

  it('handles variantType as style type affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Style Type', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_styletype_swatch_slctd')
  })

  it('handles variantType as style type, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Style Type', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_styletype_swatch_dsbld')
  })

  it('handles variantType as style type, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Style Type', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_styletype_swatch_enbld')
  })

  it('handles variantType as heel height affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Heel Height', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_heelheight_swatch_slctd')
  })

  it('handles variantType as heel height, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Heel Height', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_heelheight_swatch_dsbld')
  })

  it('handles variantType as heel height, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Heel Height', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_heelheight_swatch_enbld')
  })

  it('handles variantType as bag size affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Bag Size', selected: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_slctd')
  })

  it('handles variantType as bag size, selected as false and disabled as true, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Bag Size', selected: false, disabled: true }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_dsbld')
  })

  it('handles variantType as bag size, selected as false and disabled as false, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Bag Size', selected: false, disabled: false }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    expect(getByRole('button')).toHaveAttribute('data-qa', 'cm_link_size_swatch_enbld')
  })
  it('handles variantType other than any of the defined type, affecting data-qa attribute', () => {
    get.mockImplementation((obj, path) => path)
    const props = { ...baseProps, variantType: 'Bag' }
    const { getByRole } = render(<VariationOptionButton {...props} />)
    const expectedDataQa = ` `
    expect(getByRole('button')).toHaveAttribute('data-qa', expectedDataQa)
  })
})
