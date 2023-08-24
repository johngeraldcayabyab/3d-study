async function getAdapter() {
    if (!navigator.gpu) {
        throw new Error('WebGPU not supported in this browser');
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error('No appropriate GPU adapter found');
    }
    return adapter;
}

function createContext(width = 512, height = 512) {
    const canvas = createCanvas(width, height);
    return canvas.getContext('webgpu');
}

function createCanvas(width = 512, height = 512, id = 'texture-1') {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    document.body.appendChild(canvas);
    return canvas;
}
