import React, {forwardRef, useRef, useState} from "react";
import {useCursor, useSelect} from "@react-three/drei";
import {useStoreControl, useStoreTracking} from "../store/useStoreControl";
import {useControlsMulti} from '../utils/MultiLeva';
import {useFrame} from "@react-three/fiber";

export const TorusComponent = forwardRef(({
                                              opacity = 1,
                                              radius = 1,
                                              tube = 0.4,
                                              radialSegments = 30,
                                              tubularSegments = 32,
                                              color = '#ff1050',
                                              binding,
                                              ...props
                                          }, ref) => {

        const setTarget = useStoreControl((state) => state.setTarget)
        const [hovered, setHovered] = useState(false)
        const meshRef = useRef()

        const selected = useSelect().map((sel) => sel.userData.store)

        const positions = useStoreTracking((state) => state.positions)


        useFrame(() => {
            if (positions.length > binding) {
                meshRef.current.position.x = positions[binding][0];
                meshRef.current.position.y = positions[binding][1];
                meshRef.current.position.z = positions[binding][2];
            }
        })

        const [store, values] = useControlsMulti(selected, {
            color: {value: color},
        })
        const isSelected = !!selected.find((sel) => sel === store)

        // console.log(selected, isSelected)

        useCursor(hovered)

        return <mesh ref={meshRef} userData={{store}}
                     {...props} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)}
                     onPointerOut={() => setHovered(false)}>
            <torusGeometry args={[radius, tube, radialSegments, tubularSegments]}/>
            <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={values.color}/>
        </mesh>

    }
)