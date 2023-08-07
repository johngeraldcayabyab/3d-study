function createContext(width = 512, height = 512) {
    const canvas = createCanvas(width, height);
    return canvas.getContext('webgpu');
}

function createCanvas(width = 512, height = 512) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    return canvas;
}
