import type { BrandId } from '../NavSearchExposed'
import { BrandTabList } from '../BrandTabList'
import {
  getT1PressureCategories,
  getT1PressureImageNote,
  getT1PressureL1ContentSpots,
  getT1PressureL2ContentSpots,
} from '../../../data/t1PressureTest'
import { T1L1MenuPreview, T1L2DrillPreview } from './T1PressurePreview'
import type { ReactNode } from 'react'
import { useState } from 'react'

function PressureFrame({
  label,
  note,
  children,
}: {
  label: string
  note?: string
  children: ReactNode
}) {
  return (
    <div className="nav-t1-pressure__frame">
      <div className="nav-t1-pressure__frame-label">
        <span className="nav-t1-pressure__frame-title">{label}</span>
        {note && <span className="nav-t1-pressure__frame-note">{note}</span>}
      </div>
      <div className="nav-gallery__preview nav-t1-pressure__preview">{children}</div>
    </div>
  )
}

function BrandL1Section({ brand }: { brand: BrandId }) {
  const categories = getT1PressureCategories(brand)
  const brandLabel = brand === 'coach' ? 'Coach' : 'Coach Outlet'

  return (
    <section
      id={`${brand}-l1`}
      className="nav-gallery__section nav-t1-pressure__brand-section"
    >
      <h2 className="nav-gallery__heading">{brandLabel} — L1 menu (all T1s)</h2>
      <p className="nav-gallery__note">
        {brand === 'coach'
          ? 'L1 collage above T1 list.'
          : 'L1 collage below T1 list (after Gifts, before utility links).'}
      </p>
      <div className="nav-t1-pressure__compare">
        <PressureFrame label="With L1 images">
          <T1L1MenuPreview
            brand={brand}
            categories={categories}
            l1ContentSpots={getT1PressureL1ContentSpots(brand, true)}
          />
        </PressureFrame>
        <PressureFrame label="Without L1 images">
          <T1L1MenuPreview
            brand={brand}
            categories={categories}
            l1ContentSpots={getT1PressureL1ContentSpots(brand, false)}
          />
        </PressureFrame>
      </div>
    </section>
  )
}

function BrandT1Section({ brand }: { brand: BrandId }) {
  const categories = getT1PressureCategories(brand)
  const brandLabel = brand === 'coach' ? 'Coach' : 'Coach Outlet'

  return (
    <>
      {categories.map((cat) => {
        const imageNote = getT1PressureImageNote(brand, cat.id)
        const withSpots = getT1PressureL2ContentSpots(cat.id, brand, true)
        const withoutSpots = getT1PressureL2ContentSpots(cat.id, brand, false)

        return (
          <section
            key={`${brand}-${cat.id}`}
            id={`${brand}-${cat.id}`}
            className="nav-gallery__section"
          >
            <h2 className="nav-gallery__heading">
              {brandLabel} — T1: {cat.label}
            </h2>
            {imageNote && <p className="nav-gallery__note">{imageNote}</p>}
            <div className="nav-t1-pressure__compare">
              <PressureFrame label="With L2 images" note={imageNote}>
                <T1L2DrillPreview
                  brand={brand}
                  categoryId={cat.id}
                  title={cat.label}
                  contentSpots={withSpots}
                />
              </PressureFrame>
              <PressureFrame label="Without L2 images">
                <T1L2DrillPreview
                  brand={brand}
                  categoryId={cat.id}
                  title={cat.label}
                  contentSpots={withoutSpots}
                />
              </PressureFrame>
            </div>
          </section>
        )
      })}
    </>
  )
}

/** T1 pressure test — `?gallery=t1` */
export function NavT1PressureGallery() {
  const [activeBrand, setActiveBrand] = useState<BrandId>('coach')
  const coachCategories = getT1PressureCategories('coach')
  const outletCategories = getT1PressureCategories('outlet')

  const tocItems = [
    { id: 'coach-l1', label: 'Coach L1' },
    ...coachCategories.map((c) => ({
      id: `coach-${c.id}`,
      label: `Coach · ${c.label}`,
    })),
    { id: 'outlet-l1', label: 'Outlet L1' },
    ...outletCategories.map((c) => ({
      id: `outlet-${c.id}`,
      label: `Outlet · ${c.label}`,
    })),
  ]

  return (
    <div className="nav-gallery nav-t1-pressure v1-prototype min-h-[100dvh] bg-coach-white px-coach-m pb-coach-xl pt-coach-m font-extended text-coach-black">
      <header className="nav-gallery__header mb-coach-l">
        <h1 className="text-[24px] leading-[1.2] tracking-[0.4px]">
          T1 Navigation — Image Pressure Test
        </h1>
        <p className="mt-coach-xs text-[14px] leading-[1.35] text-coach-grey-60">
          Side-by-side layouts for Coach and Coach Outlet T1 categories — with
          and without content images. Coach: L1 images on top. Outlet: L1 images
          on bottom of the open menu.
        </p>
        <div className="mt-coach-s flex flex-wrap items-center gap-coach-m">
          <a href="/" className="text-[14px] underline">
            ← Back to interactive prototype
          </a>
          <a href="/?gallery=nav" className="text-[14px] underline">
            Layout gallery
          </a>
        </div>
      </header>

      <div className="nav-t1-pressure__tabs mb-coach-l">
        <BrandTabList
          activeBrand={activeBrand}
          onBrandChange={setActiveBrand}
          className="nav-t1-pressure__brand-tabs"
        />
        <p className="mt-coach-xs text-[12px] text-coach-grey-60">
          Jump to brand section below, or scroll all scenarios.
        </p>
      </div>

      <nav className="nav-gallery__toc nav-t1-pressure__toc mb-coach-l flex flex-wrap gap-coach-xs">
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`rounded border px-coach-xs py-1 text-[12px] ${
              item.id.startsWith(activeBrand)
                ? 'border-coach-black bg-coach-black text-coach-white'
                : 'border-coach-grey-20'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="nav-gallery__grid flex flex-col gap-coach-xl">
        <BrandL1Section brand="coach" />
        <BrandT1Section brand="coach" />
        <BrandL1Section brand="outlet" />
        <BrandT1Section brand="outlet" />
      </div>
    </div>
  )
}
