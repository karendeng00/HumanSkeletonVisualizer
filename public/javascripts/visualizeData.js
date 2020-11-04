import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';

window.onload = function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.background = new THREE.Color( 0xADD8E6);
   
    camera.position.z = 1;
    camera.position.y = 1;
    var loader = new GLTFLoader();
    loader.load("../blender/manikin.glb", gltf => {
        
        scene.add( gltf.scene );
        renderer.render(scene, camera);
        console.log(renderer)

    }, undefined, function ( error ) {
        console.error( error );
    }
    );
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
    
}   