import React from 'react';
const InvitePlayer: React.FC<{ id: string }> = ({ id }) => {
  const url = `http://localhost:5000/game/${id}`;
  return (
    <div>
      <p>Waiting for an opponent to join. Send them an invite!</p>
      <p>
        Come join me for a game of rock, paper scissors! at{' '}
        <a href={url}>{url}</a>
      </p>
    </div>
  );
};
export default InvitePlayer;
