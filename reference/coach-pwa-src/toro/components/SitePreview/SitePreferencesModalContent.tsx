import {
  AccordionPanel,
  Input,
  VStack,
  Badge,
  Divider,
  ButtonGroup,
  HStack,
} from '@chakra-ui/react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback, useMemo, useState } from 'react'
import { preferencesAtom } from 'store/preferences.atom'
import Accordion from 'toro/components/Accordion'
import AccordionButton from 'toro/components/AccordionButton'
import AccordionIcon from 'toro/components/AccordionIcon'
import AccordionItem from 'toro/components/AccordionItem'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import {
  BooleanEditField,
  JsonEditField,
  ListEditField,
  NumberEditField,
  StringEditField,
} from './PreferenceDiplayItem'
import useDebounce from 'toro/helpers/useDebounce'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { setForceAppRemountKeyAtom } from 'store/site-preview.atom'

const DEBOUNCE_TIME = 500

const SitePreferencesModalContent = ({ onClose, onSubmit }) => {
  const preferences = useAtomValue(preferencesAtom)
  const setPreferences = useUpdateAtom(preferencesAtom)
  const setForceAppRemountKey = useUpdateAtom(setForceAppRemountKeyAtom)
  const [matchingKeyString, setMatchingKeyString] = useState('')
  const [updatedPreferences, setUpdatedPreferences] = useState(preferences)
  const debouncedMatchingKeyString = useDebounce(matchingKeyString, DEBOUNCE_TIME)
  const [accordionKey, setAccordionKey] = useState(1)

  const filteredPreferenceGroupKeys = useMemo(() => {
    const sortedKeys = Object.keys(updatedPreferences).sort((groupA, groupB) =>
      groupA.localeCompare(groupB)
    )
    if (matchingKeyString.length < 3) return sortedKeys

    return sortedKeys.filter((groupKey) =>
      groupKey.toLowerCase().includes(debouncedMatchingKeyString.toLowerCase())
    )
  }, [updatedPreferences, debouncedMatchingKeyString])

  const onPreferenceChange = useCallback((groupKey, preferenceKey, value) => {
    setUpdatedPreferences((prev) => ({
      ...prev,
      [groupKey]: { ...prev[groupKey], [preferenceKey]: value },
    }))
  }, [])

  const onRevert = useCallback(() => {
    setUpdatedPreferences(preferences)
    setAccordionKey(0)
  }, [preferences])

  const onUpdatePreferences = useCallback(() => {
    setPreferences(updatedPreferences)
    onSubmit()
    setForceAppRemountKey()
  }, [updatedPreferences])

  return (
    <>
      <Text as="h2">Site Preferences</Text>
      <Input
        my={2}
        placeholder="Filter by group name"
        value={matchingKeyString}
        onChange={(e) => setMatchingKeyString(e.target.value)}
      />
      <VStack py={4} height="calc(100vh - 20rem)" overflowY="scroll">
        <Accordion
          key={accordionKey}
          w="100%"
          allowToggle
          allowMultiple
          onMouseOver={() => setAccordionKey(1)}
        >
          {filteredPreferenceGroupKeys.length ? (
            filteredPreferenceGroupKeys.map((groupKey) => (
              <PreferenceGroupItem
                key={groupKey}
                groupKey={groupKey}
                groupPreferences={updatedPreferences[groupKey]}
                onChange={(preferenceKey: string, value) =>
                  onPreferenceChange(groupKey, preferenceKey, value)
                }
              />
            ))
          ) : (
            <Text size="sm" color="grey" fontStyle="italic">
              No matching preference group
            </Text>
          )}
        </Accordion>
      </VStack>
      <Flex py="3">
        <ButtonGroup w="100%">
          <VStack w="100%" align="stretch">
            <HStack w="100%" align="stretch">
              <Button w="100%" bg="blue.800" onClick={onUpdatePreferences}>
                Update preferences
              </Button>
              <Button w="100%" bg="red.800" onClick={onRevert}>
                Revert changes
              </Button>
            </HStack>
            <Button onClick={onClose}>Close</Button>
          </VStack>
        </ButtonGroup>
      </Flex>
    </>
  )
}

const PreferenceGroupItem = ({ groupKey, groupPreferences, onChange }) => {
  const sortedPreferences = useMemo(
    () => Object.keys(groupPreferences).sort((prefA, prefB) => prefA.localeCompare(prefB)),
    [groupPreferences]
  )

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text size="s">{groupKey}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {isExpanded && (
              <Accordion w="100%" allowToggle>
                {sortedPreferences.map((pref) => (
                  <PreferenceItem
                    key={pref}
                    preferenceKey={pref}
                    preferenceValue={groupPreferences[pref]}
                    onChange={(value) => onChange(pref, value)}
                  />
                ))}
              </Accordion>
            )}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

const PreferenceItem = ({ preferenceKey, preferenceValue, onChange }) => {
  const {
    type,
    colorScheme = 'gray',
    Component,
  } = useMemo(() => {
    const type = typeof preferenceValue
    switch (type) {
      case 'number':
        return { type, colorScheme: 'green', Component: NumberEditField }
      case 'boolean':
        return { type, colorScheme: 'cyan', Component: BooleanEditField }
      case 'string':
        return { type, colorScheme: 'orange', Component: StringEditField }
      case 'object': {
        const isArray = Array.isArray(preferenceValue)
        return {
          type: isArray ? 'list' : 'json',
          colorScheme: isArray ? 'blue' : 'red',
          Component: isArray ? ListEditField : JsonEditField,
        }
      }
      default:
        return { type }
    }
  }, [preferenceValue])

  return (
    <AccordionItem my={1} width="100%" borderRadius="md" borderWidth="1px">
      <AccordionButton>
        <Box flex="1" textAlign="left" overflow="hidden">
          <Text fontSize="small" maxWidth="100%" textOverflow="ellipsis" fontWeight="light">
            {preferenceKey}
          </Text>
        </Box>
        <Badge
          size="xs"
          fontSize="2xs"
          borderRadius="full"
          colorScheme={colorScheme}
          variant="solid"
        >
          {type}
        </Badge>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Divider mb="2" />
        {Component ? (
          <Component value={preferenceValue} onChange={onChange} />
        ) : (
          JSON.stringify(preferenceValue)
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}

export default SitePreferencesModalContent
