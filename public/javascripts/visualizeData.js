import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from "../../blender/dat.gui.module.d.js";
import {FusionAhrsUpdate} from "./SensorFusion/FusionAhrs.js";

let camera, scene, renderer, controls, stats;
let BACK, RUA, RLA, LUA, LLA;

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
getRaw();
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
    var raw_data = JSON.parse(localStorage.getItem('data'));
    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];

    for(var i = 0; i < raw_data.length; i++) {
        document.getElementById('table').innerHTML += "time: " + raw_data[i]["time"] + "<br>";
        document.getElementById('table').innerHTML += "acc:" + "<br>";
        for(var j = 0; j < acc_data.length; j += 1) {
            document.getElementById('table').innerHTML += [acc_data[j]] + ": " + raw_data[i]["acc"][acc_data[j]] + "<br>";
        }
        document.getElementById('table').innerHTML += "inertial:" + "<br>"
        for(var j = 0; j < inertial_data.length; j++) {
            document.getElementById('table').innerHTML += [inertial_data[j]] + ": " + "<br>";
            for(var k = 0; k < inertial_data_xyz.length; k++) {
                document.getElementById('table').innerHTML += [inertial_data_xyz[k]] + ": " + raw_data[i]["inertial"][inertial_data[j]][inertial_data_xyz[k]] + "<br>"
            }
        }
        document.getElementById('table').innerHTML +="<br>"
    }
} //NOTE: all values are currently strings, not integers

function fuseData() {
    getRaw();

    //initialize sensor fusion variables
     //going to need to do this with every bone... figure out best way to do this
    var fusionAhrs = clone(FusionAhrs);
    var gyro = clone(FusionVector3);
    var accelerometer = clone(FusionVector3);
    var magnetometer = clone(FusionVector3);

    for(var i = 0; i < raw_data.length; i++) {
        g = raw_data[i]["intertial"]["RUA"]["gryo"];
        gyro.axis.x = parseInt(g[0]) + "<br>";
        gryo.axis.y = parseInt(g[1]) + "<br>";
        gryo.axis.z = parseInt(g[2]) + "<br>";

        a = raw_data[i]["intertial"]["RUA"]["acc"];
        accelerometer.axis.x = parseInt(a[0]) + "<br>";
        accelerometer.axis.y = parseInt(a[1]) + "<br>";
        accelerometer.axis.z = parseInt(a[2]) + "<br>";

        m = raw_data[i]["intertial"]["RUA"]["magnetic"];
        magnetometer.axis.x = parseInt(m[0]) + "<br>";
        magnetometer.axis.y = parseInt(m[1]) + "<br>";
        magnetometer.axis.z = parseInt(m[2]) + "<br>";

        var deltaT = data[i]["time"]; //gets time change
        if(i > 0) {
            deltaT = deltaT - data[i-1]["time"];
        }

        //fuses sensor data by updating fusionAhrs
        FusionAhrsUpdate(fusionAhrs, gyroscope, accelerometer, magnetometer, deltaT); //variation is available if not all 3 sensors. Make this a UI option in future?
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