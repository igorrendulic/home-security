from threading import Thread, Lock
import time
import video_streaming_pb2,video_streaming_pb2_grpc
import numpy as np
import cv2
import imutils

class Camera(Thread):

    def __init__(self, channel) -> None:
        """ init thread and connect to chrys edge proxy grpc server """
        Thread.__init__(self)
        self.grpc_stub = video_streaming_pb2_grpc.ImageStub(channel)
        self.cameras_frame = {} # current frame from specific camera stored

    def gen_image_request(self, device_name, keyframe_only=False) -> video_streaming_pb2.VideoFrameRequest:
        """ Create an object to request a video frame """
        req = video_streaming_pb2.VideoFrameRequest()
        req.device_id = device_name
        req.key_frame_only = keyframe_only
        return req

    def gen_list_stream_request(self):
        """ Create a list of streams request object """
        stream_request = video_streaming_pb2.ListStreamRequest()   
        responses = self.grpc_stub.ListStreams(stream_request)
        for stream_resp in responses:
            yield stream_resp

    def get_frame(self, camera_name):
        """ Store the latest frame from specific camera into a dictionary """
        
        if camera_name in self.cameras_frame:
            jpg = self.cameras_frame[camera_name]
            return jpg

        return None

    def get_camera_list(self):
        return list(self.cameras_frame.keys())

    def run(self):
        """ use grpc_stub to continously request frames """
        cam_list_request = self.gen_list_stream_request()
        for cam in cam_list_request:
            cam_name = cam.name
            self.cameras_frame[cam_name] = None
            print("found camera: ---> ", cam)
        
        while True:

            for cam_name in list(self.cameras_frame.keys()):

                try:
                    req = self.gen_image_request(device_name=cam_name,keyframe_only=True)
                    frame = self.grpc_stub.VideoLatestImage(req)

                    if frame:

                        # read raw frame data and convert to numpy array
                        img_bytes = frame.data 
                        re_img = np.frombuffer(img_bytes, dtype=np.uint8)

                        # reshape image back into original dimensions
                        if len(frame.shape.dim) > 0:
                            reshape = tuple([int(dim.size) for dim in frame.shape.dim])
                            re_img = np.reshape(re_img, reshape)

                            re_img = imutils.resize(re_img, width=960)

                            tmp=cv2.imencode('.jpg',re_img) #this returns a tuple.
                            jpg_frame=tmp[1].tobytes() #bytes containing compressed JPEG image
                            self.cameras_frame[cam_name] = jpg_frame
                            print("current frame added to ", cam_name, frame.dts, len(jpg_frame))
                            jpg_frame = None

                except Exception as ex:
                    print(ex)

            time.sleep(1)


        
         
        
    