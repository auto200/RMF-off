import React from "react";
import styled from "styled-components";
import { headerHeight } from "../utils/constants";
import { FaMoon, FaSun } from "react-icons/fa";

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: ${headerHeight + "px"};
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
`;
const ToggleTheme = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  font-size: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
`;
const Filters = styled.div``;

const Header = ({
  toggleTheme,
  colorTheme,
  currentFilterType,
  filterValue,
  setFilter,
  filterTypes
}) => {
  const handleFilterTypeChange = e => {
    const val = e.target.value;
    setFilter([val, filterValue]);
  };
  const handleFilterInputChange = e => {
    const val = e.target.value;
    setFilter([currentFilterType, val]);
  };
  return (
    <Wrapper>
      <ToggleTheme onClick={toggleTheme} title="Zmień schemat kolorów">
        {colorTheme === "dark" ? <FaMoon /> : <FaSun />}
      </ToggleTheme>
      <Filters>
        <select value={currentFilterType} onChange={handleFilterTypeChange}>
          {Object.entries(filterTypes).map(filter => (
            <option key={filter[0]} value={filter[0]}>
              {filter[1]}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterInputChange}
        />
      </Filters>
    </Wrapper>
  );
};

export default Header;
