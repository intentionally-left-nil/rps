import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import { generateSlug } from 'random-word-slugs';

const Home: React.FC = () => {
  const onClick = useCallback(() => {
    window.location.href = `/game/${generateSlug(4)}`;
  }, []);
  return (
    <div>
      <h1>Rock, Paper, Scissors</h1>
      <Button onClick={onClick}>Create a game</Button>
    </div>
  );
};

export default Home;
