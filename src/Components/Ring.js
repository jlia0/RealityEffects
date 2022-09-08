import React, {forwardRef} from "react";

export const RingComponent = forwardRef(({
                                             children,
                                             opacity = 1,
                                             innerRadius = 0.5,
                                             outerRadius = 1,
                                             thetaSegments = 32,
                                             color = '#ff1050',
                                             ...props
                                         }, ref) => (
    <mesh ref={ref} {...props}>
        <ringGeometry args={[innerRadius, outerRadius, thetaSegments]}/>
        <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color}/>
        {children}
    </mesh>
))



