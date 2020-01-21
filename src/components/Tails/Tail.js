import React, { memo, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;
const Title = styled.h1`
  font-size: 35px;
  font-weight: bold;
  margin: 10px;
  color: ${({ theme }) => theme.colors.highlightText};
`;
const Cover = styled.img`
  max-width: 300px;
  filter: ${({ theme }) => `brightness(${theme.imgBrightness})`};
  transition: filter 0.3s;
  object-fit: cover;
`;
const Text = styled.div`
  color: ${({ theme }) => theme.colors.regularText};
  h1 {
    margin: 0;
  }
`;
const Tail = memo(
  ({ stationName, cover, songName, artist, defaultCover, onClick }) => {
    const imgRef = useRef({});
    console.log("tail rerender");
    const handleImgError = () => {
      imgRef.current.src = defaultCover;
    };
    return (
      <Wrapper onClick={onClick}>
        <Title>{stationName}</Title>
        <Cover
          src={cover || defaultCover}
          ref={imgRef}
          onError={handleImgError}
        />
        <Text>
          {(songName && artist && (
            <>
              <h2>{songName}</h2>
              <p>{artist}</p>
            </>
          )) || <h1>reklamy/wiadomości</h1>}
        </Text>
      </Wrapper>
    );
  }
);

export default Tail;
