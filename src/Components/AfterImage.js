import {useThree} from "@react-three/fiber";
import React, {useEffect, useRef} from "react";
import {Effects} from "@react-three/drei";

export function Post() {
    const {scene, camera} = useThree()
    const pass = useRef()

    useEffect(() => {
        if (pass !== null || pass !== undefined) {
            pass.current.uniforms.damp.value = 0.95
        }
    }, [pass])

    return (
        <Effects disableGamma>
            <afterimagePass ref={pass}/>
        </Effects>
    )
}
