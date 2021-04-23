#!/usr/bin/env python

from flask import Flask, Response, jsonify
from importlib import import_module
from markupsafe import escape
import grpc
import time
from camera import Camera
from flask_cors import CORS, cross_origin
import logging

# grpc connection to video-edge-ai-proxy
options = [('grpc.max_receive_message_length', 50 * 1024 * 1024)] # max image size (50 Mb)
channel = grpc.insecure_channel('127.0.0.1:50001', options=options)

cam = Camera(channel)

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
logging.getLogger('flask_cors').level = logging.DEBUG


@app.route("/camera_list", methods=['GET'])
@cross_origin()
def camera_list():
    """ returns list of cameras """
    cam_list = cam.get_camera_list()
    return jsonify(cam_list)

@app.route("/person", methods=['POST','GET'])
def add_person():
    pass

def gen(Camera, cam_name):
    """ Video streaming generator """

    while True:
        frame = Camera.get_frame(cam_name)
        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(1)

@app.route('/video_feed/<cam_name>')
@cross_origin()
def video_feed(cam_name):
    """Video streaming route. Put this in the src attribute of an img tag."""

    return Response(gen(cam, escape(cam_name)),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    # init Camera module
    cam.daemon = True
    cam.start()
    app.run(host='0.0.0.0', threaded=True)
    cam.join()