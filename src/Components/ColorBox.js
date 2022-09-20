import React, {forwardRef, useEffect, useRef, useState} from "react";
import {RoundedBox, useCursor, useSelect} from "@react-three/drei";
import {useStoreControl, useStoreTrack} from "../store/useStoreControl";
import {useControlsMulti} from '../utils/MultiLeva';

export const ColorBoxComponent = forwardRef(({
                                                 opacity = 1,
                                                 radius = 0.3,
                                                 width = 25,
                                                 height = 25,
                                                 depth = 25,
                                                 smoothness = 5,
                                                 color = '#f0f0f0',
                                                 binding,
                                                 ...props
                                             }, ref) => {

        const setTarget = useStoreControl((state) => state.setTarget)
        const [hovered, setHovered] = useState(false)
        useCursor(hovered)

        const meshRef = useRef()

        const selected = useSelect().map((sel) => sel.userData.store)

        useEffect(() => useStoreTrack.subscribe((state) => {
            if (binding) {
                meshRef.current.position.x = state[binding][0]
                meshRef.current.position.y = state[binding][1]
                meshRef.current.position.z = state[binding][2]
            }
        }))


        const [store, values] = useControlsMulti(selected, {
            color: {value: color},
            width: {value: width},
            height: {value: height},
            depth: {value: depth}
        })

        return <mesh ref={meshRef} userData={{store}}
                     {...props} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)}
                     onPointerOut={() => setHovered(false)}>

            <RoundedBox
                args={[width, height, depth]}
                radius={radius}
                smoothness={smoothness}
            >
                <meshBasicMaterial color={values.color} wireframe/>
            </RoundedBox>
        </mesh>

    }
)