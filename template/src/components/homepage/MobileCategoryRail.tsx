import type { HomepageCategory } from '../../data/homepageData'

type MobileCategoryRailProps = {
  categories: HomepageCategory[]
  title?: string
}

export function MobileCategoryRail({
  categories,
  title = 'Shop by category',
}: MobileCategoryRailProps) {
  return (
    <section className="py-coach-lg" aria-label={title}>
      <div className="mb-coach-m flex items-end justify-between px-coach-m">
        <h2 className="type-title-2 text-coach-black">{title}</h2>
        <button
          type="button"
          className="text-sm tracking-[0.2px] text-coach-black underline underline-offset-2"
        >
          Shop all
        </button>
      </div>
      <div className="home-category-rail__scroll">
        {categories.map((category) => (
          <a
            key={category.id}
            href="#"
            className="home-category-rail__tile"
            onClick={(e) => e.preventDefault()}
          >
            <div
              className="home-category-rail__image"
              style={{ background: category.imageBg }}
            />
            <p className="mt-coach-xs text-center text-sm font-bold tracking-[0.2px]">
              {category.name}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
