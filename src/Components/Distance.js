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

const useDistanceStore = create((set) => ({distance: null, setDistance: (distance) => set({distance})}))

export const Distance = ({sphere1, sphere2}) => {
    const lineRef = useRef()
    // const angle = useRef()
    const htmlRef = useRef()

    const pos1 = Vector2Array(sphere1.current.position)
    const pos2 = Vector2Array(sphere2.current.position)
    const pos = [pos1[0] + pos2[0] / 2, pos1[1] + pos2[1] / 2, pos1[2] + pos2[2] / 2]

    const {distance, setDistance} = useDistanceStore()


    useFrame(() => {
        if (lineRef) {
            drawLine(sphere1, sphere2, lineRef)
            setDistance(sphere1.current.position.distanceTo(sphere2.current.position))
            htmlRef.current.position.x = pos[0]
            htmlRef.current.position.y = pos[1] - 20
            htmlRef.current.position.z = pos[2]
        }
    })

    return <group>
        <MovableLine ref={lineRef}/>
        <Billboard
            ref={htmlRef}
            position={[pos[0], pos[1] - 20, pos[2]]}
        >
            <Html scale={40} transform>
                <div className="annotation" style={{background: '#f0f0f0', color: 'black'}}>
                    {distance && distance.toFixed(1) + ' px'}
                </div>
            </Html>
        </Billboard>
    </group>
}