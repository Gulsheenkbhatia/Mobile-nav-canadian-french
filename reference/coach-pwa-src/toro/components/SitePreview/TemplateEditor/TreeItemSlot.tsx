import { type FC, type SyntheticEvent } from 'react'
import type { ITemplateComponentsKeys } from 'toro/helpers/templating/types'
import Select from 'toro/components/Select'
import useStyles from 'toro/hooks/useStyles'

type TreeItemSlotProps = {
  components: ITemplateComponentsKeys[]
  onChange: (event: SyntheticEvent<HTMLSelectElement>) => void
}

const TreeItemSlot: FC<TreeItemSlotProps> = ({ components, onChange }) => {
  const styles = useStyles()

  return (
    <Select
      sx={styles.treeItemSlot}
      aria-label="Add new component"
      placeholder="Add new component"
      onChange={onChange}
    >
      {components.map((component) => (
        <option key={component} value={component}>
          {component}
        </option>
      ))}
    </Select>
  )
}

export default TreeItemSlot
