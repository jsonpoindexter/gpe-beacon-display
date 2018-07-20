# !/usr/bin/env python
import json
import sys
import redis

from flask import Flask, Response, request
from flask_sse import sse
from jsonschema import validate, ValidationError, SchemaError

redis = redis.StrictRedis(host='localhost', port=6379, db=0)

app = Flask(__name__, static_url_path='')
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix='/stream')

@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/beacon/label', methods=['GET', 'POST'])
def label():
    if request.method == 'POST':
        body = {
            "type": "object",
            "properties": {
                "label": {"type": "string"},
                "id": {"type": "number"},
                "active": {"type": "boolean"}
            },
            "required": ["label", "id", "active"]
        }

        req_body = request.get_json(silent=True)

        if req_body is None:
            return "Body is None", 422

        try:
            validate(req_body, body)
        except ValidationError:
            print(sys.exc_info()[0])
            return "ValidationError", 422
        except SchemaError:
            print(sys.exc_info()[0])
            return "SchemaError", 422
        except:
            print(sys.exc_info()[0])
            return "Unexpected error", 422

        return Response(json.dumps(body), status=200, mimetype='application/json')


@app.route('/beacons', methods=['GET'])
def beacons():
    beacon_array = []
    beacons = redis.hgetall("beacons")
    for beacon_id, beacon in beacons.items():
        beacon_array.append(json.loads(beacon.decode('utf8').replace("'", '"')))
    return Response(json.dumps(beacon_array), status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(port="8080")
