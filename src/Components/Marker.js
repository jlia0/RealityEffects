import {Html} from "@react-three/drei";
import {useRef, useState} from "react";
import {useStoreTracking} from "../store/useStoreControl";
import {useFrame} from "@react-three/fiber";

export function Marker({children, position, binding}) {
    // This holds the local occluded state
    const [occluded, occlude] = useState()
    const ref = useRef()

    const positions = useStoreTracking((state) => state.positions)


    useFrame(() => {
        if (positions.length > binding) {
            ref.current.position.x = positions[binding][0];
            ref.current.position.y = positions[binding][1];
            ref.current.position.z = positions[binding][2];
        }
    })

    return (
        <Html
            scale={40}
            ref={ref}
            position={position}
            // 3D-transform contents
            transform
            // Hide contents "behind" other meshes
            occlude
            // Tells us when contents are occluded (or not)
            onOcclude={occlude}
            // We just interpolate the visible state into css opacity and transforms
            style={{transition: 'all 0.2s', opacity: occluded ? 0 : 1, transform: `scale(${occluded ? 0.25 : 1})`}}
        >
            {children}
        </Html>
    )
}