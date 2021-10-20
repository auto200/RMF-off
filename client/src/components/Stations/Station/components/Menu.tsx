import {
  IconButton,
  Link,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { BiDotsVerticalRounded, BiLinkExternal } from "react-icons/bi";
import { FaGoogle, FaYoutube } from "react-icons/fa";

interface MenuProps {
  searchQuery: string;
}
//chakra menu is heavy to rerender for some reason
export const Menu: React.FC<MenuProps> = memo(({ searchQuery }) => {
  return (
    <ChakraMenu isLazy>
      <MenuButton
        as={IconButton}
        my="auto"
        aria-label="Menu"
        icon={<BiDotsVerticalRounded />}
        isRound={true}
        fontSize="2xl"
        bg="transparent"
      />
      <MenuList py={0}>
        <MenuItem
          as={Link}
          icon={<FaGoogle />}
          h="50px"
          command={(<BiLinkExternal />) as any}
          href={`https://www.google.com/search?q=${searchQuery}`}
          isExternal
        >
          Szukaj w Google
        </MenuItem>
        <MenuItem
          as={Link}
          icon={<FaYoutube />}
          h="50px"
          command={(<BiLinkExternal />) as any}
          href={`https://www.youtube.com/results?search_query=${searchQuery}`}
          isExternal
        >
          Szukaj w YouTube
        </MenuItem>
      </MenuList>
    </ChakraMenu>
  );
});
