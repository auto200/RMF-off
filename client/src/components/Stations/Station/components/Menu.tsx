import {
  IconButton,
  Link,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import {
  BiClipboard,
  BiCopy,
  BiDotsVerticalRounded,
  BiLinkExternal,
} from "react-icons/bi";
import { FaGoogle, FaYoutube } from "react-icons/fa";

interface MenuProps {
  searchTerm: string;
}
//chakra menu is heavy to rerender for some reason
export const Menu: React.FC<MenuProps> = memo(({ searchTerm }) => {
  const { onCopy, hasCopied } = useClipboard(searchTerm);
  const toast = useToast();
  const searchQuery = encodeURIComponent(searchTerm);

  useEffect(() => {
    if (!hasCopied) {
      return;
    }

    toast({
      status: "success",
      title: "skopiowano do schowka",
      duration: 3000,
      position: "top-right",
    });
  }, [hasCopied, toast]);

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
        <MenuItem
          icon={<BiCopy />}
          h="50px"
          command={(<BiClipboard />) as any}
          onClick={onCopy}
        >
          Kopiuj do schowka
        </MenuItem>
      </MenuList>
    </ChakraMenu>
  );
});
