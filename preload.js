const Kinect = require('kinect-azure')
const opencv = require('../realityedit/public/opencv');

const KinectAzure = new Kinect();
const fs = require('fs')

let KinectData = null;

if (KinectAzure.open()) {

    KinectAzure.startCameras({
        depth_mode: Kinect.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_format: Kinect.K4A_IMAGE_FORMAT_COLOR_BGRA32,
        color_resolution: Kinect.K4A_COLOR_RESOLUTION_720P,
        include_color_to_depth: true,
        // include_depth_to_color: true
    })

    KinectAzure.startListening((data) => {
        KinectData = data
    })
} else {
    console.log('kinect not open')
}


// preload with contextIsolation enabled
const {contextBridge} = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    require: (callback) => window.require(callback),
    data: KinectData,
    opencv: opencv
})