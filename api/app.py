import os
from flask import Flask, jsonify
app = Flask('api')


@app.route('/')
def heartbeat():
    return jsonify({'ok': True, 'version': 1})


if __name__ == "__main__":
    # TODO: debug/production configuration based on runtime flags
    app.run(debug=True, host='0.0.0.0', port=5000)
