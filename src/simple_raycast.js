import "../style.css";
import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

main();

function main() {
    let renderer, scene, camera, controls, stats, INTERSECTED;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    init();
    animate();

    function init() {
        
        renderer = createRenderer(renderer);

        scene = new THREE.Scene();
        scene.background = '#000';

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        camera.lookAt(0, 0, 0);
        camera.position.y = 500;
        camera.position.z = 500;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // scene.add(createPlane());
        scene.add(createBox());

        container.addEventListener('pointermove', onPointerMove);
        stats = new Stats();
        container.appendChild(stats.dom);
    }

    function createPlane() {
        const geometry = new THREE.PlaneGeometry(7500, 7500, 256 - 1, 256 - 1);
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshPhongMaterial({color: 0xbfd1e5, side: THREE.DoubleSide});
        return new THREE.Mesh(geometry, material);
    }

    function createBox() {
        const geometry = new THREE.BoxGeometry(50, 50, 50);
        const material = new THREE.MeshPhongMaterial({color: 0x13FF14});
        const box = new THREE.Mesh(geometry, material);
        // box.geometry.faces[0].color.setHex( 0xFF4A35);
        // box.geometry.faces[1].color.setHex( 0x2846FF);
        // object.geometry.colorsNeedUpdate = true;
        console.log(box);
        // box.geometry.colorsNeedUpdate = true;
        box.position.y = 50;
        return box;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onPointerMove(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function findIntersections() {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            if (INTERSECTED !== intersects[0].object) {
                if (INTERSECTED) {
                    // INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
                }
                // INTERSECTED = intersects[0].object;
                // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                // INTERSECTED.material.emissive.setHex(0xff0000);
            }
        }
    }

    function render() {
        findIntersections();
        renderer.render(scene, camera);
    }
}