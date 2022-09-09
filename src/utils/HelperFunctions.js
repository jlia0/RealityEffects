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

export const renderBGRA32ColorFrame = (ctx, canvasImageData, imageData) => {
    const newPixelData = imageData;
    const pixelArray = canvasImageData.data;
    for (let i = 0; i < canvasImageData.data.length; i += 4) {
        pixelArray[i] = newPixelData[i + 2];
        pixelArray[i + 1] = newPixelData[i + 1];
        pixelArray[i + 2] = newPixelData[i];
        pixelArray[i + 3] = 0xff;
    }
    ctx.putImageData(canvasImageData, 0, 0);

};