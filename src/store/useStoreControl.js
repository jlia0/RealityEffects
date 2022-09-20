import create from "zustand";

export const useStoreControl = create((set) => ({target: null, setTarget: (target) => set({target})}))

export const useStoreSelected = create((set) => ({selected: [], setSelected: (selected) => set({selected})}))

export const useStoreTracking = create((set) => ({
    positions: [],
    addTracker: (position) => set((state) => ({positions: [...state.positions, position]})),
    updateTracker: (index, pos) => set((state) => {
        const positionsArr = [...state.positions]
        positionsArr[index] = pos
        return {positions: positionsArr}
    }),
    deleteAll: () => set((state) => ({positions: []})),
}))

const ids = [...Array(40)].map((v, i) => i)

export const useStoreTrack = create((set) => ({
    items: ids,
    ...ids.reduce((acc, id) => ({...acc, [id]: [0, 0, 9999]}), 0),
    update(id, position) {
        // Set all coordinates randomly
        set((state) => {
            const coords = {}
            for (let i = 0; i < state.items.length; i++) {
                if (i === id) {
                    coords[state.items[i]] = position
                } else {
                    coords[state.items[i]] = state[i]
                }
            }
            return coords
        })
    },
    addTrack() {
        set((state) => {

        })
    }
}))

export const useStoreColor = create((set) => ({
    colors: [], addColor: (color) => set((state) => ({colors: [...state.colors, color]})),
}))

export const useStorePose = create((set) => ({image: null, setImage: (image) => set({image})}))

export let dynamicSpheres = []

export const resetDynamicSpheres = () => {
    dynamicSpheres = []
}