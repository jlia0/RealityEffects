import React, {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector2Array} from "../utils/VectorConvert";
import {Billboard, Html} from "@react-three/drei";
import create from "zustand";


const usePosStore = create((set) => ({pos: null, setPos: (pos) => set({pos})}))

export const Pos = ({sphere}) => {
    const htmlRef = useRef()

    const pos_ = Vector2Array(sphere.current.position)

    const {pos, setPos} = usePosStore()

    useFrame(() => {
        if (htmlRef) {
            setPos(sphere.current.position)
            htmlRef.current.position.x = pos_[0]
            htmlRef.current.position.y = pos_[1] - 20
            htmlRef.current.position.z = pos_[2]
        }
    })

    return <group>
        <Billboard
            ref={htmlRef}
            position={[pos_[0], pos_[1] - 20, pos_[2]]}
        >
            <Html scale={50} transform>
                <div className="annotation"  style={{background: '#f0f0f0', color: 'black'}}>
                    <span style={{fontSize: '1.5em'}}>📍</span> {pos && `(${pos.x.toFixed(1)},${pos.y.toFixed(1)},${pos.z.toFixed(1)})`}
                </div>
            </Html>
        </Billboard>
    </group>
}