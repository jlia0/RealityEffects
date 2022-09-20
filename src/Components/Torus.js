import React, {forwardRef, useEffect, useRef, useState} from "react";
import {useCursor, useSelect} from "@react-three/drei";
import {useStoreControl, useStoreTrack} from "../store/useStoreControl";
import {useControlsMulti} from '../utils/MultiLeva';

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
        useCursor(hovered)


        const meshRef = useRef()

        const selected = useSelect().map((sel) => sel.userData.store)

        useEffect(() => useStoreTrack.subscribe((state) => {
            if(binding){
                meshRef.current.position.x = state[binding][0]
                meshRef.current.position.y = state[binding][1]
                meshRef.current.position.z = state[binding][2]
            }
        }))


        const [store, values] = useControlsMulti(selected, {
            color: {value: color},
        })
        const isSelected = !!selected.find((sel) => sel === store)

        // console.log(selected, isSelected)


        return <mesh ref={meshRef} userData={{store}}
                     {...props} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)}
                     onPointerOut={() => setHovered(false)}>
            <torusGeometry args={[radius, tube, radialSegments, tubularSegments]}/>
            <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={values.color}/>
        </mesh>

    }
)