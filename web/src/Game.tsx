import React, { useCallback, useState, useMemo } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlayerName from './PlayerName';
import { useBackend, useLocalStorage } from './util';
import InvitePlayer from './Invite';
import { v4 as uuid4 } from 'uuid';

const Game: React.FC<{ id: string }> = ({ id }) => {
  const [name, setName] = useLocalStorage('name', 'Player 1');
  const [userId] = useLocalStorage('user_id', uuid4());
  const [playerId, setPlayerId] = useState<string>();
  const [opponentName, setOpponentName] = useState();
  const playerData = useMemo(() => {
    return {
      user_id: userId,
      name,
    };
  }, [name, userId]);

  const onJoinGame = useCallback<(data: { player_id: string }) => void>(
    ({ player_id }) => {
      setPlayerId(player_id);
    },
    []
  );

  useBackend(`game/${id}`, 'POST', playerData, onJoinGame);

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
