import {useCursor} from "@react-three/drei";
import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {dynamicSpheres, useStoreControl, useStoreTrack, useStoreTracking} from "../store/useStoreControl";

export const ClickableSphere = ({position, index}) => {
    const ref = useRef()


    const setTarget = useStoreControl((state) => state.setTarget)
    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)


    const length = 15;
    const hex = 0xffff00;

    useEffect(() => useStoreTrack.subscribe((state) => {
        if (index) {
            ref.current.position.x = state[index][0]
            ref.current.position.y = state[index][1]
            ref.current.position.z = state[index][2]
        }
    }))

    return (
        <mesh position={position} visible={true}
              ref={ref} onDoubleClick={(e) => setTarget(e.object)} onClick={() => {
            if (clicked) {
                if (dynamicSpheres.length !== 0) {
                    dynamicSpheres.pop()
                }
                setClicked(false)
            } else {
                dynamicSpheres.push(ref)
                setClicked(true)
            }
        }} onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
        >
            <sphereBufferGeometry args={[4, 20, 20]}/>

            <meshBasicMaterial color={clicked ? 'green' : '#FF00FF'}/>
            {/*<arrowHelper args={[, , length, hex]}/>*/}
        </mesh>
    )
}
