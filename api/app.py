import os
from flask import Flask, jsonify, make_response, g
from flask.wrappers import Request, Response
import json
import redis
from flask_expects_json import expects_json
from typing import Optional, TypedDict
from werkzeug.exceptions import BadRequest
from jsonschema import ValidationError

app = Flask('api')
r = redis.Redis(host=os.environ.get('REDIS_URL', 'localhost'))


@app.route('/')
def heartbeat():
    return jsonify({'ok': True, 'version': 1})


class User(TypedDict):
    user_id: str
    name: str


class JSONBadRequest(BadRequest):
    pass


@app.post('/game/<id>')
@expects_json({
    'type': 'object',
    'properties': {
        'user_id': {'type': 'string'},
        'name': {'type': 'string'},
    }
})
def join_game(id: str):
    if join_game_as_player(id, 'p1'):
        return jsonify({'player_id': 'p1'})
    elif join_game_as_player(id, 'p2'):
        return jsonify({'player_id': 'p2'})
    else:
        return make_error_response(400, 'already_full', 'There are already two players in the game')


def join_game_as_player(game_id: str, player_id: str) -> bool:
    # The order here is subtle and important.
    # First, we atomically try to claim the spot
    if r.hsetnx(game_key(game_id), player_id, json.dumps(g.data)) == 1:
        return True
    # If it is claimed, try to upsert the user if the id matches
    player = load_player(r.hget(game_key(game_id), player_id))
    if player and player['user_id'] == g.data['user_id']:
        r.hset(game_key(game_id), player_id, json.dumps(g.data))
        return True
    return False


# snippet from https://pypi.org/project/flask-expects-json
@app.errorhandler(400)
def bad_request(error):
    if isinstance(error.description, ValidationError):
        original_error = error.description
        return make_error_response(400, 'schema_validation', original_error.message)
    elif isinstance(error, JSONBadRequest):
        return make_error_response(400, 'invalid_json', 'The payload is not valid json or missing Content-Type')
    return make_error_response(400, 'bad_request', str(error))


def game_key(game_id: str) -> str:
    return f'game:{game_id}'


def make_error_response(code: int, type: str, message: str) -> Response:
    return make_response(jsonify({'type': type, 'message': message}), code)


def load_player(data: (bytes | None)) -> Optional[User]:
    if data:
        return json.loads(data)
    else:
        return None


def init():
    global r
    # TODO: debug/production configuration based on runtime flags
    # snippet from https://stackoverflow.com/questions/39451002/ensure-the-post-data-is-valid-json

    def on_loading_failed(self, e):
        raise JSONBadRequest()
    Request.on_json_loading_failed = on_loading_failed
    app.run(debug=True, host='0.0.0.0', port=5000)


if __name__ == "__main__":
    init()
