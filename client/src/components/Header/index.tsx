import {
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { headerHeight } from "../../utils/constants";
import { searchFilters } from "../../utils/enums";

interface IProps {
  searchFilterType: searchFilters;
  searchFilterValue: string;
  setFilter: React.Dispatch<React.SetStateAction<[searchFilters, string]>>;
}
const Header: React.FC<IProps> = ({
  searchFilterType,
  searchFilterValue,
  setFilter,
}) => {
  const { toggleColorMode } = useColorMode();

  const handleSearchFilterTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = e.target.value as unknown as searchFilters;
    setFilter([val, searchFilterValue]);
  };
  const handleSearchFilterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setFilter([searchFilterType, val]);
  };

  return (
    <Flex
      pos="fixed"
      top={0}
      left={0}
      width="100%"
      height={headerHeight + "px"}
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
      ></IconButton>
      <HStack pr={[1, 4]}>
        <Select
          value={searchFilterType}
          onChange={handleSearchFilterTypeChange}
          fontWeight="bold"
          sx={{
            "& option": {
              fontWeight: 500,
            },
          }}
        >
          <option value={searchFilters.STATION_NAME}>Nazwa Stacji</option>
          <option value={searchFilters.ARTIST}>Wykonawca</option>
          <option value={searchFilters.SONG_NAME}>Nazwa utworu</option>
        </Select>
        <Input
          placeholder="szukaj"
          value={searchFilterValue}
          onChange={handleSearchFilterInputChange}
          fontWeight="bold"
        />
      </HStack>
    </Flex>
  );
};

export default Header;
