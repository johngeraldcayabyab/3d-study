import * as THREE from 'three';
import {DragControls} from "three/examples/jsm/controls/DragControls.js";

main();

function main() {
    let container;
    let camera, scene, renderer;
    let controls, group;
    let enableSelection = false;


    const objects = [];

    const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

    init();

    function init() {

        

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.z = 1000;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        scene.add(new THREE.AmbientLight(0x505050));

        const light = new THREE.SpotLight(0xffffff, 1.5);
        light.position.set(0, 500, 2000);
        light.angle = Math.PI / 9;

        light.castShadow = true;
        light.shadow.camera.near = 1000;
        light.shadow.camera.far = 4000;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        scene.add(light);

        group = new THREE.Group();
        scene.add(group);



        const boxGeometry = new THREE.BoxGeometry(40, 40, 40);
        const sphereGeometry = new THREE.SphereGeometry(40, 40, 40);

        createObjects(boxGeometry);
        createObjects(sphereGeometry);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        container.appendChild(renderer.domElement);

        controls = new DragControls([...objects], camera, renderer.domElement);
        controls.addEventListener('drag', render);
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('click', onClick);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        render();
    }

    function createObjects(geometry, quantity = 50){
        for (let i = 0; i < quantity; i++) {
            const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: Math.random() * 0xFFFFFF}));
            randomizeObjectPosition(mesh);
            randomizeObjectRotation(mesh);
            randomizeObjectScale(mesh);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
            objects.push(mesh);
        }
    }

    function randomizeObjectPosition(object){
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600 - 300;
        object.position.z = Math.random() * 800 - 400;
    }

    function randomizeObjectRotation(object){
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
    }

    function randomizeObjectScale(object){
        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function onKeyDown(event) {
        enableSelection = (event.keyCode === 16);
    }

    function onKeyUp() {
        enableSelection = false;
    }

    function onClick(event) {
        event.preventDefault();
        if (enableSelection === true) {
            const draggableObjects = controls.getObjects();
            draggableObjects.length = 0;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersections = raycaster.intersectObjects(objects, true);
            if (intersections.length > 0) {
                const object = intersections[0].object;
                if (group.children.includes(object) === true) {
                    object.material.emissive.set(0x000000);
                    scene.attach(object);
                } else {
                    object.material.emissive.set(0xaaaaaa);
                    group.attach(object);
                }
                controls.transformGroup = true;
                draggableObjects.push(group);
            }

            if (group.children.length === 0) {
                controls.transformGroup = false;
                draggableObjects.push(...objects);

            }
        }

        render();
    }

    function render() {
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    }
}