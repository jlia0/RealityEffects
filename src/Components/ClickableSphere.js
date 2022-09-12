import {useCursor} from "@react-three/drei";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {dynamicSpheres, useStoreTrack, useStoreTracking} from "../store/useStoreControl";

export const ClickableSphere = ({position, index}) => {
    const ref = useRef()

    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    useEffect(() => useStoreTrack.subscribe((state) => {
        ref.current.position.x = state[index][0]
        ref.current.position.y = state[index][1]
        ref.current.position.z = state[index][2]
    }))

    return (
        <mesh position={position}
              ref={ref} onClick={() => {
            if (clicked) {
                dynamicSpheres.pop()
                setClicked(false)
            } else {
                dynamicSpheres.push(ref)
                setClicked(true)
            }
        }} onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
        >
            <sphereBufferGeometry args={[6, 16, 16]}/>
            <meshBasicMaterial color={clicked ? 'green' : 'yellow'}/>
        </mesh>
    )
}
