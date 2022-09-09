import {useCursor} from "@react-three/drei";
import {forwardRef, useEffect, useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {dynamicSpheres, useStoreTracking} from "../store/useStoreControl";

export const ClickableSphere = forwardRef(({
                                               position = [0, 0, 9999]
                                           }, ref) => {
    // const ref = useRef()

    // const positions = useStoreTracking((state) => state.positions)

    const [clicked, setClicked] = useState(false)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    // useFrame(() => {
    //     if (positions.length > index) {
    //         ref.current.position.x = positions[index][0];
    //         ref.current.position.y = positions[index][1];
    //         ref.current.position.z = positions[index][2];
    //     }
    // })

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
            <meshBasicMaterial color={clicked ? 'green' : 'white'}/>
        </mesh>
    )
})
