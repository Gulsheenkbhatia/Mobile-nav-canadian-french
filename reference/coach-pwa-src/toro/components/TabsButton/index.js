import TabList from 'toro/components/TabList'
import Tabs from 'toro/components/Tabs'
import Tab from 'toro/components/Tab'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'

const TabsButton = ({ tabsData, styles, translationGroup, activeTabIndex, onTabChange }) => {
  const { formatMessage } = useIntl()
  return (
    <Tabs index={activeTabIndex} onChange={onTabChange} variant="unstyled">
      <TabList>
        {tabsData?.map((item, index) => {
          return (
            <Tab key={index} sx={styles.countryTabs(activeTabIndex === index)}>
              {formatMessage({
                id: `${translationGroup}.${item?.toLocaleLowerCase?.()}`,
                defaultMessage: item,
              })}
            </Tab>
          )
        })}
      </TabList>
    </Tabs>
  )
}

TabsButton.propTypes = {
  tabsData: PropTypes.array,
  styles: PropTypes.object,
  translationGroup: PropTypes.string,
  activeTabIndex: PropTypes.number,
  onTabChange: PropTypes.func,
}

TabsButton.defaultProps = {
  tabsData: [],
  styles: {},
  activeTabIndex: 0,
  translationGroup: '',
  onTabChange: () => {},
}

export default TabsButton
