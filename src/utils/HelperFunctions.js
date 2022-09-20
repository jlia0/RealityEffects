import {fs} from "../static/KinectStream";

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function writeImage(id, depth, color) {
    fs.writeFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\depth-${id}.blob`, depth, (err) => {
    })

    fs.writeFile(`C:\\Users\\14037\\WebstormProjects\\realityedit\\debug\\color-${id}.blob`, color, (err) => {
    })
}

export async function readImage(id) {
    let color, depth;

    color = await fs.readFile(`/Users/jliao/realityedit/debug/color-${id}.blob`)

    depth = await fs.readFile(`/Users/jliao/realityedit/debug/depth-${id}.blob`)

    return [color, depth]
}

export function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// readImage('pool-1').then((rst) => {
//     let pointIndex = 0;
//
//     let newColorData = rst[0];
//     let newDepthData = rst[1];
//
//     console.log(newColorData)
//
//     // setImage(newColorData)
//
//     let pos = [];
//     let col = [];
//
//     for (let i = 0; i < numPoints; i++) {
//         const x = (i % DEPTH_WIDTH) - DEPTH_WIDTH * 0.5;
//         const y = DEPTH_HEIGHT / 2 - Math.floor(i / DEPTH_WIDTH);
//         pos.push(x);
//         pos.push(y);
//         pos.push(0);
//
//         col.push(0);
//         col.push(0);
//         col.push(0);
//     }
//
//     for (let i = 0; i < newDepthData.length; i += 2) {
//
//         const depthValue = newDepthData[i + 1] << 8 | newDepthData[i];
//
//         const b = newColorData[pointIndex * 4 + 0];
//         const g = newColorData[pointIndex * 4 + 1];
//         const r = newColorData[pointIndex * 4 + 2];
//
//         if (depthValue > 10 && depthValue < 5000) {
//             pos[pointIndex * 3 + 2] = depthValue / 3;
//         } else {
//             pos[pointIndex * 3 + 2] = Number.MAX_VALUE;
//         }
//
//         col[pointIndex * 3 + 0] = r / 255;
//         col[pointIndex * 3 + 1] = g / 255;
//         col[pointIndex * 3 + 2] = b / 255;
//
//         pointIndex++;
//     }
//     state.points = new Float32Array([...pos]);
//     state.colors = new Float32Array([...col]);
//     state.requireUpdate = true;
//
// })

export const createRingBuffer = function (length) {
    /* https://stackoverflow.com/a/4774081 */
    let pointer = 0, buffer = [];

    return {
        avg_max_min: function () {
            const sum = buffer.reduce((a, b) => a + b, 0);
            const sum_remove_max_min = sum - this.max() - this.min()
            const avg = (sum / (buffer.length - 2)) || 0;
            return avg;
        },
        avg: function () {
            const sum = buffer.reduce((a, b) => a + b, 0);
            const avg = (sum / buffer.length) || 0;
            return avg;
        },
        min: function () {
            // or Math.max(...array)
            return buffer.reduce(function (p, v) {
                return (p < v ? p : v);
            });
        },
        max: function () {
            return buffer.reduce(function (p, v) {
                return (p > v ? p : v);
            });
        },
        get: function (key) {
            if (key < 0) {
                return buffer[pointer + key];
            } else if (key === false) {
                return buffer[pointer - 1];
            } else {
                return buffer[key];
            }
        },
        push: function (item) {
            buffer[pointer] = item;
            pointer = (pointer + 1) % length;
            return item;
        },
        prev: function () {
            let tmp_pointer = (pointer - 1) % length;

            if (tmp_pointer < 0) {
                tmp_pointer = 0
            }

            if (buffer[tmp_pointer]) {
                pointer = tmp_pointer;
                return buffer[pointer];
            }
        },
        next: function () {
            if (buffer[pointer]) {
                pointer = (pointer + 1) % length;
                return buffer[pointer];
            }
        }
    };
};