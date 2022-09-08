import React, {Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {useCursor} from "@react-three/drei";
import {useStoreControl} from "../store/useStoreControl";
import {extend, useFrame} from "@react-three/fiber";
import * as meshline from 'meshline';

extend(meshline)


export function DraggableLine({defaultStart, defaultEnd}) {
    const [start, setStart] = useState(defaultStart)
    const [end, setEnd] = useState(defaultEnd)

    const startRef = useRef()
    const endRef = useRef()
    const lineRef = useRef()

    const target = useStoreControl()
    const setTarget = useStoreControl((state) => state.setTarget)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    const positions = useMemo(() => {
        const points = []
        points.push(defaultStart)
        points.push(defaultEnd)
        return Float32Array.from(points.flat())
    }, [defaultStart, defaultEnd])


    useFrame(() => {
        if (startRef.current && endRef.current && target.target) {
            const points = []
            const sp = startRef.current.position
            const ep = endRef.current.position
            points.push([sp.x, sp.y, sp.z]);
            points.push([ep.x, ep.y, ep.z]);

            lineRef.current.geometry.setPoints(Float32Array.from(points.flat()))
        }
    })

    useLayoutEffect(() => {
        lineRef.current.geometry.setPoints(positions)
    }, [])

    return (
        <group>
            <mesh ref={lineRef}>
                <meshLine attach="geometry"/>
                {/*transparent depthTest={false}*/}
                <meshLineMaterial attach="material" lineWidth={2} color={'red'}/>
            </mesh>

            <mesh visible={hovered} position={start}
                  ref={startRef} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
            >
                <sphereBufferGeometry args={[hovered ? 3.5 : 2, 32, 32]}/>
                <meshBasicMaterial color={hovered ? 'hotpink' : 'white'}/>
            </mesh>

            <mesh visible={hovered} position={end}
                  ref={endRef} onClick={(e) => setTarget(e.object)} onPointerOver={() => setHovered(true)}
                  onPointerOut={() => setHovered(false)}
            >
                <sphereBufferGeometry args={[hovered ? 3.5 : 2, 32, 32]}/>
                <meshBasicMaterial color={hovered ? 'hotpink' : 'white'}/>
            </mesh>

        </group>
    )
}