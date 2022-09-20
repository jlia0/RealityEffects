import './App.css';
import React, {
    createRef,
    forwardRef,
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import {button, folder, useControls} from 'leva'
import {
    Center,
    Select as DreiSelect,
    MapControls,
    OrbitControls,
    RoundedBox,
    Stats,
    TransformControls,
    GizmoHelper,
    GizmoViewport, Html, Icosahedron, Text, Billboard, QuadraticBezierLine, Ring, Sphere, Trail, Effects, Environment
} from "@react-three/drei";
import {BufferAttribute, Mesh} from "three";
import * as THREE from "three";

import {Bloom, EffectComposer, Outline, Selection, Select, SelectiveBloom} from "@react-three/postprocessing";

import {AfterimagePass} from 'three-stdlib'

import {TorusComponent} from "./Components/Torus";
import {
    dynamicSpheres,
    resetDynamicSpheres,
    useStoreColor,
    useStoreControl, useStorePose, useStoreSelected, useStoreTrack,

} from "./store/useStoreControl";
import Iframe from "react-iframe";
import {DraggableLine} from "./Components/DraggableLine";
import {Panel} from "./utils/MultiLeva";
import useEyeDropper from 'use-eye-dropper'
import {ClickableSphere} from "./Components/ClickableSphere";
import {Angle} from "./Components/Angle";
import {Label} from "./Components/Label";
import {createRingBuffer, getRandomInt, hexToRgb, readImage, renderBGRA32ColorFrame} from "./utils/HelperFunctions";
import {Distance} from "./Components/Distance";
import {Pos} from "./Components/Pos";
import {Marker} from "./Components/Marker";
import {FaMapMarkerAlt} from 'react-icons/fa'
import {LightSaber} from "./Components/Models/LightSaber";
import {Post} from "./Components/AfterImage";
import * as PoseMediaPipe from "@mediapipe/pose";
import {ModelWrapper} from "./utils/ModelWrapper";
import {Lab} from "./Components/Models/Lab";
import {TrailWrapper} from "./Components/TrailWrapper";
import {Speed} from "./Components/Speed";
import {Trajectory} from "./Components/Trajectory";
import UI from "./Components/UI";
import {ColorBoxComponent} from "./Components/ColorBox";
import Annotation from "./Components/Annotation";


extend({EffectComposer, AfterimagePass})


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const pose = new PoseMediaPipe.Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

const DEPTH_WIDTH = 640;
const DEPTH_HEIGHT = 576;

const numPoints = DEPTH_WIDTH * DEPTH_HEIGHT;

// let xcolor_buffer = createRingBuffer(5)
// let ycolor_buffer = createRingBuffer(5)
// let zcolor_buffer = createRingBuffer(5)


function App() {
    const setTarget = useStoreControl(state => state.setTarget)
    const target = useStoreControl(state => state.target)

    const [selected, setSelected] = useState([])


    const {open, close, isSupported} = useEyeDropper()
    const [error, setError] = useState()


    const [pos, setPos] = useState([])
    const [speed, setSpeed] = useState([])
    const [dist, setDist] = useState([])
    const [angles, setAngles] = useState([])
    const [labels, setLabels] = useState([])
    const [torus, setTorus] = useState([])
    const [trail, setTrail] = useState([])
    const [path, setPath] = useState([])


    const [mLines, setMLines] = useState([])
    const [marker, setMarker] = useState([])


    const lightRef = useRef()
    const refPoints = useRef();
    const canvasRef = useRef()
    const bindingOpions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
    const canvasData = useRef(null)
    const [test, setTest] = useState([])

    const {colors, addColor} = useStoreColor()

    const items = useStoreTrack((state) => state.items)


    let flag = false
    const color_flag = useRef(false)
    const body_flag = useRef(false)

    function onResults(results) {
        if (results) {
            const landmarks = results.poseLandmarks
            if (landmarks !== undefined && landmarks) {
                for (let i = 0; i < landmarks.length; i++) {
                    const landmark = landmarks[i]
                    if (landmark.y <= 1 && landmark.visibility >= 0.65 && refPoints.current) {
                        const x = Math.floor(landmark.x * DEPTH_WIDTH)
                        const y = Math.floor(landmark.y * DEPTH_HEIGHT)
                        const pos = Math.floor(DEPTH_WIDTH * y + x)
                        const pos_arr = refPoints.current.geometry.getAttribute('position').array
                        const actualX = (pos % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
                        const actualY = DEPTH_HEIGHT / 2 - Math.floor(pos / DEPTH_WIDTH);
                        const z = pos_arr[pos * 3 + 2]

                        if (z <= 1500) {
                            useStoreTrack.getState().update(i, [actualX, actualY, z])
                        }
                    }
                }
            }
        }
    }

    console.log('render', trail)

    function onResults_Color(centerX, centerY, index) {
        if (refPoints.current) {
            const x = Math.floor(centerX)
            const y = Math.floor(centerY)
            const pos = Math.floor(DEPTH_WIDTH * y + x)
            const pos_arr = refPoints.current.geometry.getAttribute('position').array
            const actualX = (pos % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
            const actualY = DEPTH_HEIGHT / 2 - Math.floor(pos / DEPTH_WIDTH);
            const z = pos_arr[pos * 3 + 2]

            // xcolor_buffer.push(actualX)
            // ycolor_buffer.push(actualY)
            // zcolor_buffer.push(z)

            if (z <= 1000) {
                useStoreTrack.getState().update(index + 33, [actualX, actualY, z])
            }
        }
    }

    async function onTimerTick_Pose() {
        try {
            await pose.send({image: canvasRef.current})
        } catch (e) {
            console.log(e)
        }
    }

    const renderBGRA32ColorFrame = (ctx, canvasImageData, imageData) => {
        const newPixelData = imageData;
        const pixelArray = canvasImageData.data;
        for (let i = 0; i < canvasImageData.data.length; i += 4) {
            pixelArray[i] = newPixelData[i + 2];
            pixelArray[i + 1] = newPixelData[i + 1];
            pixelArray[i + 2] = newPixelData[i];
            pixelArray[i + 3] = 0xff;
        }

        canvasData.current = canvasImageData.data
        ctx.putImageData(canvasImageData, 0, 0);
    };


    async function onTimerTick_Color() {
        try {
            if (canvasData.current !== null) {
                const colors = useStoreColor.getState().colors
                const threshold = 50

                let colors_low = []
                let colors_high = []

                for (let i = 0; i < colors.length; i++) {
                    const color = hexToRgb(colors[i])
                    if (color !== null) {
                        const color_low = [color.r >= threshold ? (color.r - threshold) : 0, color.g >= threshold ? (color.g - threshold) : 0, color.b >= threshold ? (color.b - threshold) : 0, 255]
                        const color_high = [(color.r + threshold) >= 255 ? 255 : (color.r + threshold), (color.g + threshold) >= 255 ? 255 : (color.g + threshold), (color.b + threshold) >= 255 ? 255 : (color.b + threshold), 255]
                        colors_low.push(color_low)
                        colors_high.push(color_high)
                    }
                }

                if (colors_low.length > 0) {
                    window.myAPI.detectColor(colors_low, colors_high, canvasData.current, onResults_Color)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        try {
            let pos = [];
            let col = [];

            for (let i = 0; i < numPoints; i++) {
                const x = (i % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
                const y = DEPTH_HEIGHT / 2 - Math.floor(i / DEPTH_WIDTH);
                pos.push(x);
                pos.push(y);
                pos.push(0);

                col.push(0);
                col.push(0);
                col.push(0);
            }

            if (!flag) {
                flag = !flag

                pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: true,
                    minDetectionConfidence: 0.9,
                    minTrackingConfidence: 0.9
                });
                pose.onResults(onResults);

                setTimeout(async () => {
                    try {
                        await pose.send({image: canvasRef.current})
                    } catch (e) {
                        console.log(e)
                    }
                }, 3000)


                const ctx = canvasRef.current.getContext('2d');
                ctx.width = 640
                ctx.height = 576
                let colorToDepthImageData = ctx.createImageData(640, 576);

                window.myAPI.startListening((depth, color) => {
                    let pointIndex = 0;

                    let newDepthData = depth
                    let newColorData = color

                    renderBGRA32ColorFrame(ctx, colorToDepthImageData, color)


                    for (let i = 0; i < newDepthData.length; i += 2) {

                        const depthValue = newDepthData[i + 1] << 8 | newDepthData[i];

                        const b = newColorData[pointIndex * 4 + 0];
                        const g = newColorData[pointIndex * 4 + 1];
                        const r = newColorData[pointIndex * 4 + 2];

                        if (depthValue > 500 && depthValue < 2800) {
                            pos[pointIndex * 3 + 2] = depthValue / 3;
                        } else {
                            pos[pointIndex * 3 + 2] = 9999;
                        }

                        col[pointIndex * 3 + 0] = r / 255;
                        col[pointIndex * 3 + 1] = g / 255;
                        col[pointIndex * 3 + 2] = b / 255;

                        pointIndex++;
                    }

                    if (refPoints) {
                        const pos_ref = refPoints.current.geometry.getAttribute('position');
                        const col_ref = refPoints.current.geometry.getAttribute('color');
                        // console.log(pos, col)

                        for (let i = 0; i <= pos.length; i++) {

                            if (i > 254640) {
                                pos_ref.array[i] = pos[i]
                                col_ref.array[i] = col[i]
                            } else {
                                pos_ref.array[i] = 9999
                                col_ref.array[i] = 0
                            }
                        }

                        refPoints.current.geometry.setAttribute('position', pos_ref);
                        refPoints.current.geometry.setAttribute('color', col_ref);

                        refPoints.current.geometry.attributes.position.needsUpdate = true;
                        refPoints.current.geometry.attributes.color.needsUpdate = true;
                    }
                });
            }


        } catch (e) {
            console.log(e)
        }
    }, [])


    const [System, setSystem] = useControls(() => ({
        'Controls': folder({
            'Mode': {value: 'translate', options: ['translate', 'scale', 'rotate']},
            'Body Tracking': button((get) => {
                if (!body_flag.current) {
                    setTimeout(() => setInterval(onTimerTick_Pose, 33), 3000)
                    body_flag.current = true
                }

            }),
            'Color Tracking': button((get) => {
                if (!color_flag.current) {
                    setTimeout(() => setInterval(onTimerTick_Color, 33), 3000)
                    color_flag.current = true
                }

            }),
            'Clear': button((get) => {
                setPos([])
                setSpeed([])
                setDist([])
                setAngles([])
                setLabels([])
                setTorus([])
                setTrail([])
                setPath([])
            }),
        }),
        'Tracking': folder({
            'Trackers': true,
            'Pose': true,
            'Pick Color': '#ffffff',
            'Add Tracker': button((get) => {
                open()
                    .then(color => {
                        setSystem({'Pick Color': color.sRGBHex})
                        addColor(color.sRGBHex)
                        console.log(useStoreColor.getState().colors)
                    })
                    .catch(e => {
                        console.log(e)
                        // Ensures component is still mounted
                        // before calling setState
                        if (!e.canceled) setError(e)
                    })
            }),
        }),
        'Annotation': folder({
            'A_Binding': {options: bindingOpions},
            Text: '',
            'A_Position': [0, 0, 0],
            'Add Static Label': button((get) => {
                const text = get('Annotation.Text')
                const position = get('Annotation.A_Position')
                const binding = get('Annotation.A_Binding')
                setLabels([...labels, {Text: text, Position: position, Binding: binding}])
                // setLabels([...labels, {Text: text, Position: [0, 0, 0]}])

            }),

        }),
        'Highlight': folder({
            'H_Binding': {options: bindingOpions},
            'H_Type': {options: ['Torus', 'Arrow', 'Line', '3D Box', '2D Area', 'Marker']},
            'H_Position': [0, 0, 0],
            'Add Highlight': button((get) => {
                const category = get('Highlight.H_Type')
                const position = get('Highlight.H_Position')
                const binding = get('Highlight.H_Binding')

                if (category === 'Torus') {
                    setTorus([...torus, {Position: position, Binding: binding}])
                } else if (category === 'Line') {
                    setMLines([...mLines, {Position: position, Binding: binding}])
                } else if (category === 'Marker') {
                    setMarker([...marker, {Position: position, Binding: binding}])
                }
            }),

        }),
        'Motion': folder({
            'M_Binding': {options: bindingOpions},
            'M_Type': {options: ['Trail', 'Path']},
            'M_Position': [0, 0, 0],
            'Ghost Effect': false,
            'Add Motion Effect': button((get) => {
                const category = get('Motion.M_Type')
                const position = get('Motion.M_Position')
                const binding = get('Motion.M_Binding')

                if (category === 'Trail') {
                    console.log(trail)
                    setTrail([...trail, {Binding: binding}])
                } else if (category === 'Path') {
                    setPath([...path, {Binding: binding}])
                }
            }),

        }),
        'Parameters': folder({
            // 'P_Binding': {options: bindingOpions},
            'P_Type': {options: ['Position', 'Angle', 'Distance', 'Speed']},
            'P_Position': [0, 0, 0],
            'Add Dynamic Parameter': button((get) => {
                const category = get('Parameters.P_Type')
                const position = get('Parameters.P_Position')
                const binding = get('Parameters.P_Binding')
                if (category === 'Position') {
                    if (dynamicSpheres.length === 1) {
                        setPos([...pos, dynamicSpheres])
                    }
                    resetDynamicSpheres()
                } else if (category === 'Speed') {
                    if (dynamicSpheres.length === 1) {
                        setSpeed([...speed, dynamicSpheres])
                    }
                    resetDynamicSpheres()
                } else if (category === 'Angle') {
                    if (dynamicSpheres.length === 3) {
                        setAngles([...angles, dynamicSpheres])
                    }
                    resetDynamicSpheres()
                } else if (category === 'Distance') {
                    if (dynamicSpheres.length === 2) {
                        setDist([...dist, dynamicSpheres])
                    }
                    resetDynamicSpheres()
                }
            }),

        }),
        'Assets': folder({
            'A_Binding': {options: bindingOpions},
            'A_Type': {options: ['Model', 'Embedded Screen']},
            'A_Position': [0, 0, 0],
            'Model': {image: undefined},
            'URL': '',
            'Add Asset': button((get) => {
                const category = get('Assets.A_Type')
                const position = get('Assets.A_Position')
                const binding = get('Assets.A_Binding')

            }),

        }),
        // 'Write File': button((get) => {
        //     // console.log(colorImageData, depthImageData)
        //     // setTimeout(() => {
        //     //     writeImage('gym-5', colorImageData, depthImageData);
        //     // }, 5000)
        //     // console.log(positions, count)
        // }),

    }))

    const KinectPoints = ({size}) => {

        const [positions, colors] = useMemo(() => {
            let positions = [],
                colors = []

            for (let i = 0; i < numPoints; i++) {
                const x = (i % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
                const y = DEPTH_HEIGHT / 2 - Math.floor(i / DEPTH_WIDTH);
                positions.push(x);
                positions.push(y);
                positions.push(0);

                colors.push(0);
                colors.push(0);
                colors.push(0);
            }

            return [new Float32Array(positions), new Float32Array(colors)]
        }, [size])


        return (<points ref={refPoints}>
            <bufferGeometry>
                <bufferAttribute attach={"attributes-position"} args={[positions, 3]}/>
                <bufferAttribute attach={"attributes-color"} args={[colors, 3]}/>
            </bufferGeometry>
            {/*attach="material" sizeAttenuation={true}*/}
            <pointsMaterial attach="material" sizeAttenuation={true} vertexColors={true} size={2}/>
        </points>);
    }


    return (
        <div className="App">
            <canvas hidden={true} ref={canvasRef} width={640} height={576}/>
            <div style={{width: "100vw", height: "100vh"}}>
                <Canvas
                    onPointerMissed={() => setTarget(null)}
                    camera={{
                        fov: 90,
                        aspect: sizes.width / sizes.height,
                        near: 0.1,
                        far: 5000,
                        position: [0, 0, -1000]
                    }}
                >
                    <ambientLight ref={lightRef} intensity={0.01}/>

                    <color attach="background" args={["#000000"]}/>


                    <KinectPoints size={3}/>

                    {/*<Html scale={0.1} position={[20, 0, 600]} sprite transform>*/}
                    {/*    <Annotation*/}
                    {/*        title="John Doe"*/}
                    {/*        long*/}
                    {/*        body="Mixed Reality Researcher"*/}
                    {/*        position={{*/}
                    {/*            top: "20%",*/}
                    {/*            left: "10%"*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Html>*/}

                    {/*<Html scale={0.1} position={[-20, 0, 600]} sprite transform>*/}
                    {/*    <Annotation*/}
                    {/*        title="RealityEdit"*/}
                    {/*        body="Augmenting 3D Volumetric Videos"*/}
                    {/*        position={{*/}
                    {/*            top: "25%",*/}
                    {/*            right: "5%"*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Html>*/}

                    {/*<TransformControls>*/}
                    {/*    <UI scale={1} float position={[0, -100, 9999]}/>*/}
                    {/*</TransformControls>*/}

                    {/*rotation={[Math.PI / 2.2, 0, 0]*/}


                    {/*<Html scale={80} position={[-400, 50, 1000]} sprite transform>*/}

                    {/*    <Iframe src="https://www.youtube.com/embed/ZUUM5sIZwzM"*/}
                    {/*            width="450px"*/}
                    {/*            height="450px"*/}
                    {/*            frameBorder="0"*/}
                    {/*            display="initial"*/}
                    {/*            position="relative"*/}
                    {/*    />*/}

                    {/*        <Iframe*/}
                    {/*            src="https://assets.pinterest.com/ext/embed.html?id=873346552712754397" height="1113"*/}
                    {/*            width="600" frameBorder="0" scrolling="no"/>*/}

                    {/*        <Iframe sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin"*/}
                    {/*                width="200px"*/}
                    {/*                height="450px"*/}
                    {/*                frameBorder="0"*/}
                    {/*                display="initial"*/}
                    {/*                position="relative"*/}
                    {/*                src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=jliao-20&language=en_US&marketplace=amazon&region=US&placement=B019UDIGD0&asins=B019UDIGD0&linkId=b13bfbce530946fc38a14f2f214b57ec&show_border=true&link_opens_in_new_window=true"></Iframe>*/}

                    {/*</Html>*/}


                    {/*<ClickableSphere position={[0, 0, 100]}/>*/}

                    {/*<ClickableSphere position={[0, 0, 500]}/>*/}


                    {
                        items.map((i, index) => {
                            return <ClickableSphere key={index} position={[0, 0, 9999]} index={i}/>
                        })
                    }


                    {
                        angles.map((angle, index) => {
                                return <Angle key={index} sphere1={angle[0]} sphere2={angle[1]} sphere3={angle[2]}/>

                            }
                        )
                    }

                    {
                        dist.map((distance, index) => {
                                return <Distance key={index} sphere1={distance[0]} sphere2={distance[1]}/>

                            }
                        )
                    }

                    {
                        pos.map((position, index) => {
                                return <Pos key={index} sphere={position[0]}/>
                            }
                        )
                    }

                    {
                        speed.map((sp, index) => {
                                return <Speed key={index} sphere={sp[0]}/>
                            }
                        )
                    }

                    {/*{*/}
                    {/*    marker.map((mark, index) => {*/}
                    {/*            return <Marker key={index} rotation={[0, Math.PI / 2, 0]} position={mark.Position}>*/}
                    {/*                <FaMapMarkerAlt style={{color: 'orange'}}/>*/}
                    {/*            </Marker>*/}
                    {/*        }*/}
                    {/*    )*/}
                    {/*}*/}

                    {/*<Environment*/}
                    {/*    files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr"*/}
                    {/*    background/>*/}


                    <Selection>
                        <EffectComposer multisampling={0} autoClear={false}>
                            <SelectiveBloom mipmapBlur radius={0.75} lights={[lightRef]} luminanceThreshold={0.1}
                                            luminanceSmoothing={0.001} intensity={6}/>
                        </EffectComposer>

                        <Select enabled={true}>

                            {/*<ModelWrapper binding={20}>*/}
                            {/*    <LightSaber scale={400} position-z={-100} />*/}
                            {/*</ModelWrapper>*/}

                            {/*Figure: Product Showcase*/}

                            {
                                <ColorBoxComponent width={50} height={55} depth={60} binding={17}/>
                            }


                            {
                                trail.map((tr, index) => {
                                    return <TrailWrapper
                                        key={index}
                                        binding={tr.Binding}
                                    />

                                })
                            }

                            {
                                path.map((pa, index) => {
                                    return <Trajectory
                                        key={index}
                                        binding={pa.Binding}
                                    />

                                })
                            }

                            <DreiSelect onChange={setSelected}>


                                {
                                    labels.map((label, count) => {
                                            return <Label key={count} position={label.Position} text={label.Text}
                                                          binding={label.Binding}/>
                                        }
                                    )
                                }

                                {
                                    mLines.map((mLine, index) => {
                                        return <DraggableLine key={index} defaultStart={[0, 0, 0]}
                                                              defaultEnd={[0, 0, 100]}/>

                                    })
                                }

                                {
                                    torus.map((tor, index) => {
                                        return <TorusComponent
                                            key={index}
                                            position={tor.Position}
                                            radius={50}
                                            tube={2}
                                            opacity={1}
                                            color={'pink'}
                                            binding={tor.Binding}
                                            rotation={[Math.PI / 2.2, 0, 0]}
                                        />

                                    })
                                }

                                {/*<TorusComponent*/}
                                {/*    position={[0, 0, 150]}*/}
                                {/*    radius={50}*/}
                                {/*    tube={2}*/}
                                {/*    opacity={1}*/}
                                {/*    color={'pink'}*/}
                                {/*    rotation={[Math.PI / 2.2, 0, 0]}*/}
                                {/*/>*/}

                                {/*<TorusComponent*/}
                                {/*    position={[0, 0, 100]}*/}
                                {/*    radius={50}*/}
                                {/*    tube={2}*/}
                                {/*    opacity={1}*/}
                                {/*    color={'pink'}*/}
                                {/*    rotation={[Math.PI / 2.2, 0, 0]}*/}
                                {/*/>*/}

                            </DreiSelect>


                        </Select>

                    </Selection>


                    {/*{*/}
                    {/*    path.map((line, index) => {*/}
                    {/*            // console.log({x: path[index + 1][0], y: path[index + 1][1], z: path[index + 1][2]})*/}
                    {/*            if (index === path.length - 1) {*/}
                    {/*                return;*/}
                    {/*            } else {*/}
                    {/*                return <LineComponent*/}
                    {/*                    index={index}*/}
                    {/*                    start={{x: line[0], y: line[1], z: line[2]}}*/}
                    {/*                    end={{x: path[index + 1][0], y: path[index + 1][1], z: path[index + 1][2]}}*/}
                    {/*                    color={'white'}*/}
                    {/*                    lineWidth={1.5}*/}
                    {/*                />*/}
                    {/*            }*/}

                    {/*        }*/}
                    {/*    )*/}
                    {/*}*/}

                    <Lab scale={100} position={[0, 0, 900]} rotation={[0, Math.PI, 0]}/>


                    {target && <TransformControls object={target} mode={System.Mode}/>}

                    <MapControls makeDefault/>
                    {System['Ghost Effect'] === true && <Post/>}

                </Canvas>
                <Panel selected={selected}/>
                <Stats className="fps"/>
            </div>
        </div>
    )
        ;
}

export default App;
