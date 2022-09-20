import {Billboard, Html, QuadraticBezierLine, useCursor, useSelect} from "@react-three/drei";
import {RingComponent} from "./Ring";
import {CircleComponent} from "./Circle";
import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {useStoreControl, useStoreTrack} from "../store/useStoreControl";
import {useControlsMulti} from "../utils/MultiLeva";
import {useFrame} from "@react-three/fiber";

export const Label = ({position, text, binding}) => {
    const setTarget = useStoreControl((state) => state.setTarget)
    const [hovered, setHovered] = useState(false)
    const ref = useRef()
    const lineRef = useRef()

    const selected = useSelect().map((sel) => {
        return lineRef.current.userData.store
    })

    useEffect(() => useStoreTrack.subscribe((state) => {
        if (binding){
            ref.current.position.x = state[binding][0]
            ref.current.position.y = state[binding][1]
            ref.current.position.z = state[binding][2]
        }
    }))


    const [store, values] = useControlsMulti(selected, {
        Text: {value: text},
        'Text Color': {value: '#000000'},
        'Label Color': {value: '#f0f0f0'}
    })
    const isSelected = !!selected.find((sel) => sel === store)

    useCursor(hovered)

    return <mesh
        ref={ref}
        position={position}
        onClick={(e) => setTarget(ref.current)} onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
    >
        <Billboard
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false} // Lock the rotation on the z axis (default=false)
        >

            <RingComponent
                innerRadius={14.5}
                outerRadius={15}
                color='#ffffff'
            >
                <RingComponent
                    innerRadius={8}
                    outerRadius={9}
                    color='#ffffff'
                >
                    <CircleComponent
                        radius={5}
                        position={[0, 0, 0.1]}
                        color='#ffffff'/>
                    <QuadraticBezierLine
                        ref={lineRef}
                        userData={{store}}
                        key={0} {...{
                        start: new THREE.Vector3(0, 0, 0),
                        end: new THREE.Vector3(80, 60, 20)
                    }}
                        color="white" lineWidth={0.8} transparent opacity={1}
                        occlude
                    />
                    <Html scale={40} position={[80, 60, 20]} transform>
                        <div className="annotation"
                             style={{background: values['Label Color'], color: values['Text Color']}}>
                            {values.Text}
                        </div>
                    </Html>
                </RingComponent>
            </RingComponent>
        </Billboard>
        <meshBasicMaterial opacity={1}/>
    </mesh>

}