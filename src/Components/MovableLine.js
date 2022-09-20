import React, {forwardRef, Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {useCursor} from "@react-three/drei";
import {useStoreControl} from "../store/useStoreControl";
import {extend, useFrame} from "@react-three/fiber";
import * as meshline from 'meshline';

extend(meshline)

export const MovableLine = forwardRef(({
                                           lineWidth = 2,
                                           color = 'white',
                                       }, ref) => {

    // const positions = useMemo(() => {
    //     const points = []
    //     points.push(start)
    //     points.push(end)
    //     return Float32Array.from(points.flat())
    // }, [start, end])

    // useLayoutEffect(() => {
    //     lineRef.current.geometry.setPoints(positions)
    // }, [])

    // useFrame(() => {
    //     lineRef.current.geometry.setPoints(positions)
    // })

    return (
        <group>
            <mesh ref={ref}>
                <meshLine attach="geometry"/>
                {/*transparent depthTest={false}*/}
                <meshLineMaterial attach="material" lineWidth={lineWidth} color={color}/>
            </mesh>
        </group>
    )

})

