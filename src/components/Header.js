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
`;

const Header = ({ toggleTheme, colorTheme }) => {
  return (
    <Wrapper>
      <ToggleTheme onClick={toggleTheme} title="Zmień schemat kolorów">
        {colorTheme === "dark" ? <FaMoon /> : <FaSun />}
      </ToggleTheme>
    </Wrapper>
  );
};

export default Header;
