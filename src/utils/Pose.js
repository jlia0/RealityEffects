import {Pose} from "@mediapipe/pose";
import {useFrame} from "@react-three/fiber";
import {useEffect} from "react";
import {useStorePose} from "../store/useStoreControl";

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

const renderBGRA32ColorFrame = (imageFrame) => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imageFrame.width;
    canvas.height = imageFrame.height;
    let canvasImageData = ctx.createImageData(canvas.width, canvas.height)

    const newPixelData = Buffer.from(imageFrame.imageData);
    const pixelArray = canvasImageData.data;

    for (let i = 0; i < canvasImageData.data.length; i += 4) {
        pixelArray[i] = newPixelData[i + 2];
        pixelArray[i + 1] = newPixelData[i + 1];
        pixelArray[i + 2] = newPixelData[i];
        pixelArray[i + 3] = 0xff;
    }

    ctx.putImageData(canvasImageData, 0, 0);

    let image_ele = new Image();
    image_ele.src = canvas.toDataURL();
    return image_ele;
};

export const PoseTracking = () => {

    function onResults(results) {
        if (!results.poseLandmarks) {
            // grid.updateLandmarks([]);
            return;
        }

        console.log(results)

        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.drawImage(results.segmentationMask, 0, 0,
        //     canvasElement.width, canvasElement.height);
        //
        // // Only overwrite existing pixels.
        // canvasCtx.globalCompositeOperation = 'source-in';
        // canvasCtx.fillStyle = '#00FF00';
        // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        //
        // // Only overwrite missing pixels.
        // canvasCtx.globalCompositeOperation = 'destination-atop';
        // canvasCtx.drawImage(
        //     results.image, 0, 0, canvasElement.width, canvasElement.height);
        //
        // canvasCtx.globalCompositeOperation = 'source-over';
        // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        //     {color: '#00FF00', lineWidth: 4});
        // drawLandmarks(canvasCtx, results.poseLandmarks,
        //     {color: '#FF0000', lineWidth: 2});
        // canvasCtx.restore();
        //
        // grid.updateLandmarks(results.poseWorldLandmarks);
    }

    useEffect(() => {
        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        pose.onResults(onResults);
    }, [])


    useFrame(async () => {
        const imageFrame = useStorePose.getState().image
        const img = renderBGRA32ColorFrame(imageFrame)
        await pose.send({image: img})
    })

    return <>
    </>

    // const camera = new Camera(videoElement, {
    //     onFrame: async () => {
    //         await pose.send({image: videoElement});
    //     },
    //     width: 1280,
    //     height: 720
    // });

}