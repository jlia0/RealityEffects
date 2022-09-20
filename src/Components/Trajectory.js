import React, {useEffect, useRef, useState} from "react";
import {Sphere, Trail} from "@react-three/drei";
import {useStoreTrack} from "../store/useStoreControl";

export function Trajectory({binding}) {
    const sphere = useRef();

    useEffect(() => useStoreTrack.subscribe((state) => {
        sphere.current.position.x = state[binding][0]
        sphere.current.position.y = state[binding][1]
        sphere.current.position.z = state[binding][2]
    }))

    return (
        <>
            <Trail
                width={40}
                length={40}
                color={'#F0F0F0'}
                decay={1} // How fast the line fades away
                attenuation={(t) => {
                    return t * t
                }}
            >
                <Sphere visible={false} ref={sphere} args={[0.2, 32, 32]}>
                    <meshNormalMaterial/>
                </Sphere>

            </Trail>
        </>
    )
}