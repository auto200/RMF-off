import {
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useStore } from "contexts/StoreContext";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { ImSearch } from "react-icons/im";
import { HEADER_HEIGHT } from "utils/constants";
import useDebounce from "utils/hooks/useDebounce";

const FILTER_DEBOUNCE_DELAY = 300;

const Header: React.FC = () => {
  const { setSearchFilterValue, isLoading } = useStore();
  const { toggleColorMode } = useColorMode();
  const [localSearchFilterValue, setLocalSearchFilterValue] = useState("");
  const debouncedSearchFilterValue = useDebounce(
    localSearchFilterValue,
    FILTER_DEBOUNCE_DELAY
  );

  useEffect(() => {
    setSearchFilterValue(debouncedSearchFilterValue);
  }, [debouncedSearchFilterValue, setSearchFilterValue]);

  return (
    <Flex
      pos="fixed"
      top={0}
      left={0}
      width="100%"
      height={HEADER_HEIGHT + "px"}
      zIndex="docked"
      justifyContent="space-between"
      alignItems="center"
      background={useColorModeValue("gray.300", "gray.700")}
    >
      <IconButton
        aria-label={useColorModeValue("Tryb Jasny", "Tryb Ciemny")}
        icon={useColorModeValue(<FaMoon />, <FaSun />)}
        onClick={toggleColorMode}
        title="Zmień schemat kolorów"
        fontSize="3xl"
        mx={[1, 4]}
        isRound
        bg="transparent"
      />
      <HStack pr={[1, 4]}>
        <InputGroup>
          <Input
            placeholder="stacja, utwór, wykonawca"
            value={localSearchFilterValue}
            onChange={(e) => setLocalSearchFilterValue(e.target.value)}
            fontWeight="bold"
            _placeholder={{
              color: useColorModeValue("blackAlpha.600", "whiteAlpha.600"),
            }}
            borderColor={useColorModeValue("blackAlpha.800", "whiteAlpha.800")}
            disabled={isLoading}
          />
          <InputRightElement>
            <ImSearch />
          </InputRightElement>
        </InputGroup>
      </HStack>
    </Flex>
  );
};

export default Header;
