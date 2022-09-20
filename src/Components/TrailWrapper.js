import React, {useEffect, useRef, useState} from "react";
import {Sphere, Trail} from "@react-three/drei";
import {useStoreTrack} from "../store/useStoreControl";

export function TrailWrapper({binding}) {
    const sphere = useRef();

    useEffect(() => useStoreTrack.subscribe((state) => {
        sphere.current.position.x = state[binding][0]
        sphere.current.position.y = state[binding][1]
        sphere.current.position.z = state[binding][2]
    }))

    return (
        <>
            <Trail
                width={60}
                length={30}
                color={'#F8D628'}
                decay={1} // How fast the line fades away
                attenuation={(t) => {
                    return t * t
                }}
            >
                <Sphere visible={false} ref={sphere} args={[0.2, 32, 32]}>
                    <meshNormalMaterial/>
                </Sphere>

                {/*<group ref={sphere}>*/}
                {/*    <Html scale={1} transform sprite>*/}
                {/*        <div className="annotation" style={{background: 'green', color: 'white'}}>*/}
                {/*            {text}*/}
                {/*        </div>*/}
                {/*    </Html>*/}
                {/*</group>*/}

            </Trail>
        </>
    )
}