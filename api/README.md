# Rock Paper Scissors API

This microservice contains the REST endpoints needed to create and play new games. It uses redis to store the data.
Each game is a redis hash with the key `f'game:{game_id}'` which would contain data similar to the following:

```python
{
  p1: json({"id": "uuid1234", "name": "Ada"}),
  p2: json({"id": "uuid9876", "name": "Ash"}),
  p1_score: 1,
  p2_score: 1,
  round: 3, # 1 indexed
  p1_r1: 'rock',
  p2_r1: 'paper',
  p1_r2: 'rock',
  p2_r2: 'scissors'
}
```

# Endpoints

The following endpoints exist to manipulate the game

## Game Management

### Join a game

`http POST localhost:5000/game/1 id=uuid1234 name=Ada`

Returns `{"player_id": "p1"}`

Also can be used to change the username (consider making this a PATCH api in the future). Subsequent calls return the same player_id. Can't leave a game once joined. Can't join a game that already has 2 players.

### Game state

`http GET localhost:5000/game/1`

Returns:

```python
{
  p1: {"name": "Ada", "score": 1},
  p1: {"name": "Ash", "score": 1},
  current_round: 3
}
```

## Round management

### Take your turn

`http POST localhost:5000/game/1/round/1 player_id=1 move=rock`
Returns 200 if successful, else 400 if already played or otherwise not valid

### View the round result

`http GET localhost:5000/game/1/round/1`
Returns:

```python
{
  p1: 'rock',
  p2: null, # before the other player moves, then paper
}
```

### View all rounds

TBD: pagination, querying etc.

`http GET localhost:5000/game/1/round`

Returns: array of a round from the previous endpoint

# Development

Prepare your environment by:

```bash
cd api
python -m venv venv
source ./venv/bin/activate
pip install requirements.txt
```

## Running in docker

In the root directory, `docker-compose up --build api`
