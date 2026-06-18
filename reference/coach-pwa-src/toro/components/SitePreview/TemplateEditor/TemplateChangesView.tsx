import { type FC, useEffect } from 'react'
import { useCallback, useMemo, useState } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import {
  convertTreeToConfig,
  getTemplateConfigChanges,
} from 'toro/components/SitePreview/TemplateEditor/utils'
import { pdpTemplateEditorAtom } from 'store/pdp-template-editor.atom'
import { TemplateRenderMode } from 'toro/helpers/templating/types'
import BASE_CONFIG from 'toro/helpers/templating/baseConfig'

type TemplateChangesViewProps = {
  onClose: () => void
}

const TemplateChangesView: FC<TemplateChangesViewProps> = ({ onClose }) => {
  const styles = useMultiStyleConfig('TemplateEditor')
  const { tree, renderMode, uniqueIds } = useAtomValue(pdpTemplateEditorAtom)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const id = window.setTimeout(() => setCopied(false), 1000)
    return () => window.clearTimeout(id)
  }, [copied])

  const finalTemplateJson = useMemo(
    () =>
      JSON.stringify(
        {
          renderMode,
          slots:
            renderMode === TemplateRenderMode.MERGE
              ? getTemplateConfigChanges(BASE_CONFIG, tree, uniqueIds)
              : convertTreeToConfig(tree),
        },
        null,
        2
      ),
    [tree, renderMode, uniqueIds]
  )

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(finalTemplateJson)
      setCopied(true)
    } catch (error) {
      setCopied(false)
    }
  }, [finalTemplateJson])

  return (
    <>
      <Box as="h3" sx={styles.title}>
        Final Template
      </Box>
      <Box sx={styles.main}>
        <Box as="textarea" value={finalTemplateJson} readOnly sx={styles.textarea} />
      </Box>
      <Box sx={styles.footer}>
        <Button onClick={onClose}>Back</Button>
        <Button sx={styles.copyButton} onClick={copyToClipboard} disabled={copied}>
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </Button>
      </Box>
    </>
  )
}

export default TemplateChangesView
