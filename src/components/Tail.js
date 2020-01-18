import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.lightDark};
`;
const Title = styled.h1`
  font-size: 35px;
  font-weight: bold;
  margin: 10px;
  color: ${({ theme }) => theme.colors.whitest};
`;
const Cover = styled.img`
  max-width: 300px;
  filter: brightness(0.7);
  object-fit: cover;
`;
const Text = styled.div`
  color: ${({ theme }) => theme.colors.white};
  h1 {
    margin: 0;
  }
`;
const Tail = ({
  stationName,
  cover,
  songName,
  artist,
  defaultCover,
  onClick
}) => {
  return (
    <Wrapper onClick={onClick}>
      <Title>{stationName}</Title>
      <div>
        <Cover src={cover || defaultCover} />
      </div>
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
};

export default Tail;
