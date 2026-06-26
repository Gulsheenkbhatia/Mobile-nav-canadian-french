import { CoachButton } from './CoachButton'
import type { HomepageProduct } from '../../data/homepageData'
import { MobileProductCard } from './MobileProductCard'

type MobileProductGridProps = {
  products: HomepageProduct[]
  title: string
  subtitle: string
}

export function MobileProductGrid({ products, title, subtitle }: MobileProductGridProps) {
  return (
    <section className="px-coach-m py-coach-xl" aria-label={title}>
      <div className="mb-coach-lg text-center">
        <h2 className="type-title-2 text-coach-black">{title}</h2>
        <p className="mt-coach-xs text-sm tracking-[0.2px] text-coach-grey-60">
          {subtitle}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-coach-s gap-y-coach-m">
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-coach-xl text-center">
        <CoachButton variant="secondary">View all</CoachButton>
      </div>
    </section>
  )
}
