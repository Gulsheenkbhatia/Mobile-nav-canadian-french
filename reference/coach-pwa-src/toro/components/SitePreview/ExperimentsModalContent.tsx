import { useAtomValue } from 'jotai/utils'
import { ComponentType, Suspense, useCallback, useMemo, useState } from 'react'
import { previewExperimentsAtom } from 'store/site-preview.atom'
import Cookies from 'js-cookie'
import CircularProgress from 'toro/components/CircularProgress'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { Divider, Heading, HStack, Input, List, VStack } from '@chakra-ui/react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Checkbox from 'toro/components/Checkbox'
import Flex from 'toro/components/Flex'
import ListItem from 'toro/components/ListItem'
import { OPTIMIZELY_ENABLED, OPTIMIZELY_ENABLED_FEATURES } from 'toro/constants/cookies'

type ExperimentsModalContentProps = {
  onClose: () => void
}

const ContentsWrapper: ComponentType = ({ children }) => {
  return (
    <Flex minH="615px" maxH="90vh" flexDirection="column" m="4">
      {children}
    </Flex>
  )
}

const ExperimentsModalContent = ({ onClose }: ExperimentsModalContentProps) => {
  const previewExperiments = useAtomValue(previewExperimentsAtom)
  const [segmentList, setSegmentList] = useState(previewExperiments.defaultList)
  const [evergreenKeyword, setEvergreenKeyword] = useState('')
  const [optionsKeyword, setOptionsKeyword] = useState('')
  const [isInteractionBlocked, setIsInteractionBlocked] = useState(false)

  const updateSegmentList = useCallback((key: string) => {
    const stateUpdateHandler = (prevList) =>
      prevList.includes(key) ? prevList.filter((v) => v !== key) : [...prevList, key]
    setSegmentList(stateUpdateHandler)
  }, [])

  const applyAndRefresh = useCallback(() => {
    const newCookieValue = segmentList.join('-')
    if (!!segmentList.length) {
      Cookies.set(OPTIMIZELY_ENABLED_FEATURES, newCookieValue)
    } else {
      Cookies.remove(OPTIMIZELY_ENABLED_FEATURES)
    }
    Cookies.set(OPTIMIZELY_ENABLED, 'false')
    setIsInteractionBlocked(true)
    window.location.reload()
  }, [segmentList])

  const clearAll = useCallback(() => {
    setSegmentList([])
  }, [])

  const evergreenFilteredByKeyword = useMemo(() => {
    return previewExperiments.evergreenTests.filter(
      (test) => !evergreenKeyword || test.name.toLowerCase().includes(evergreenKeyword)
    )
  }, [evergreenKeyword, previewExperiments.evergreenTests])

  const optionsFilteredByKeyword = useMemo(() => {
    return previewExperiments.options.filter(
      (test) => !optionsKeyword || test.name.toLowerCase().includes(optionsKeyword)
    )
  }, [optionsKeyword, previewExperiments.options])

  const isListUpdated =
    segmentList.sort().toString() !== previewExperiments.defaultList.sort().toString()

  return (
    <ContentsWrapper>
      <Heading as="h3" size="sm" mb="1">
        Evergreen
      </Heading>
      <Input
        variant="flushed"
        mb="2"
        size="sm"
        placeholder="Keyword search"
        value={evergreenKeyword}
        onChange={(e) => setEvergreenKeyword(e.target.value)}
      />
      <Box
        mb="2"
        p="1"
        h="200px"
        border="1px"
        borderColor="gray"
        borderRadius="4px"
        overflowY="scroll"
      >
        <List>
          {evergreenFilteredByKeyword.map((test) => (
            <ListItem
              key={test.name}
              fontSize="14"
              borderBottom="1px"
              borderColor="lightGray"
              bg={test.enabled ? 'transparent' : 'lightGray'}
            >
              {test.name}
            </ListItem>
          ))}
          )
        </List>
      </Box>
      <Divider my="2" />
      <Heading as="h3" size="sm" mb="1">
        Segment
      </Heading>
      <Input
        variant="flushed"
        mb="2"
        size="sm"
        placeholder="Keyword search"
        value={optionsKeyword}
        onChange={(e) => setOptionsKeyword(e.target.value)}
      />
      <Box
        mb="2"
        p="1"
        h="200px"
        border="1px"
        borderColor="gray"
        borderRadius="4px"
        overflowY="scroll"
      >
        <List>
          {optionsFilteredByKeyword.map((test) => (
            <ListItem key={test.name} fontSize="14" borderBottom="1px" borderColor="lightGray">
              <Checkbox
                size="sm"
                isChecked={segmentList.includes(test.key)}
                isDisabled={isInteractionBlocked}
                onChange={() => updateSegmentList(test.key)}
              >
                {test.name}
              </Checkbox>
            </ListItem>
          ))}
          )
        </List>
      </Box>
      <VStack mt="4">
        <Button
          w="100%"
          bg="black"
          isDisabled={!segmentList.length || isInteractionBlocked}
          color="white"
          onClick={clearAll}
        >
          Clear all
        </Button>
        <HStack w="100%">
          <Button
            bg="black"
            isDisabled={!isListUpdated || isInteractionBlocked}
            color="white"
            w="50%"
            onClick={applyAndRefresh}
          >
            Apply
          </Button>
          <Button
            bg="red"
            isDisabled={isInteractionBlocked}
            color="white"
            flex="1"
            onClick={onClose}
          >
            Back
          </Button>
        </HStack>
      </VStack>
    </ContentsWrapper>
  )
}

const FallbackModalContents = () => {
  return (
    <ContentsWrapper>
      <CircularProgress isIndeterminate m="auto" />
    </ContentsWrapper>
  )
}

const SuspendedExperimentsModal = (props: ExperimentsModalContentProps) => {
  return (
    <Suspense fallback={<FallbackModalContents />}>
      <ExperimentsModalContent {...props} />
    </Suspense>
  )
}

export default withErrorBoundaryWrapper(SuspendedExperimentsModal)
