import redis, time
r = redis.StrictRedis(host='localhost', port=6379, db=0)
while True:
    r.pubsub()
    r.publish("sse", "{\"data\": {\"message\": \"Hello!\"}, \"type\": \"beacon\"}")
    # r.set('foo', 'bar') # PUBLISH sse "{\"data\": {\"message\": \"Hello!\"}, \"type\": \"beacon\"}"
    time.sleep(1)
