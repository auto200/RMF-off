import {
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useStore } from "../../contexts/StoreContext";
import { HERADER_HEIGHT } from "../../utils/constants";
import { SEARCH_FILTER } from "../../utils/enums";
import useDebounce from "../../utils/hooks/useDebounce";

const DEBOUNCE_DELAY = 300;

const Header: React.FC = () => {
  const { searchFilterType, setSearchFilterType, setSearchFilterValue } =
    useStore();
  const { toggleColorMode } = useColorMode();
  const [localSearchFilterValue, setLocalSearchFilterValue] = useState("");
  const debouncedSearchFilterValue = useDebounce(
    localSearchFilterValue,
    DEBOUNCE_DELAY
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
      height={HERADER_HEIGHT + "px"}
      zIndex="docked"
      justifyContent="space-between"
      alignItems="center"
      background={useColorModeValue("gray.50", "gray.700")}
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
        <Select
          value={searchFilterType}
          onChange={(e) => setSearchFilterType(e.target.value as SEARCH_FILTER)}
          fontWeight="bold"
          sx={{
            "& option": {
              fontWeight: 500,
            },
          }}
        >
          <option value={SEARCH_FILTER.STATION_NAME}>Nazwa Stacji</option>
          <option value={SEARCH_FILTER.ARTIST}>Wykonawca</option>
          <option value={SEARCH_FILTER.SONG_NAME}>Nazwa utworu</option>
        </Select>
        <Input
          placeholder="szukaj"
          value={localSearchFilterValue}
          onChange={(e) => setLocalSearchFilterValue(e.target.value)}
          fontWeight="bold"
        />
      </HStack>
    </Flex>
  );
};

export default Header;
