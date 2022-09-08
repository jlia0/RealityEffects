import create from "zustand";
import {exp} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

export const useStoreControl = create((set) => ({target: null, setTarget: (target) => set({target})}))

export const useStoreTracking = create((set) => ({
    positions: [],
    addTracker: (position) => set((state) => ({positions: [...state.positions, position]})),
    updateTracker: (index, pos) => set((state) => {
        const positionsArr = [...state.positions]
        positionsArr[index] = pos
        return {positions: positionsArr}
    }),
    deleteAll: () => set({}, true)
}))

export const useStoreColor = create((set) => ({
    colors: [], addColor: (color) => set((state) => ({colors: [...state.colors, color]})),
}))


export let dynamicSpheres = []

export const resetDynamicSpheres = () => {
    dynamicSpheres = []
}