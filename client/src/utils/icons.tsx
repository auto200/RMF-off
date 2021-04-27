import { keyframes } from "@chakra-ui/react";
import Icon from "@chakra-ui/icon";
import { AiOutlineLoading } from "react-icons/ai";

const spinKeyframes = keyframes`
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
`;

const spin = `${spinKeyframes} 2s linear infinite`;

export const LoadingIcon = <Icon as={AiOutlineLoading} animation={spin} />;
