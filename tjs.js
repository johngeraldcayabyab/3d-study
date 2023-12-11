class TJS {
    constructor() {
    }

    async init() {
        this.adapter = await this.getAdapter();
        const device = await this.adapter.requestDevice();
        this.device = device;
        this.context = this.createContext();
        this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        const presentationFormat = this.presentationFormat;
        this.context.configure({
            device,
            format: presentationFormat,
            alphaMode: 'premultiplied',
        });
    }

    renderPipeline(shader) {
        // Theres an issue when using this with request animation frame
        const pipeline = this.createTrianglePipeline(shader);
        this.render(pipeline);
        return null;
    }

    render(pipeline, vertexCount) {
        const commandEncoder = this.device.createCommandEncoder({label: 'Encoder'});
        const passEncoder = commandEncoder.beginRenderPass(this.generateRenderPassDescriptor());
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();
        const commandBuffer = commandEncoder.finish();
        this.device.queue.submit([commandBuffer]);
        requestAnimationFrame(() => this.render(pipeline, vertexCount));
        return null;
    }

    createUniformBuffer(uniformBufferSize) {
        const uniformBuffer = this.device.createBuffer({
            label: 'uniforms for triangle',
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const uniformValues = new Float32Array(uniformBufferSize / 4);
        const kColorOffset = 0;
        const kScaleOffset = 4;
        const kOffsetOffset = 6;
        uniformValues.set([0, 1, 0, 1], kColorOffset);
        uniformValues.set([-0.5, -0.25], kOffsetOffset);
    }

    createBindGroup(uniformBuffer, pipeline) {
        return this.device.createBindGroup({
            label: 'triangle bind group',
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
            ],
        });
    }


    createTrianglePipeline(shader) {
        return this.device.createRenderPipeline({
            label: 'our hardcoded red triangle pipeline',
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({
                    label: 'Hard coded triangle shader',
                    code: shader
                }),
                entryPoint: 'vs',
            },
            fragment: {
                module: this.device.createShaderModule({
                    label: 'Hard coded triangle shader',
                    code: shader
                }),
                entryPoint: 'fs',
                targets: [{
                    format: this.presentationFormat
                }],
            },
            primitive: {
                topology: Topology.TRIANGLE_LIST,
            },
        });
    }

    createRectanglePipeline(shader) {
        return this.device.createRenderPipeline({
            label: 'our hardcoded red rectangle pipeline',
            layout: 'auto',
            vertex: {
                module: this.device.createShaderModule({
                    label: 'Hard coded rectangle shader',
                    code: shader
                }),
                entryPoint: 'vs',
            },
            fragment: {
                module: this.device.createShaderModule({
                    label: 'Hard coded rectangle shader',
                    code: shader
                }),
                entryPoint: 'fs',
                targets: [{
                    format: this.presentationFormat
                }],
            },
            primitive: {
                topology: Topology.TRIANGLE_STRIP,
            },
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
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width * devicePixelRatio;
        canvas.height = height * devicePixelRatio;
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
