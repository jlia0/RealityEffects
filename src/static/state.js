const state = {
    // this can be used as prop in initial render
    // but eventually it should be updated manually via ref.
    // and most importantly, length of array should not be changed.
    points: new Float32Array([]),
    colors: new Float32Array([]),
    requireUpdate: false
};

export default state;