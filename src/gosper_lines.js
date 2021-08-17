import "../style.css";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GeometryUtils} from "three/examples/jsm/utils/GeometryUtils.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

const createContainer = (container) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.setAttribute('id', 'container');
    container = document.getElementById('container');
    container.innerHTML = '';
    return container;
};

const createRenderer = (renderer, container) => {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x20252f);
    container.appendChild(renderer.domElement);
    return renderer;
};

const createScene = (scene) => {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);
    return scene;
};

const createPerspectiveCamera = (camera, position = {x: 0, y: 200, z: 200}) => {
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
    camera.lookAt(0, 0, 0);
    return camera;
};

const createControls = (controls, camera, renderer) => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls;
};

main();

function main() {
    let container, renderer, scene, camera, controls, stats, line;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        scene = new THREE.Scene();
        scene.background = '#000';

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        camera.lookAt(0, 0, 0);
        camera.position.y = 10;
        camera.position.z = 10;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        const points = GeometryUtils.gosper(7);
        const geometry = new THREE.BufferGeometry();
        const positionAttribute = new THREE.Float32BufferAttribute(points, 3);
        geometry.setAttribute('position', positionAttribute);
        geometry.center();

        const colorAttribute = new THREE.BufferAttribute(new Float32Array(positionAttribute.array.length), 3);
        colorAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('color', colorAttribute);

        const material = new THREE.LineBasicMaterial({color: 0xffffff});

        line = new THREE.Line(geometry, material);
        line.scale.setScalar(0.05);
        scene.add(line);

        stats = new Stats();
        container.appendChild(stats.dom);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        renderer.render(scene, camera);
    }
}