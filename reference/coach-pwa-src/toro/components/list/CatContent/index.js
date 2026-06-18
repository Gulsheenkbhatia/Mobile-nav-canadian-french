import LandingContent from 'toro/cms/components/LandingContent'

export default function CatContent({ slots, hasVideoContent = false }) {
  return <LandingContent slots={slots} hasVideoContent={hasVideoContent} />
}
