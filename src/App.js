import logo from './logo.svg';
import './App.css';
import {useEffect, useMemo, useRef, useState} from "react";
import {KinectAzure} from "./static/KinectStream";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {button, useControls} from 'leva'
import {MapControls, OrbitControls, RoundedBox, Stats} from "@react-three/drei";
import {BufferAttribute} from "three";

const fs = window.require('fs');
// const cv = window.opencv;
const kinect = new KinectAzure();
const depthModeRange = kinect.getDepthModeRange(KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED);
let kinect_flag = false;
// const debug = false;

// let newDepthData, newColorData;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

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
    const [scene, camera] = useThree();
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

const DEPTH_WIDTH = 640;
const DEPTH_HEIGHT = 576;

const numPoints = DEPTH_WIDTH * DEPTH_HEIGHT;

function App() {
    const depthArray = useRef([]);
    const colorArray = useRef([]);

    // const buttons = useControls({
    //     Add: button((get) => {
    //         console.log(colorImageData, depthImageData)
    //         setTimeout(() => {
    //             writeImage('gym-5', colorImageData, depthImageData);
    //         }, 5000)
    //     })
    // })

    const kinectInit = () => {
        try {
            if (kinect && kinect.open()) {
                let positions = [];
                let colors = [];

                for (let i = 0; i < numPoints; i++) {
                    const x = (i % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
                    const y = DEPTH_HEIGHT / 2 - Math.floor(i / DEPTH_WIDTH);
                    const vertex = [x, y, 0];
                    positions.push(vertex);
                    colors.push([0, 0, 0]);
                }

                positions = positions.flat(1);
                colors = colors.flat(1);

                console.log(positions.length)

                kinect.startCameras({
                    depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
                    color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
                    color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
                    include_color_to_depth: true,
                    // include_depth_to_color: true
                });

                kinect.startListening((data) => {

                    let newDepthData = Buffer.from(data.depthImageFrame.imageData);
                    let newColorData = Buffer.from(data.colorToDepthImageFrame.imageData);

                    console.log(newDepthData.length)

                    if (newDepthData.length !== 0) {

                        let pointIndex = 0;

                        for (let i = 0; i < newDepthData.length; i += 2) {

                            const depthValue = newDepthData[i + 1] << 8 | newDepthData[i];
                            const b = newColorData[pointIndex * 4 + 0];
                            const g = newColorData[pointIndex * 4 + 1];
                            const r = newColorData[pointIndex * 4 + 2];

                            if (depthValue > depthModeRange.min && depthValue < depthModeRange.max) {
                                positions[pointIndex * 3 + 2] = depthValue / 3;
                            } else {
                                positions[pointIndex * 3 + 2] = 99999;
                            }

                            colors[pointIndex * 3 + 0] = r / 255;
                            colors[pointIndex * 3 + 1] = g / 255;
                            colors[pointIndex * 3 + 2] = b / 255;

                            pointIndex++;
                        }

                        depthArray.current = positions;
                        colorArray.current = colors;

                    }


                });
            } else {
                console.log('kinect not open')
                // kinectInit();
            }

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!kinect_flag) {
            kinect_flag = true;
            console.log(kinect)
            setTimeout(() => kinectInit(), 5000)
        }
    }, [])

    return (
        <div className="App">
            <div style={{width: "100vw", height: "100vh"}}>
                <Canvas linear={true}>
                    <perspectiveCamera
                        fov={75}
                        aspect={sizes.width / sizes.height}
                        position={[0, 0, -2000]}
                        near={1}
                        far={10000}
                    >

                        {/*<Box position={[-1.2, 0, 0]}/>*/}
                        {/*<Box position={[1.2, 0, 0]}/>*/}
                        {/*<RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4}>*/}
                        {/*    <meshPhongMaterial color="#f3f3f3" wireframe/>*/}
                        {/*</RoundedBox>*/}
                    </perspectiveCamera>

                    {/*<ambientLight/>*/}
                    <OrbitControls/>
                </Canvas>
                <Stats className="fps"/>
            </div>
        </div>
    );
}

export default App;
