import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Player = ({ url }) => {
  const audioRef = useRef();
  useEffect(() => {
    if (url) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    }
  }, [url]);
  return (
    <Wrapper>
      <audio src={url} controls ref={audioRef} />
    </Wrapper>
  );
};

export default Player;
