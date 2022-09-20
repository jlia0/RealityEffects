import THREE from "three";

export const Vector2Array = (vector) => {
    return [vector.x, vector.y, vector.z]
}

export const Array2Vector = (array) => {
    return {x: array[0], y: array[1], z: array[2]}
}