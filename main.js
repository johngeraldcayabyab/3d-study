async function getWgsl(url) {
    return await fetch(url).then(response => response.text());
}

async function getAdapter() {
    const gpu = navigator.gpu;
    if (!gpu) {
        throw new Error('WebGPU not supported in this browser');
    }
    const adapter = await gpu.requestAdapter();
    if (!adapter) {
        throw new Error('No appropriate GPU adapter found');
    }
    return adapter;
}

function createContext(width = 512, height = 512) {
    const canvas = createCanvas(width, height);
    return canvas.getContext('webgpu');
}

function colorAttachments(textureView) {
    return {
        view: textureView,
        clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
        loadOp: 'clear',
        storeOp: 'store',
    };
}

function createCanvas(width = 512, height = 512, id = 'texture-1') {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.id = id;
    document.body.appendChild(canvas);
    return canvas;
}
