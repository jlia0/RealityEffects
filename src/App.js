import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState} from "react";
import {KinectAzure} from "./static/KinectStream";
import {Canvas, useFrame} from "@react-three/fiber";
import {button, useControls} from 'leva'
import {MapControls, RoundedBox, Stats} from "@react-three/drei";

const fs = window.require('fs');
// const cv = window.opencv;
const kinect = new KinectAzure();
const depthModeRange = kinect.getDepthModeRange(KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED);
let kinect_flag = false;

let newDepthData, newColorData;

// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// };

function Box(props) {
    const {name, aNumber} = useControls({name: 'World', aNumber: 0})

    const values = useControls({
        string: {value: 'hello', label: 'My string'},
        color: {value: '#f00', label: 'color'},
        opacity: {value: 0.5, label: 'opacity'},
        size: {value: {width: 200, height: 300}, label: 'size'},
    })


    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += 0.01))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]}/>

            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
        </mesh>
    )
}

function writeImage(id, depth, color) {
    fs.writeFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\depth-${id}.blob`, depth, (err) => {
    })

    fs.writeFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\color-${id}.blob`, color, (err) => {
    })
}

function readImage(id) {
    let color, depth;
    fs.readFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\color-${id}.blob`, (err, buff) => {
        color = buff;
    })

    fs.readFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\depth-${id}.blob`, (err, buff) => {
        depth = buff;
    })

    return [color, depth]
}

function App() {
    // const [colorToDepthImageData, setColorToDepthImageData] = useState(null);
    // const [depthImageData, setDepthImageData] = useState(null);

    const buttons = useControls({
        Add: button((get) => {
            console.log(newDepthData, newColorData)
            setTimeout(() => {
                writeImage('gym-5', newDepthData, newColorData);
            }, 5000)
        })
    })

    useEffect(() => {
        if (!kinect_flag) {
            kinect_flag = true;
            setTimeout(() => {
                try {
                    if (kinect && kinect.open()) {
                        console.log(kinect, depthModeRange)
                        kinect.startCameras({
                            depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
                            color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
                            color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
                            include_color_to_depth: true,
                            include_depth_to_color: true
                        });

                        kinect.startListening((data) => {

                            newDepthData = Buffer.from(data.depthImageFrame.imageData);
                            newColorData = Buffer.from(data.colorToDepthImageFrame.imageData);

                            //console.log(data, newDepthData.length, newColorData.length, data.colorToDepthImageFrame.width)

                            // setColorToDepthImageData(newColorData);
                            // setDepthImageData(newDepthData);


                            // let pointIndex = 0;
                            // for (let i = 0; i < newDepthData.length; i += 2) {
                            //     const depthValue = newDepthData[i + 1] << 8 | newDepthData[i];
                            //     const b = newColorData[pointIndex * 4 + 0];
                            //     const g = newColorData[pointIndex * 4 + 1];
                            //     const r = newColorData[pointIndex * 4 + 2];
                            //     if (depthValue > depthModeRange.min && depthValue < depthModeRange.max) {
                            //         // geom.vertices[pointIndex].z = depthValue / 2.5;
                            //     } else {
                            //         // geom.vertices[pointIndex].z = Number.MAX_VALUE;
                            //     }
                            //     // geom.colors[pointIndex].setRGB(r / 255, g / 255, b / 255);
                            //     pointIndex++;
                            // }
                            // // geom.verticesNeedUpdate = true;
                            // // geom.colorsNeedUpdate = true;
                            //
                            // // render color to depth
                            // if (!colorToDepthImageData && data.colorToDepthImageFrame.width > 0) {
                            //     // $colorToDepthCanvas.width = data.colorToDepthImageFrame.width;
                            //     // $colorToDepthCanvas.height = data.colorToDepthImageFrame.height;
                            //     // colorToDepthImageData = colorToDepthCtx.createImageData($colorToDepthCanvas.width, $colorToDepthCanvas.height);
                            // }
                            // if (colorToDepthImageData) {
                            //     // renderBGRA32ColorFrame(colorToDepthCtx, colorToDepthImageData, data.colorToDepthImageFrame);
                            // }

                            //console.log(newDepthData, newColorData)
                        });
                    }

                } catch (e) {
                    console.log(e)
                }
            }, 2000)
        }
    }, [])


    return (
        <div className="App">
            <div style={{width: "100vw", height: "100vh"}}>
                <Canvas>
                    <ambientLight/>
                    <pointLight position={[10, 10, 10]}/>
                    {/*<Box position={[-1.2, 0, 0]}/>*/}
                    {/*<Box position={[1.2, 0, 0]}/>*/}
                    <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>
                        <meshPhongMaterial color="#f3f3f3" wireframe/>
                    </RoundedBox>
                    <MapControls/>
                </Canvas>
                <Stats className="fps"/>
            </div>
        </div>
    );
}

export default App;
