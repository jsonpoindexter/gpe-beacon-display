import random
import redis
import time
import json

max_beacons = 5

r = redis.StrictRedis(host='localhost', port=6379, db=0)
r.pubsub()

beacons = []


class Beacon:
    def __init__(self, id, coords, heading):
        self.id = id
        self.coords = coords
        self.heading = heading


for id in range(max_beacons):
    beacons.append(
        Beacon(
            id,
            [40.7645145852504, -119.21121839614607],
            int(round(random.randint(0, 360)))
        ))

while True:
    # select random beacon
    beacon = beacons[random.randint(0, max_beacons - 1)]

    # generate random movement
    beacon.coords[0] = beacon.coords[0] + random.uniform(-10, 10) / 10000
    beacon.coords[1] = beacon.coords[1] + random.uniform(-10, 10) / 10000

    # generate random heading
    beacon.heading = beacon.heading + int(round(random.uniform(-15, 15)))

    r.publish("sse", json.dumps({
        'data': {
            'id': beacon.id,
            'coords': beacon.coords,
            'heading': beacon.heading
        },
        'type': 'beacon'
    }))

    time.sleep(.5)
