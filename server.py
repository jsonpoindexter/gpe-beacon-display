# !/usr/bin/env python
import json
import sys
import redis

from flask import Flask, Response, request
from flask_sse import sse
from jsonschema import validate, ValidationError, SchemaError
from logging.config import dictConfig

redis = redis.StrictRedis(host='localhost', port=6379, db=0)

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__, static_url_path='')
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix='/stream')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/beacon/rider', methods=['GET', 'POST'])
def rider():
    if request.method == 'POST':
        body = {
            "type": "object",
            "properties": {
                "rider": {"type": "string"},
                "id": {"type": "number"},
            },
            "required": ["rider", "id"]
        }

        req_body = request.get_json(silent=True)

        print(req_body)

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

        redis.set("beacon:rider:%s" % req_body['id'], req_body['rider'])

        # Publish beacon data for flask/frontend SSE
        redis.publish("sse", json.dumps({
            'data': {
                'id': req_body['id'],
                'rider': req_body['rider']
            },
            'type': 'beacon:rider'
        }))

        return Response(json.dumps(req_body), status=200, mimetype='application/json')


@app.route('/beacon/driver', methods=['GET', 'POST'])
def driver():
    if request.method == 'POST':
        body = {
            "type": "object",
            "properties": {
                "driver": {"type": "string"},
                "id": {"type": "number"},
            },
            "required": ["driver", "id"]
        }

        req_body = request.get_json(silent=True)

        print(req_body)

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

        redis.set("beacon:driver:%s" % req_body['id'], req_body['driver'])

        # Publish beacon data for flask/frontend SSE
        redis.publish("sse", json.dumps({
            'data': {
                'id': req_body['id'],
                'driver': req_body['driver']
            },
            'type': 'beacon:label'
        }))

        return Response(json.dumps(req_body), status=200, mimetype='application/json')


@app.route('/beacon/label', methods=['GET', 'POST'])
def label():
    if request.method == 'POST':
        body = {
            "type": "object",
            "properties": {
                "label": {"type": "string"},
                "id": {"type": "number"},
            },
            "required": ["label", "id"]
        }

        req_body = request.get_json(silent=True)

        print(req_body)

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

        redis.set("beacon:label:%s" % req_body['id'], req_body['label'])

        # Publish beacon data for flask/frontend SSE
        redis.publish("sse", json.dumps({
            'data': {
                'id': req_body['id'],
                'label': req_body['label']
            },
            'type': 'beacon:label'
        }))

        return Response(json.dumps(req_body), status=200, mimetype='application/json')


@app.route('/beacon/active', methods=['GET', 'POST'])
def active():
    if request.method == 'POST':
        body = {
            "type": "object",
            "properties": {
                "id": {"type": "number"},
                "active": {"type": "boolean"}
            },
            "required": ["id", "active"]
        }

        req_body = request.get_json(silent=True)

        print(req_body)

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

        redis.set("beacon:active:%s" % req_body['id'], req_body['active'])

        redis.publish("sse", json.dumps({
            'data': {
                'id': req_body['id'],
                'active': req_body['active']
            },
            'type': 'beacon:active'
        }))

        return Response(json.dumps(req_body), status=200, mimetype='application/json')


@app.route("/beacons", methods=['GET'])
def beacons():
    beacon_array = []
    beacons = redis.hgetall("beacons")
    for beacon_id, beacon in beacons.items():

        beacon_id = beacon_id.decode("utf-8")

        message = json.loads(beacon.decode('utf8').replace("'", '"'))

        label = redis.get("beacon:label:%s" % beacon_id)
        if label is not None:
            message = {**message, **{'label': label.decode("utf-8")}}
        else:
            message = {**message, **{'label': label}}

        driver = redis.get("beacon:driver:%s" % beacon_id)
        if driver is not None:
            message = {**message, **{'driver': driver.decode("utf-8")}}
        else:
            message = {**message, **{'driver': driver}}

        rider = redis.get("beacon:rider:%s" % beacon_id)
        if rider is not None:
            message = {**message, **{'rider': rider.decode("utf-8")}}
        else:
            message = {**message, **{'rider': label}}

        active = redis.get("beacon:active:%s" % beacon_id)
        if active is not None:
            message = {**message, **{'active': active.decode("utf-8")}}
        else:
            message = {**message, **{'active': active}}

        beacon_array.append(message)

    return Response(json.dumps(beacon_array), status=200, mimetype='application/json')


if __name__ == '__main__':
    app.run(port="8080")
