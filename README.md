# VAHAN

<img src="./public/imgs/logo.png" height="100">

Accident Monitoring system for cities.

**VAHAN** (Vehicle Accident Hazard Notifier) is a web app that notifies the driver whenever there is an accident on the road. Along with that it also sends a message to the nearest police station and hospital with an accurate location of the accident.

* We aim to deploy our model using cameras on highways in a smart city.
* Bird’s eye view of the traffic is considered while predicting the collision of vehicles but still our model works well enough on different views as well.

## Technologies Used: 

- Tensorflow object Detection API *(object detection)*
- Socket.io *(for real time communication)*
- Node.js *(sever side programming)*

## How to use :

Clone the repository and then : 

* Crash Detection
  * [Setup the object detection API](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/installation.md)
  * Run the `crash_detection_model.py` file using **python3**.
  * Ensure that you have the following libraries pre-installed.
    * numpy
    * six
    * tarfile
    * tensorflow
    * zipfile
    * requests
    * json
    * time
    * PIL
    * matplotlib
    * cv2
    
    
* Server Side

  Run the following commands in the terminal: 
  ```
  npm install  
  nodemon server/server.js
  ```
