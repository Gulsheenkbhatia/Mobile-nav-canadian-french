import { useState } from 'react'
import type { HomepageProduct } from '../../data/homepageData'

type MobileProductCardProps = {
  product: HomepageProduct
}

export function MobileProductCard({ product }: MobileProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const surface = hovered ? product.imageBg2 : product.imageBg
  const tagClass =
    product.tag === 'Best Seller'
      ? 'home-product-card__tag home-product-card__tag--dark'
      : 'home-product-card__tag home-product-card__tag--light'

  return (
    <article
      className="home-product-card"
      style={{ background: surface }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="home-product-card__image">
        {product.tag && <span className={tagClass}>{product.tag}</span>}
      </div>
      <div className="home-product-card__meta">
        <p className="text-sm tracking-[0.3px] text-coach-black">{product.name}</p>
        <p className="flex items-baseline justify-center gap-2 text-sm tracking-[0.3px]">
          <span className="text-coach-black">{product.price}</span>
          {product.compareAt && (
            <span className="text-coach-grey-50 line-through">{product.compareAt}</span>
          )}
        </p>
        {product.swatches.length > 0 && (
          <div className="mt-1 flex justify-center gap-1.5">
            {product.swatches.map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full border border-black/15"
                style={{ background: color }}
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
