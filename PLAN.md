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

# Milestone 2

- Milestone 1 took a lot of time (joys of working in a new codebase and working out the kinks)
- Two major remaining backend features remain: push notifications and playing against the computer
- Notifications aren't strictly necessary as we can have the clients poll for now. So let's generate an AI

For the AI we can:

- Do it fully in the frontend (in which case no backend work is required)
- Do it in the backend (requiring new endpoints to submit the robot turn, or otherwise indicate p2 is a robot)

So, if we run out of time, we can say that the AI is complete from the backend perspective ;) and the frontend can just call `['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]`

But, a cool feature would be to have the ability to train a model to act like a person

- Take my previous rounds. Feed my choices and my opponents choices into a model
- Generate a model where the goal is to accurately predict what I'll do next
- Create an AI which just inverts the result to 'win'. And then you can do Math.random() to have difficulty levels on the AI if necessary

## Generating a model

Again, not much time, so let's just go with a RandomForest classifier, since intuition is that humans use a sliding window of the last N rounds along with their own bias to compute a move. We can just call shift() to generate the N-1 inputs for both the player and their opponent and train the model on predicting player(n)

In order to make this work we'll need as much data as we can get, and then an API to generate/regenerate the model and then an API to get the next prediction

## Goal

Create a worker microservice that can take in training data and compute a model that predicts what a player will choose.
Make an API to create a model for a given dataset, which farms out to the microservice and then stores the results somewhere (redis for now)
Make an API to have the computer guess for the player, instead of it being passed in. This will use the existing model (or fallback to Random() if it's not there yet).

### Non goals

Ideally we would save all player data across multiple games but we can do that in a future milestone.
We're not going to do any analysis into the correct algorithm to use, or look at it's accuracy or recall. If the bot is wrong, it's not a big deal.

### Plan (30 minutes)

- Spin up a microservice that can handle jobs from redis and store results.
- Use pandas to create dataframes with a sliding window for the data and run it through a RandomForestClassifier
