import React, {forwardRef} from "react";
import {QuadraticBezierLine} from "@react-three/drei";
import * as THREE from "three";

export const LineComponent = forwardRef(({
                                             index = 0,
                                             opacity = 1,
                                             start,
                                             end,
                                             lineWidth = 0.8,
                                             color = 'white',
                                             ...props
                                         }, ref) => (
    <mesh ref={ref} {...props}>

        <QuadraticBezierLine
            key={index} {...{
            start: new THREE.Vector3(start.x, start.y, start.z),
            end: new THREE.Vector3(end.x, end.y, end.z)
        }}
            color={color} lineWidth={lineWidth} transparent opacity={1}
            occlude
        />

        <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color}/>
    </mesh>
))



