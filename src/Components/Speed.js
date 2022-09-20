import React, {useEffect, useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector2Array} from "../utils/VectorConvert";
import {Billboard, Html} from "@react-three/drei";
import create from "zustand";
import {createRingBuffer} from "../utils/HelperFunctions";

let xbuffer = createRingBuffer(2)
let ybuffer = createRingBuffer(2)
let zbuffer = createRingBuffer(2)
let speedbuffer = createRingBuffer(3)
let speed_smooth = createRingBuffer(8)
let count = 0

const useSpeedStore = create((set) => ({speed: null, setSpeed: (speed) => set({speed})}))


export const Speed = ({sphere}) => {
    const htmlRef = useRef()

    const speed_ = Vector2Array(sphere.current.position)

    const {speed, setSpeed} = useSpeedStore()

    const speed_last = useRef()

    useFrame((state, delta, frame) => {
        if (htmlRef) {
            xbuffer.push(speed_[0])
            ybuffer.push(speed_[1])
            zbuffer.push(speed_[2])

            const x1 = xbuffer.prev()
            const x2 = xbuffer.next()
            const delta_x = x1 - x2

            const y1 = ybuffer.prev()
            const y2 = ybuffer.next()
            const delta_y = y1 - y2


            const z1 = zbuffer.prev()
            const z2 = zbuffer.next()
            const delta_z = z1 - z2

            const speed_calc = Math.cbrt(delta_x * delta_x + delta_y * delta_y + delta_z * delta_z) / delta / 100

            speedbuffer.push(speed_calc)
            speed_smooth.push(speed_calc)

            setSpeed(speedbuffer.avg())

            // if (count > 5) {
            //     window.myAPI.sendData(speed_smooth.avg() | 0)
            //     count = 0;
            // }
            // count++

            htmlRef.current.position.x = speed_[0]
            htmlRef.current.position.y = speed_[1] - 20
            htmlRef.current.position.z = speed_[2]

            speed_last.current = sphere.current.position
        }
    })

    return <group>
        <Billboard
            ref={htmlRef}
            position={[speed_[0], speed_[1] - 20, speed_[2]]}
        >
            <Html scale={50} transform>
                <div className="annotation" style={{background: '#f0f0f0', color: 'black'}}>
                    <span
                        style={{fontSize: '1.5em'}}>⚡️</span> {speed && speed.toFixed(1) + ' cm/s'}
                </div>
            </Html>
        </Billboard>
    </group>
}