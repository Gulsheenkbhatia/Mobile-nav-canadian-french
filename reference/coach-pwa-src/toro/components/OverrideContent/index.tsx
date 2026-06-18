import Box from 'toro/components/Box'
import useGlobalSlotAtomData from 'hooks/useGlobalSlotAtomData'

export default function OverrideContent() {
  const { content: overrideContent } = useGlobalSlotAtomData('override-content') as {
    content: string
  }

  return (
    <Box
      id="override-content"
      display="none"
      dangerouslySetInnerHTML={{
        __html: overrideContent,
      }}
    />
  )
}
