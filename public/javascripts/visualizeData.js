import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';

window.onload = function() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // var geometry = new THREE.BufferGeometry(10, 1, 1);
    // console.log(geometry.vertices)
    // for (var i = 0; i < geometry.vertices.length; i++) {
    //     geometry.skinIndices.push(new THREE.Vector4(0, 1, 0, 0));
    //     geometry.skinWeights.push(new THREE.Vector4(1, 1, 0, 0));
    // }

    // var bones = [];

    // var bone1 = new THREE.Bone();
    // bone1.position.x = 5;
    // bones.push(bone1);

    // var bone2 = new THREE.Bone();
    // bone2.position.x = -5;
    // bones.push(bone2);
    // bone1.add(bone2);

    // var material = new THREE.MeshBasicMaterial({ color: 0x156289 });

    // var mesh = new THREE.SkinnedMesh(geometry, material);
    // var skeleton = new THREE.Skeleton(bones);

    // mesh.add(bone1);
    // mesh.bind(skeleton);
    // scene.add(mesh);

    // skeletonHelper = new THREE.SkeletonHelper(mesh);
    // skeletonHelper.material.linewidth = 2;
    // scene.add(skeletonHelper);

    var loader = new GLTFLoader();
    loader.load("/blender/manikin.glb",
    function ( gltf ) {
        scene.add( gltf.scene );

    }, undefined, function ( error ) {
    
        console.error( error );
    }
    );

    function animate() {
        requestAnimationFrame(animate);

    // var time = Date.now() * 0.001;

    // mesh.skeleton.bones[0].rotation.z = Math.sin(time) * 2;

        renderer.render(scene, camera);
    }

    animate();



    var data = JSON.parse(localStorage.getItem('data'));
    var acc_data = ["RKN^", "HIP", "LUA^", "RUA_", "LH", "BACK", "RKN_", "RWR", "RUA^", "LUA_", "LWR", "RH"];
    var inertial_data = ["BACK", "RUA", "RLA", "LUA", "LLA"];
    var inertial_data_xyz = ["acc", "gyro", "magnetic", "quaternion"];
    var shoe_data = ["LSHOE", "RSHOE"];
    var shoe_data_xyz = ["Eu", "Nav", "Body", "AngVelBodyFrame", "AngVelNavFrame", "Compass"];
    console.log(data)
    for(var i = 0; i < data.length; i++) {
        document.getElementById('table').innerHTML += "time: " + data[i]["time"] + "<br>";
        document.getElementById('table').innerHTML += "acc:" + "<br>";
        for(var j = 0; j < acc_data.length; j += 1) {
            document.getElementById('table').innerHTML += [acc_data[j]] + ": " + data[i]["acc"][acc_data[j]] + "<br>";
        }
        document.getElementById('table').innerHTML += "inertial:" + "<br>"
        for(var j = 0; j < inertial_data.length; j++) {
            document.getElementById('table').innerHTML += [inertial_data[j]] + ": " + "<br>";
            for(var k = 0; k < inertial_data_xyz.length; k++) {
                document.getElementById('table').innerHTML += [inertial_data_xyz[k]] + ": " + data[i]["inertial"][inertial_data[j]][inertial_data_xyz[k]] + "<br>"
            }
        }
        document.getElementById('table').innerHTML +="<br>"
    }
    
}   