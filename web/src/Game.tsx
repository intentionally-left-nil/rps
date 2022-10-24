import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlayerName from './PlayerName';
import { useLocalStorage } from './util';
import InvitePlayer from './Invite';

const Game: React.FC<{ id: string }> = ({ id }) => {
  const [name, setName] = useLocalStorage('name', 'Player 1');
  const [opponentName, setOpponentName] = useState();

  return (
    <Container fluid className="pt-3">
      <Row>
        <Col>
          <Row>
            <PlayerName id="player1" initial={name} onNameChange={setName} />
          </Row>
        </Col>
        <Col>
          {opponentName ? (
            <Row>
              <PlayerName id="player2" initial={opponentName} readOnly={true} />
            </Row>
          ) : (
            <InvitePlayer id={id} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Game;
