import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;

const mouse = new THREE.Vector2();
const target = new THREE.Vector2();
const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
    
    camera.position.z = 1;
    camera.position.y = 1;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    scene.background = new THREE.Color( 0xADD8E6);
    document.body.appendChild( renderer.domElement );

    var loader = new GLTFLoader();
    loader.load("../blender/manikin.glb", gltf => {
    scene.add( gltf.scene );
    // renderer.render(scene, camera);
    }, undefined, function ( error ) {
        console.error( error );
    }
    );
    
    document.addEventListener( 'wheel', onMouseWheel, false );
    

    
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
    



function onMouseWheel( event ) {

    camera.position.z += event.deltaY * 0.1; // move camera along z-axis
  
}

function animate() {

    target.x = ( 1 - mouse.x ) * 0.002;
    target.y = ( 1 - mouse.y ) * 0.002;
  
    camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
    camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}
