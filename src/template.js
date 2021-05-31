import * as THREE from 'three';
import Stats from 'stats.js';
import {desktopFOV} from "./FIeldOfViews";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


let container, stats, camera, scene, renderer;


const clock = new THREE.Clock();
const windowInnerWidth = window.innerWidth;
const windowInnerHeight = window.innerHeight;


init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(desktopFOV(), windowInnerWidth / windowInnerHeight, 1, 40000);
    camera.position.z = 250;
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    // scene.fog = new THREE.Fog(scene.background, 1, 40000)

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(windowInnerWidth, windowInnerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);



    stats = new Stats();
    container.appendChild(stats.dom);
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function onWindowResize() {
    renderer.setSize(windowInnerWidth, windowInnerHeight);
    camera.aspect = windowInnerWidth / windowInnerHeight;
    camera.updateProjectionMatrix();
}

function render() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
}



