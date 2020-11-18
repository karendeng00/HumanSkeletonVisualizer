import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from "../../blender/dat.gui.module.d.js";

let camera, scene, renderer, controls, stats;
let BACK, RUA, RLA, LUA, LLA;

var euler = []
var weight = 0
for(var i = 0; i < 1000; i++) {
    var angles = {
        "RUA": {
            x: 0,
            y: 0,
            z: 0
        },
        "RLA": {
            x: 0,
            y: 0,
            z: 0
        },
        "LUA": {
            x: 0,
            y: 0,
            z: 0 
        },
        "LLA": {
            x: 0,
            y: 0,
            z: 0 
        }
    }
    euler.push(angles)
}

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
fuseData();
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

    const model_path = "../blender/source/rp_claudia_rigged_002_yup_a.glb";

    loader.load(model_path, gltf => {
        // gltf.scene.position.set(-2,-2,-2)
        var model = gltf.scene;
        scene.add( model );

        // centers the model
        // var center = new THREE.Vector3();
        // box.getCenter( center );
        // obj.position.sub( center );
        
        var fileAnimations = gltf.animations; //initializes animations

        model.traverse(obj => { //sets bones to variables 
            if (obj.isBone) { 
                switch(obj.name) {
                    case "upperarm_l":
                        LUA = obj;
                        break;
                    case "upperarm_r":
                        RUA = obj;
                        break;
                    case "lowerarm_r":
                        RLA = obj;
                        break;
                    case "lowerarm_l":
                        LLA = obj;
                        break;
                }
            }
        });

        var mixer = new THREE.AnimationMixer(model); //used in "update"
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



async function fuseData() {
    var raw_data = JSON.parse(localStorage.getItem('data'));

    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_test = ["RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];

    var quaternion = []
    for(var i = 0; i < 1000; i++) {
        for(var j = 0; j < inertial_test.length; j++) {
            var data = await raw_data[i]["inertial"]; 
            var t = raw_data[i]["time"];
               
            var q0 = parseInt(data[inertial_test[j]].quaternion[0]) / 1000;
            var q1 = parseInt(data[inertial_test[j]].quaternion[1]) / 1000;
            var q2 = parseInt(data[inertial_test[j]].quaternion[2]) / 1000;
            var q3 = parseInt(data[inertial_test[j]].quaternion[3]) / 1000;

            euler[i][inertial_test[j]].x  = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)))
            euler[i][inertial_test[j]].y  = Math.asin(2 * (q0 * q2 - q3 * q1));
            euler[i][inertial_test[j]].z  = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2  * (q2 * q2 + q3 * q3)));
            
        }
        console.log(euler[i])
    }
    

 }

//creates options panel
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
        
        folder2.add(panelSettings, "time", 0.0, 1000.0, 1.0).onChange( function ( time ) { 
            // setWeight( settings.action, weight );
            weight = time;
        });

        folder2.add( panelSettings, 'gaussian_filter', 0.0, 1.5, 0.01).onChange( modifyTimeScale );
        folder2.open();

}

// function setWeight(weight ) {
//     console.log(weight)
//     this.weight = weight
//     animate()

// }
function modifyTimeScale( speed ) {
    console.log(speed)
    // mixer.timeScale = speed;
}

function onMouseWheel( event ) {
    camera.position.z += event.deltaY * 0.1; // move camera along z-axis
}

function animate() {
    console.log(weight)
    requestAnimationFrame( animate );
    if(RUA) {
        RUA.rotation.x = euler[weight]["RUA"].x 
        RUA.rotation.y = euler[weight]["RUA"].y
        RUA.rotation.z = euler[weight]["RUA"].z 
    }
    if(RLA) {
        RLA.rotation.x = euler[weight]["RLA"].x 
        RLA.rotation.y = euler[weight]["RLA"].y
        RLA.rotation.z = euler[weight]["RLA"].z 
    }
    
    if(LUA) {
        LUA.rotation.x = euler[weight]["LUA"].x 
        LUA.rotation.y = euler[weight]["LUA"].y
        LUA.rotation.z = euler[weight]["LUA"].z 
    }
    if(LLA) {
        LLA.rotation.x = euler[weight]["LLA"].x 
        LLA.rotation.y = euler[weight]["LLA"].y
        LLA.rotation.z = euler[weight]["LLA"].z 
    }
    controls.update();
    
}
function render() {
    renderer.render(scene, camera);
}