import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import requests, json, time
from collections import namedtuple

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image

import cv2
cap = cv2.VideoCapture("v13.mp4")
#v71.mp4,v13.mp4
# This is needed since the notebook is stored in the object_detection folder.
sys.path.append("..")


# # Object detection imports
# Here are the imports from the object detection module.

from utils import label_map_util

from utils import visualization_utils as vis_util


# # Model preparation

# What model to download.
MODEL_NAME = 'ssd_mobilenet_v1_coco_11_06_2017'
MODEL_FILE = MODEL_NAME + '.tar.gz'
DOWNLOAD_BASE = 'http://download.tensorflow.org/models/object_detection/'

# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'

# List of the strings that is used to add correct label for each box.
PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

NUM_CLASSES = 90


# ## Download Model

# opener = urllib.request.URLopener()
# opener.retrieve(DOWNLOAD_BASE + MODEL_FILE, MODEL_FILE)
tar_file = tarfile.open(MODEL_FILE)
for file in tar_file.getmembers():
  file_name = os.path.basename(file.name)
  if 'frozen_inference_graph.pb' in file_name:
    tar_file.extract(file, os.getcwd())


# ## Load a (frozen) Tensorflow model into memory.

detection_graph = tf.Graph()
with detection_graph.as_default():
  od_graph_def = tf.GraphDef()
  with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
    serialized_graph = fid.read()
    od_graph_def.ParseFromString(serialized_graph)
    tf.import_graph_def(od_graph_def, name='')


# ## Loading label map

label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)


# ## Helper code
def cal_collision(boxes,classes,scores):
    for i, b in enumerate(boxes[0]):
            if classes[0][i] == 3 or classes[0][i] == 6 or classes[0][i] == 8:
                if scores[0][i] > 0.5:
                    for j, c in enumerate(boxes[0]):
                        if (i != j) and (classes[0][j] == 3 or classes[0][j] == 6 or classes[0][j] == 8) and scores[0][j]> 0.5:
                            Rectangle = namedtuple('Rectangle', 'xmin ymin xmax ymax')
                            ra = Rectangle(boxes[0][i][3], boxes[0][i][2], boxes[0][i][1], boxes[0][i][3])
                            rb = Rectangle(boxes[0][j][3], boxes[0][j][2], boxes[0][j][1], boxes[0][j][3])
                            ar = rectArea(boxes[0][i][3], boxes[0][i][1],boxes[0][i][2],boxes[0][i][3])
                            col_threshold = 0.6*np.sqrt(ar)
                            print(area(ra, rb))
#                             area(ra, rb)
                            if (area(ra,rb)<col_threshold) :
                                postData = {
                                    "cameraId": 42,
                                    "time": int(time.time())
                                }
                                r = requests.post('https://infinite-ravine-29568.herokuapp.com/accident', json.dumps(postData))
                                if r.status_code == 200:
                                    print ("Request sent")
                                    return True
                                else:
                                    return False

                        # cv2.putText(image_np, "COLLISION!", (230, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2, cv2.LINE_AA)
                        # intersection here is (3, 3, 4, 3.5), or an area of 1*.5=.5
#                         mid_x = (boxes[0][i][3] + boxes[0][i][1]) / 2
#                         mid_y = (boxes[0][i][2] + boxes[0][i][3]) / 2
#                         cv2.putText(image_np, "rasik", (int(mid_x*800, int(mid_y*600)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)






def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)

def area(a, b):  # returns None if rectangles don't intersect
    dx = min(a.xmax, b.xmax) - max(a.xmin, b.xmin)
    dy = min(a.ymax, b.ymax) - max(a.ymin, b.ymin)
#     print (dx, dy)
#     if (dx>=0) and (dy>=0):
    return dx*dy

def rectArea(xmax, ymax, xmin, ymin):
    x = np.abs(xmax-xmin)
    y = np.abs(ymax-ymin)

    return x*y
# # Detection

# For the sake of simplicity we will use only 2 images:
PATH_TO_TEST_IMAGES_DIR = 'test_images'
TEST_IMAGE_PATHS = [ os.path.join(PATH_TO_TEST_IMAGES_DIR, 'image{}.jpg'.format(i)) for i in range(1, 3) ]

# Size, in inches, of the output images.
IMAGE_SIZE = (12, 8)



with detection_graph.as_default():
  with tf.Session(graph=detection_graph) as sess:
    while True:
      ret, image_np = cap.read()
      # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
      image_np_expanded = np.expand_dims(image_np, axis=0)
      image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
      # Each box represents a part of the image where a particular object was detected.
      boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
      # Each score represent how level of confidence for each of the objects.
      # Score is shown on the result image, together with the class label.
      scores = detection_graph.get_tensor_by_name('detection_scores:0')
      classes = detection_graph.get_tensor_by_name('detection_classes:0')
      num_detections = detection_graph.get_tensor_by_name('num_detections:0')
      # Actual detection.
      (boxes, scores, classes, num_detections) = sess.run(
          [boxes, scores, classes, num_detections],
          feed_dict={image_tensor: image_np_expanded})
      # Visualization of the results of a detection.
      vis_util.visualize_boxes_and_labels_on_image_array(
          image_np,
          np.squeeze(boxes),
          np.squeeze(classes).astype(np.int32),
          np.squeeze(scores),
          category_index,
          use_normalized_coordinates=True,
          line_thickness=8)

      if cal_collision(boxes, classes, scores):
            cv2.destroyAllWindows()
            break

      cv2.imshow('object detection', image_np)

      if cv2.waitKey(25) & 0xFF == ord('q'):
        cv2.destroyAllWindows()
        break
