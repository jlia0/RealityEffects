// opencv
const cv = require('../realityedit/public/opencv');

const axios = require('axios').default;

// Make a request for a user with a given ID

// Kinect Init
const Kinect = require('kinect-azure')
const KinectAzure = new Kinect();
if (KinectAzure.open()) {

    KinectAzure.startCameras({
        depth_mode: Kinect.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_format: Kinect.K4A_IMAGE_FORMAT_COLOR_BGRA32,
        color_resolution: Kinect.K4A_COLOR_RESOLUTION_720P,
        include_color_to_depth: true,
        // include_depth_to_color: true
    })

} else {
    console.log('kinect not open')
}

cv['onRuntimeInitialized'] = () => {
    // do all your work here
    console.log('cv ready')
};


// preload with contextIsolation enabled
const {contextBridge} = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    require: (callback) => window.require(callback),
    startListening: (callback) => {
        KinectAzure.startListening((data) => {
            const depth = Buffer.from(data.depthImageFrame.imageData)
            const color = Buffer.from(data.colorToDepthImageFrame.imageData)
            callback(depth, color)
        })
    },
    opencvReady: (callback) => {
        cv['onRuntimeInitialized'] = () => {
            // do all your work here
            console.log('cv ready')
            callback('ready')
        };
    },
    sendData: (data) => axios.get(`http://localhost:4000/add?data=${data}`)
        .then(function (response) {
            // handle success
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        })
    ,
    detectColor: (colors_low, colors_high, cvImageData, callback) => {
        try {

            let canvasData = {data: cvImageData, width: 640, height: 576, colorSpace: 'srgb'}

            const src = cv.matFromImageData(canvasData);
            const dst = cv.matFromImageData(canvasData);


            for (let i = 0; i < colors_low.length; i++) {

                const color_low = colors_low[i]
                const color_high = colors_high[i]

                const low = new cv.Mat(src.rows, src.cols, src.type(), color_low);
                const high = new cv.Mat(src.rows, src.cols, src.type(), color_high);

                // if lower bound and upper bound are set
                if (low !== null && high !== null) {
                    // filter out contours
                    cv.inRange(src, low, high, dst);

                    const contours = new cv.MatVector();
                    const hierarchy = new cv.Mat();
                    // get remaining contours and hierachy
                    cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

                    // find the largest are of contours
                    let maxArea = 0;
                    let maxCnt = null;

                    for (let i = 0; i < contours.size(); i++) {
                        let cnt = contours.get(i);
                        let area = cv.contourArea(cnt, false);

                        if (area > maxArea) {
                            maxArea = area
                            maxCnt = cnt
                        }
                    }

                    // if there is a contour exist in the frame, draw
                    if (maxCnt && maxCnt.data32S) {

                        const points = maxCnt.data32S
                        let sumX = 0;
                        let sumY = 0;
                        let numPoints = points.length / 2;
                        for (let i = 0; i < points.length; i += 2) {
                            sumX += points[i];
                            sumY += points[i + 1];
                        }

                        let centerX = Math.floor(sumX / numPoints);
                        let centerY = Math.floor(sumY / numPoints);

                        callback(centerX, centerY, i)
                    }

                    low.delete();
                    high.delete();
                }
            }


            src.delete();
            dst.delete();

        } catch (e) {
            console.error('color tracking error: ', e)
        }

    }
})