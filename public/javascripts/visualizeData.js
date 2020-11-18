import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from "../../blender/dat.gui.module.d.js";
import * as FUSION_AHRS from "./SensorFusion/FusionAhrs.js";
import * as FUSION from "./SensorFusion/FusionTypes.js";
import * as COMPRESSED_FUSION from "./SensorFusion/Compressed/Fusion.min.js"
import * as PARSE_FILE from "./parseFile.js"

let camera, scene, renderer, controls, stats;
let BACK, RUA, RLA, LUA, LLA, LLR;

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
                    case "lowerarm_l":
                        RLA = obj;
                        break;
                    case "lowerarm_r":
                        LLR = obj;
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
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

function getRaw() { //uses parseFile.js to create raw_data
   
    // for(var i = 0; i < raw_data.length; i++) {
    //     document.getElementById('table').innerHTML += "time: " + raw_data[i]["time"] + "<br>";
    //     document.getElementById('table').innerHTML += "acc:" + "<br>";
    //     for(var j = 0; j < acc_data.length; j += 1) {
    //         document.getElementById('table').innerHTML += [acc_data[j]] + ": " + raw_data[i]["acc"][acc_data[j]] + "<br>";
    //     }
    //     document.getElementById('table').innerHTML += "inertial:" + "<br>"
    //     for(var j = 0; j < inertial_data.length; j++) {
    //         document.getElementById('table').innerHTML += [inertial_data[j]] + ": " + "<br>";
    //         for(var k = 0; k < inertial_data_xyz.length; k++) {
    //             document.getElementById('table').innerHTML += [inertial_data_xyz[k]] + ": " + raw_data[i]["inertial"][inertial_data[j]][inertial_data_xyz[k]] + "<br>"
    //         }
    //     }
    //     document.getElementById('table').innerHTML +="<br>"
    // }
} //NOTE: all values are currently strings, not integers

async function fuseData() {
    var raw_data = JSON.parse(localStorage.getItem('data'));

    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];
    console.log(raw_data)

    //initialize sensor fusion variables
     //going to need to do this with every bone... figure out best way to do this
    var fusionAhrs = {"gain":0,"minMagneticFieldSquared":0,"maxMagneticFieldSquared":0,"quaternion":{"element":{"w":0,"x":0,"y":0,"z":0}},"linearAcceleration":{"axis":{"x":0,"y":0,"z":0}},"rampedGain":0};
    var gyro = {"axis":{"x":0,"y":0,"z":0}};
    var accelerometer = {"axis":{"x":0,"y":0,"z":0}};
    var magnetometer = {"axis":{"x":0,"y":0,"z":0}};
    var quaternion = []
    var deltaT = 0  
    var prevTime = 0
    for(var i = 0; i < 1; i++) {
        var data = await raw_data[i]["inertial"]; 
        var t = raw_data[i]["time"];
        
        // gyro.axis.x = parseInt(data["RUA"].gyro[0]);
        // gyro.axis.y = parseInt(data["RUA"].gyro[1]);
        // gyro.axis.z = parseInt(data["RUA"].gyro[2]);
        
        // accelerometer.axis.x = parseInt(data["RUA"].acc[0])
        // accelerometer.axis.y = parseInt(data["RUA"].acc[1])
        // accelerometer.axis.z = parseInt(data["RUA"].acc[2])
        
        // magnetometer.axis.x = parseInt(data["RUA"].magnetic[0]);
        // magnetometer.axis.y = parseInt(data["RUA"].magnetic[1]);
        // magnetometer.axis.z = parseInt(data["RUA"].magnetic[2]);     
        console.log(data["RUA"].quaternion)
        var q0 = parseInt(data["RUA"].quaternion[0]);
        var q1 = parseInt(data["RUA"].quaternion[1]);
        var q2 = parseInt(data["RUA"].quaternion[2]);
        var q3 = parseInt(data["RUA"].quaternion[3]);

        console.log(2 * (q0 * q2 - q3 * q1))

        var Rx = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)))
        var Ry = Math.asin(2 * (q0 * q2 - q3 * q1));
        var Rz = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2  * (q2 * q2 + q3 * q3)));
      
        var euler = [Rx, Ry, Rz]
        console.log(euler)
        // deltaT = t

        // if(i > 0) {
        //     deltaT = deltaT - prevTime;
        // }

        // prevTime = t;
        // console.log(qte(quaternion))
        // FUSION_AHRS.FusionAhrsUpdate(fusionAhrs, gyro, accelerometer, magnetometer, deltaT); //variation is available if not all 3 sensors. Make this a UI option in future?
        // var eulerAngles = COMPRESSED_FUSION.FusionQuaternionToEulerAngles(FUSION.FusionAhrsGetQuaternion(fusionAhrs));
        // console.log(eulerAngles.angle.roll, eulerAngles.angle.pitch, eulerAngles.angle.yaw);
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