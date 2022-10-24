import React, { useCallback, useState, useMemo, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlayerName from './PlayerName';
import { useBackend, useLocalStorage } from './util';
import InvitePlayer from './Invite';
import { v4 as uuid4 } from 'uuid';
import { Socket } from 'phoenix-socket';

const useSocket = (id: string, onGameUpdated: () => void) => {
  useEffect(() => {
    const socket = new Socket('ws://localhost:4000/socket');
    socket.connect();
    const channel = socket.channel(`game_room:${id}`);
    channel.join();
    channel.on('game_updated', (resp: any) => {
      console.log('game_updated', resp);
      onGameUpdated();
    });
    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, [id, onGameUpdated]);
};

const Game: React.FC<{ id: string }> = ({ id }) => {
  const [name, setName] = useLocalStorage('name', 'Player 1');
  const [userId] = useLocalStorage('user_id', uuid4());
  const [playerId, setPlayerId] = useState<string>();
  const [opponent, setOpponent] = useState<{
    name: string;
    score: number;
  } | void>();
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
  const onOpponentJoined = useCallback<
    (data: {
      current_round: string;
      p1: { name: string; score: number } | void;
      p2: { name: string; score: number } | void;
    }) => void
  >(
    (data) => {
      console.log(data);
      if (playerId == null) {
        return;
      }
      const opponentId = playerId === 'p1' ? 'p2' : 'p1';

      setOpponent(data[opponentId]);
    },
    [playerId]
  );

  useBackend(`game/${id}`, 'POST', playerData, onJoinGame);

  const [pollId, setPollId] = useState(0);
  const onGameUpdated = useCallback(() => {
    setPollId((val) => val + 1);
  }, []);
  useSocket(id, onGameUpdated);

  useBackend(
    `game/${id}`,
    'GET',
    useMemo(() => ({ pollId }), [pollId]),
    onOpponentJoined
  );

  return (
    <Container fluid className="pt-3">
      <Row>
        <Col>
          <Row>
            <PlayerName id="player1" initial={name} onNameChange={setName} />
          </Row>
        </Col>
        <Col>
          {opponent ? (
            <Row>
              <div>{opponent.name}</div>
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
