import {useEffect, useRef} from "react";
import {useStoreTrack} from "../store/useStoreControl";

export const SceneWrapper = ({children}) => {
    const ref = useRef()
    useEffect(() => useStoreTrack.subscribe((state) => {
        ref.current.position.x = state[binding][0]
        ref.current.position.y = state[binding][1]
        ref.current.position.z = state[binding][2]
    }))

    return <group ref={ref}>
        {children}
    </group>

}