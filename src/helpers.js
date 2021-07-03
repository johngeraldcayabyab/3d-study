// import * as THREE from "three";
import * as THREE from '../node_modules/three/build/three.module.js';
import {ImprovedNoise} from "../node_modules/three/examples/jsm/math/ImprovedNoise.js";
import Stats from '../node_modules/stats.js/src/Stats.js';
import {desktopFOV, desktopLargeFOV} from "./FIeldOfViews.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";


export const createContainer = (container) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.setAttribute('id', 'container');
    container = document.getElementById('container');
    container.innerHTML = '';
    return container;
};


export const createRenderer = (renderer, container) => {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x20252f);
    container.appendChild(renderer.domElement);
    return renderer;
};

export const createScene = (scene) => {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);
    return scene;
};

export const createPerspectiveCamera = (camera, position = {x: 0, y: 200, z: 200}) => {
    camera = new THREE.PerspectiveCamera(desktopFOV(), window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.y = position.y;
    camera.position.z = position.z;
    camera.lookAt(0, 0, 0);
    return camera;
};

export const createStats = (stats, container) => {
    stats = new Stats();
    container.appendChild(stats.dom);
    return stats;
};

export const createControls = (controls, camera, renderer) => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls;
};


export const onWindowResize = (renderer, camera) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    return true;
};

export const reMap = (val, smin, smax, emin, emax) => {
    return (emax - emin) * (val - smin) / (smax - smin) + emin;
};

export const jitter = (geo, per) => {
    const vertex = new THREE.Vertex();
    let position = geo.attributes.position;


    for (let i = 0; i < position.count; i++) {

        vertex.fromBufferAttribute(position, i);

        vertex.x += reMap(Math.random(), 0, 1, -per, per);
        vertex.y += reMap(Math.random(), 0, 1, -per, per);
        vertex.z += reMap(Math.random(), 0, 1, -per, per);

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);

        // let x = position.getX(i);
        // let y = position.getY(i);
        // let z = position.getZ(i);
        //
        // x += reMap(Math.random(), 0, 1, -per, per);
        // y += reMap(Math.random(), 0, 1, -per, per);
        // z += reMap(Math.random(), 0, 1, -per, per);
        //
        // position.setXYZ(i, x, y, z);
    }
};


class AxisGridHelper {
    constructor(node, units = 10) {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2;
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = false;
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
    }
}

export const makeAxisGrid = (gui, node, label, units) => {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
};

export const generateRandomNumberBetween = (value) => {
    return Math.floor((Math.random() * value) + 1);
}

export const generateHeight = (width, height) => {
    const size = width * height, data = new Uint8Array(size),
        perlin = new ImprovedNoise(), z = Math.random() * 100;
    let quality = 1;
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width, y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }
        quality *= 5;
    }
    return data;
}

export const generateTexture = (data, width, height) => {
    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);
    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j = 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
        const v = ~~(Math.random() * 5);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData(image, 0, 0);
    return canvasScaled;
}