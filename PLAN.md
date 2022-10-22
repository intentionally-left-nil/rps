# Milestone 1

- Primary constraint: time
- A lot to do between FE and BE - focus on BE for now
- Game design: low-friction, social game (maybe on TV with phone component)
- No global registration, just any /game/123 can be instantly made into a game
- First two players to join get the spots
- Backend needs to store the game, and communicate changes to interested parties

## Goal

Be able to have the first two players join an arbitrary game.
Allow players to complete rounds by submitting their turns

## Non-goals

- Authentication. Stakes are low, and if you want to cheat so be it
- Lobby discovery. That entire mechanic would come from a different system
- Notifications (this will be milestone 2)
- Leaving games, or resetting state. Players can just create a new game instead

### Plan (30 min)

1. Use docker to spin up redis
1. Use python + flask to create an API
   1. POST /game/123 to join a game
   1. POST /game/123/round/1 to make a turn for the game
   1. GET routes to retreive the current state of the world

### Data model

hash in redis:
key: game123.
Values: {
p1: json(user_id, name, etc...)
p2: json(user_id, name, etc...)
round: 1,
round1_p1: rock,
round1_p2: paper,
etc. etc.
}
Can only create roundN_p1 iff roundN-1_p1 and roundN-1_p2 exist (unless beginning)

Can increment round when roundN_p1 and p2 have played
