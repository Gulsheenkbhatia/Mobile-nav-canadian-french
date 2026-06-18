import useTheme from 'toro/hooks/useTheme'

import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import { FormLabel, FormControl } from '@chakra-ui/react'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import PayPalButton from 'toro/components/Paypal'
import Select from 'toro/components/Select'

const payPalModalTitle = 'Please select your shipping destination to continue'

export default function PayPalModal({ onClose, styles, onPayPal, handleChange, payCountry }) {
  const theme = useTheme()
  const { space } = theme

  return (
    <Modal onClose={onClose} isOpen isCentered>
      <ModalOverlay />
      <ModalContent sx={styles.customModalContent}>
        <Box sx={styles.customModalFormWrapper}>
          <FormControl>
            <FormLabel sx={styles.customFormText}>{payPalModalTitle}</FormLabel>
            <Select
              name="sortBy"
              onChange={handleChange}
              className="w-100 pr-0"
              sx={styles.filterDropdownText}
              value={payCountry}
            >
              <option value="" disabled hidden>
                Select your country
              </option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
            </Select>
          </FormControl>
          <Box
            position="relative"
            bottom="0"
            left="0"
            right="0"
            pl="0 !important"
            pr="0 !important"
            m="0"
            sx={styles.cartButtonsMainWrapper}
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              m="36px 0"
              sx={{ gap: theme.space.mar, ...styles.cartButtonsWrapper }}
              h="36px"
            >
              {!!payCountry?.length && (
                <PayPalButton
                  onClick={onPayPal}
                  data-qa="mb_cntnr_paypal"
                  payCountry={payCountry}
                  width="100%"
                  countryMandatory="true"
                />
              )}
              <Button
                variant="primary"
                size="lg"
                w="100%"
                position={'absolute'}
                zIndex={0}
                onClick={onPayPal}
                data-qa="mb_btn_paypal"
              >
                Submit
              </Button>
            </Flex>
          </Box>
        </Box>

        <ModalCloseButton
          top={space.l}
          right={space.l}
          sx={{
            '&:focus': {
              boxShadow: 'none',
            },
            '& svg': { width: space.m, height: space.m },
          }}
        />
      </ModalContent>
    </Modal>
  )
}
