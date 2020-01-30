import React, { memo } from "react";
import styled from "styled-components";
import ActionButton from "../ActionButton/ActionButton";
import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 10px;
  color: ${({ theme }) => theme.colors.highlightText};
`;
const CoverContainer = styled(motion.div).attrs(({ cover, defaultCover }) => ({
  style: {
    backgroundImage: `url(${cover}), url(${defaultCover})`
  }
}))`
  position: relative;
  font-size: 70px;
  color: ${({ theme }) => theme.colors.highlightText};
  cursor: pointer;
  width: 95%;
  height: 300px;
  background-position: center;
  background-size: cover;

  /* brightness filter */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, ${({ theme }) => theme.imgBrightness});
    transition: background-color 0.3s;
  }
`;

const ActionButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  opacity: ${({ isActive }) => (isActive ? 0.7 : 0)};
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${({ isActive }) => !isActive && 0.7};
  }
`;
const Text = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  h1 {
    margin: 0;
  }
`;
const Tail = memo(
  ({
    stationName,
    cover,
    songName,
    artist,
    defaultCover,
    streamURL,
    //player props
    id,
    isActive,
    handleActionButtonClick
  }) => {
    const handleClick = () => {
      if (isActive) {
        handleActionButtonClick(null, true);
      } else {
        handleActionButtonClick({
          id,
          stationName,
          cover: cover || defaultCover,
          songName,
          artist,
          streamURL
        });
      }
    };
    //TODO: button to search in youtube/google

    return (
      <Wrapper>
        <Title>{stationName}</Title>
        <AnimatePresence exitBeforeEnter>
          <CoverContainer
            cover={cover}
            defaultCover={defaultCover}
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={id + songName}
          >
            <ActionButtonWrapper isActive={isActive}>
              <ActionButton isActive={isActive} />
            </ActionButtonWrapper>
          </CoverContainer>
        </AnimatePresence>
        <Text>
          {(songName && artist && (
            <>
              <h2 style={{ color: isActive && "red" }}>{songName}</h2>
              <p>{artist}</p>
            </>
          )) || <h1>reklamy/wiadomości</h1>}
        </Text>
      </Wrapper>
    );
  }
);

export default Tail;
