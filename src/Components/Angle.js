import {MovableLine} from "./MovableLine";
import React, {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector2Array} from "../utils/VectorConvert";
import {angleBetween3DCoords} from "../utils/CalculateAngle";
import {Billboard, Html} from "@react-three/drei";
import create from "zustand";


function drawLine(sphere, sphere_, lineRef) {
    const positions = []
    const start = Vector2Array(sphere.current.position)
    const end = Vector2Array(sphere_.current.position)
    positions.push(start)
    positions.push(end)
    lineRef.current.geometry.setPoints(positions.flat())
}

const useAngleStore = create((set) => ({angle: null, setAngle: (angle) => set({angle})}))

export const Angle = ({sphere1, sphere2, sphere3}) => {
    const line1Ref = useRef()
    const line2Ref = useRef()
    // const angle = useRef()
    const htmlRef = useRef()
    const pos = Vector2Array(sphere2.current.position)
    const {angle, setAngle} = useAngleStore()


    useFrame(() => {
        if (line1Ref && line2Ref) {
            drawLine(sphere1, sphere2, line1Ref)
            drawLine(sphere2, sphere3, line2Ref)
            setAngle(angleBetween3DCoords(sphere1.current.position, sphere2.current.position, sphere3.current.position))
            htmlRef.current.position.x = pos[0]
            htmlRef.current.position.y = pos[1] - 20
            htmlRef.current.position.z = pos[2]
        }
    })

    return <group>
        <MovableLine ref={line1Ref}/>
        <MovableLine ref={line2Ref}/>
        <Billboard
            ref={htmlRef}
            position={[pos[0], pos[1] - 20, pos[2]]}
        >
            <Html scale={40} transform>
                <div className="annotation" style={{background: '#f0f0f0', color: 'black'}}>
                    {angle && angle.toFixed(1) + '°'}
                </div>
            </Html>
        </Billboard>
    </group>
}