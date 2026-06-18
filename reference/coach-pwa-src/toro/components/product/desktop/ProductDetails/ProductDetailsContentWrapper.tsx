import { useBreakpointValue } from '@chakra-ui/react'
import { type FC } from 'react'
import Flex from 'toro/components/Flex'
import SectionSlider from 'toro/components/product/desktop/SectionSlider'
import ContentImpressionWrapper from 'toro/components/product/desktop/ContentImpressionWrapper'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { SplideProps } from '@splidejs/react-splide'

type ProductDetailsContentWrapperProps = {
  styles: any
  onMove?: (idx: number) => void
  hasCardDetails: boolean
  options?: SplideProps['options']
  customPaginationVariant?: string
  customPagination?: boolean
}

const defaultOptions = {
  start: 0,
  arrows: false,
  width: '100vw',
  autoWidth: true,
  type: 'slide',
  gap: '16px',
}

const ProductDetailsContentWrapper: FC<ProductDetailsContentWrapperProps> = ({
  children,
  styles,
  onMove,
  hasCardDetails,
  options,
  customPaginationVariant,
  customPagination = true,
}) => {
  const wrapperType = useBreakpointValue(
    { base: 'slider', desktopMax: 'flex' },
    { fallback: 'slider' }
  )
  const Wrapper = wrapperType === 'slider' ? SectionSlider : Flex
  const wrapperProps =
    wrapperType === 'slider'
      ? {
          sliderOptions: { ...defaultOptions, ...options },
          customStyles: styles,
          onMove,
          customPaginationVariant,
          customPagination,
        }
      : { sx: styles.productDetailsContent }

  return (
    <ConditionalWrapper
      Wrapper={ContentImpressionWrapper}
      condition={hasCardDetails}
      eventAction="visual product details impression"
    >
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </ConditionalWrapper>
  )
}
export default ProductDetailsContentWrapper
