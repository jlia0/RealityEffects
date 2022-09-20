import {Billboard, Circle, Html, QuadraticBezierLine, Ring} from "@react-three/drei";
import * as THREE from "three";
import React, {forwardRef} from "react";
import {RingComponent} from "../Components/Ring";
import {CircleComponent} from "../Components/Circle";


export const Object_1 = () => {
    return <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Lock the rotation on the z axis (default=false)
        position={[-50, -200, 390]}
    >
        <RingComponent
            innerRadius={14.5}
            outerRadius={15}
            color='#ffffff'
        >
            <RingComponent
                innerRadius={8}
                outerRadius={9}
                color='#ffffff'
            >
                <CircleComponent
                    radius={5}
                    position={[0, 0, 0.1]}
                    color='#ffffff'/>
                <QuadraticBezierLine
                    key={0} {...{
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(80, 60, 20)
                }}
                    color="white" lineWidth={0.8} transparent opacity={1}
                    occlude
                />
                <Html scale={40} position={[80, 60, 20]} transform>
                    <div className="annotation" style={{background: '#f0f0f0', color: 'black'}}>
                        Vase <span style={{fontSize: '1.5em'}}>🏺</span>
                    </div>
                </Html>
            </RingComponent>
        </RingComponent>
    </Billboard>
}

export const Object_2 = () => {
    return <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Lock the rotation on the z axis (default=false)
        position={[55, -80, 690]}
    >
        <RingComponent
            innerRadius={14.5}
            outerRadius={15}
            color='#ffffff'
        >
            <RingComponent
                innerRadius={8}
                outerRadius={9}
                color='#ffffff'
            >
                <CircleComponent
                    radius={5}
                    position={[0, 0, 0.1]}
                    color='#ffffff'/>
                <QuadraticBezierLine
                    key={0} {...{
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(80, 60, 20)
                }}
                    color="white" lineWidth={0.8} transparent opacity={1}
                    occlude
                />
                <Html scale={40} position={[80, 60, 20]} transform>
                    <div className="annotation" style={{background: 'green', color: 'white'}}>
                        Plant <span style={{fontSize: '1.5em'}}>🪴</span>
                    </div>
                </Html>
            </RingComponent>
        </RingComponent>
    </Billboard>
}