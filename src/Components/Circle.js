import React, {forwardRef} from "react";
import {exp} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

export const CircleComponent = forwardRef(({
                                               children,
                                               opacity = 1,
                                               radius = 0.05,
                                               segments = 32,
                                               color = '#ff1050',
                                               ...props
                                           }, ref) => (
    <mesh ref={ref} {...props}>
        <circleGeometry args={[radius, segments]}/>
        <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color}/>
        {children}
    </mesh>
))
