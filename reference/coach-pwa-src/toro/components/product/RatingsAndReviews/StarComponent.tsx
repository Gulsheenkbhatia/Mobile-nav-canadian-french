import { FC, memo, SVGAttributes } from 'react'
import StarIcon from 'toro/components/ReviewOverlayOnImage/icon/white-star.svg'
import useMultiStyleComponent, { MultiStyleComponent } from 'toro/hooks/useMultiStyleComponent'

type StarProps = {
  variant: 'empty' | 'half' | 'full'
  width: SVGAttributes<any>['width']
  height: SVGAttributes<any>['height']
  isQuickView: boolean
  reviewImgOverlay: boolean
}

const HalfStarOnly: FC<SVGAttributes<any>> = (props) => {
  // Hook is evaluated only when this component is rendered
  // (i.e., for half star which is ideal case is atmost once
  // in case of floating ratings like 3.5, 4.7 etc)
  const { HalfStar } = useMultiStyleComponent(MultiStyleComponent.icons)
  return <HalfStar id="icon-half-star" {...props} />
}

const StarComponent: FC<StarProps> = ({
  variant,
  width,
  height,
  isQuickView,
  reviewImgOverlay,
}) => {
  const iconProps = {
    width,
    height,
    viewBox: '0 0 24 24',
  }

  if (reviewImgOverlay && variant !== 'empty') {
    return <StarIcon {...iconProps} viewBox="0 0 15 15" />
  }

  if (variant === 'empty') {
    return (
      <svg {...iconProps} data-qa={isQuickView ? 'cm_icon_pt_rs_blank' : 'cm_icon_pt_rs_blank'}>
        <use href="#icon-empty-star" />
      </svg>
    )
  }
  if (variant === 'half') {
    return (
      <HalfStarOnly
        id="icon-half-star"
        {...iconProps}
        data-qa={isQuickView ? 'cm_icon_pt_rs_half' : 'cm_icon_pt_rs_half'}
      />
    )
    // The half star appears distorted in Safari on iPhone 16 because Safari is stricter in rendering
    //  <use> references, especially when those involve <mask>, <clipPath>, or gradients.
    //  Unlike Chrome, Safari fails to resolve these when symbols are externally referenced or when
    //  viewBox/mask units aren’t defined properly. Other icons work fine because they use simpler paths.
    //  To fix it, we should inline the half star SVG or use it as a React component directly, so I used
    //  the HalfStar component is directly used because svg is causing problem in rendering in safari
    //  iphone 16 half star getting distorted to half rectangle
  }

  return (
    <svg {...iconProps} data-qa={isQuickView ? 'cm_icon_pt_rs_filled' : 'cm_icon_pt_rs_filled'}>
      <use href="#icon-star" />
    </svg>
  )
}

export default memo(StarComponent)
