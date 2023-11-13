class TJS {
    constructor() {
    }

    async init() {
        this.adapter = await this.getAdapter();
        this.device = await this.adapter.requestDevice();
        this.context = this.createContext();
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        const device = this.device;
        const presentationFormat = this.presentationFormat;
        this.context.configure({
            device,
            format: presentationFormat,
            alphaMode: 'premultiplied',
        });
    }

    async getAdapter() {
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

    createContext(width = 500, height = 500) {
        const canvas = this.createCanvas(width, height);
        return canvas.getContext('webgpu');
    }

    createCanvas(width = 500, height = 500, id = 'texture-1') {
        const canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;
        return canvas;
    }

    colorAttachments(textureView) {
        return {
            view: textureView,
            clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 1.0},
            loadOp: 'clear',
            storeOp: 'store',
        };
    }

    generateRenderPassDescriptor() {
        const textureView = this.context.getCurrentTexture().createView();
        return {
            label: 'Render pass descriptor',
            colorAttachments: [
                this.colorAttachments(textureView)
            ]
        };
    }


    async getWgsl(url) {
        return await fetch(url).then(response => response.text());
    }
}
