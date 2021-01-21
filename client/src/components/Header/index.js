import React from "react";
import { headerHeight } from "../../utils/constants";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

const Header = ({ currentFilterType, filterValue, setFilter, filterTypes }) => {
  const { toggleColorMode } = useColorMode();

  const handleFilterTypeChange = (e) => {
    const val = e.target.value;
    setFilter([val, filterValue]);
  };
  const handleFilterInputChange = (e) => {
    const val = e.target.value;
    setFilter([currentFilterType, val]);
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
          value={currentFilterType}
          onChange={handleFilterTypeChange}
          fontWeight="bold"
          css={{
            "& option": {
              fontWeight: 500,
            },
          }}
        >
          {Object.entries(filterTypes).map(([key, val]) => (
            <option key={key} value={key}>
              {val}
            </option>
          ))}
        </Select>
        <Input
          placeholder="szukaj"
          value={filterValue}
          onChange={handleFilterInputChange}
          fontWeight="bold"
        />
      </HStack>
    </Flex>
  );
};

export default Header;

Header.propTypes = {
  currentFilterType: PropTypes.string.isRequired,
  filterValue: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  filterTypes: PropTypes.object.isRequired,
};
