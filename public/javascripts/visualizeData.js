import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from "../../blender/dat.gui.module.d.js";

let camera, scene, renderer, controls, stats;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

const additiveActions = {
    time: { weight: 0 },
    gaussian_filter: { weight: 0 }
};
const crossFadeControls = [];
var mouseDown = false,
mouseX = 0,
mouseY = 0;

init();
animate();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
    
    camera.position.z = 1;
    camera.position.y = 0;
    camera.rotation.z = 1;
 

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    scene.background = new THREE.Color( 0xADD8E6);
    scene.position.y = -1;
    document.body.appendChild( renderer.domElement );

   
    var loader = new GLTFLoader();
    var lightA1 = new THREE.AmbientLight(0xFFFFFF, 1.5)
    scene.add(lightA1)

    loader.load("../blender/source/rp_claudia_rigged_002_yup_a.glb", gltf => {
        // gltf.scene.position.set(-2,-2,-2)
        scene.add( gltf.scene );
    // renderer.render(scene, camera);
    }, undefined, function ( error ) {
        console.error( error );
    }
    );
    document.addEventListener( 'wheel', onMouseWheel, false );
    controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    createPanel();

    
}
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );


    // var data = JSON.parse(localStorage.getItem('data'));
    // var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    // var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    // var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    // var shoe_data = ["LSHOE", "RSHOE"];
    // var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];
    // console.log(data)
    // for(var i = 0; i < data.length; i++) {
    //     document.getElementById('table').innerHTML += "time: " + data[i]["time"] + "<br>";
    //     document.getElementById('table').innerHTML += "acc:" + "<br>";
    //     for(var j = 0; j < acc_data.length; j += 1) {
    //         document.getElementById('table').innerHTML += [acc_data[j]] + ": " + data[i]["acc"][acc_data[j]] + "<br>";
    //     }
    //     document.getElementById('table').innerHTML += "inertial:" + "<br>"
    //     for(var j = 0; j < inertial_data.length; j++) {
    //         document.getElementById('table').innerHTML += [inertial_data[j]] + ": " + "<br>";
    //         for(var k = 0; k < inertial_data_xyz.length; k++) {
    //             document.getElementById('table').innerHTML += [inertial_data_xyz[k]] + ": " + data[i]["inertial"][inertial_data[j]][inertial_data_xyz[k]] + "<br>"
    //         }
    //     }
    //     document.getElementById('table').innerHTML +="<br>"
    // }
    
function createPanel() {

        const panel = new GUI( { width: 310 } );
        panel.domElement.id = 'gui';
        document.getElementById("gui").style.marginTop = "56px";

        const folder2 = panel.addFolder( 'Options' );
        const settings = additiveActions["time"]

        var panelSettings = {
            'gaussian_filter': 0,
            'time': 0
        };
        
        folder2.add(panelSettings, "time", 0.0, 10.0, 1.0).listen().onChange( function ( weight ) { 
            // setWeight( settings.action, weight );
            settings.weight = weight;
        });

        folder2.add( panelSettings, 'gaussian_filter', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );
        folder2.open();

}

function setWeight( action, weight ) {
    console.log(weight)
    // action.enabled = true;
    // action.setEffectiveTimeScale( 1 );
    // action.setEffectiveWeight( weight );

}
function modifyTimeScale( speed ) {
    console.log(speed)
    // mixer.timeScale = speed;

}

function onMouseWheel( event ) {
    camera.position.z += event.deltaY * 0.1; // move camera along z-axis
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
}
function render() {
    renderer.render(scene, camera);
}
