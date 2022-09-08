import {useControls} from "leva";
import React, {useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";

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
