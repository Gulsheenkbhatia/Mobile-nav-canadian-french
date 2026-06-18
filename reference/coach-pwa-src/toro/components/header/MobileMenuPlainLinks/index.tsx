import { memo, useMemo } from 'react'
import Box from 'toro/components/Box'
import PlainLink from 'toro/components/header/MobileMenuPlainLinks/PlainLink'
import { useAtomValue } from 'jotai/utils'
import menuDataAtom from 'store/menu-data.atom'
import { getCategoriesByCgIds } from 'toro/helpers/menu'

const MobileMenuPlainLinks = () => {
  const menuData = useAtomValue(menuDataAtom)

  return useMemo(() => <MobileMenuPlainLinksContent menuData={menuData} />, [])
}

const MobileMenuPlainLinksContent = ({ menuData }) => {
  const t1Categories = getCategoriesByCgIds(menuData, menuData?.topCategories as string[])

  const t1 = t1Categories.map((cat) => ({
    cgid: cat.cgid,
    name: cat.name,
    url: cat.thredUpFlag ? '/' : cat.url,
    ...(cat.subCategories?.length && { subCategories: cat.subCategories }),
  }))

  const t2 = []
  const t3 = []

  for (const t1Cat of t1) {
    if (!t1Cat.subCategories) {
      continue
    }

    const t2Categories = getCategoriesByCgIds(menuData, t1Cat.subCategories)
    for (const t2Cat of t2Categories) {
      t2.push({
        cgid: t2Cat.cgid,
        name: t2Cat.name,
        url: t2Cat.thredUpFlag ? '/' : t2Cat.url,
        t1Parent: t2Cat.parentCategoryId,
        ...(t2Cat.subCategories && { subCategories: t2Cat.subCategories }),
      })

      if (!t2Cat.subCategories) {
        continue
      }

      const t3Categories = getCategoriesByCgIds(menuData, t2Cat.subCategories)
      for (const t3Cat of t3Categories) {
        t3.push({
          cgid: t3Cat.cgid,
          name: t3Cat.name,
          url: t3Cat.thredUpFlag ? '/' : t3Cat.url,
          t1Parent: t3Cat.parentCategoryTree[0]?.cgid,
          t2Parent: t3Cat.parentCategoryId,
        })
      }
    }
  }

  return (
    <Box
      width="0"
      height="0"
      visibility="hidden"
      display="inline-block"
      overflow="hidden"
      position="absolute"
    >
      {[...t1, ...t2, ...t3].map((cat) => (
        <PlainLink key={cat.cgid} url={cat.url} name={cat.name} />
      ))}
    </Box>
  )
}

export default memo(MobileMenuPlainLinks)
