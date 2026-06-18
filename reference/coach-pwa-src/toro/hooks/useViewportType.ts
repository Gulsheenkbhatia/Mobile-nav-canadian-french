import { useContext } from 'react'
import ViewportContext from 'toro/components/ViewportContext'
import { ViewportContextType } from 'test-utils/ContextValuesTypes'

export default function useViewportType(): ViewportContextType {
  const viewPorts = useContext(ViewportContext)
  return viewPorts
}
