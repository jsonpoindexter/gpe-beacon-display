# !/usr/bin/env python
from flask import Flask, request
from flask_sse import sse

app = Flask(__name__, static_url_path='')
app.config["REDIS_URL"] = "redis://localhost"
app.register_blueprint(sse, url_prefix='/stream')

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/hello')
def publish_hello():
    sse.publish({"message": "Hello!"}, type='greeting')
    return "Message sent!"

if __name__ == '__main__':
    app.run(port="8080")