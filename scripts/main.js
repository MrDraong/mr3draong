import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const materialGreen = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
//const materialRed = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
const cubeGreen = new THREE.Mesh( geometry, materialGreen );
//const cubeRed = new THREE.Mesh( geometry, materialRed );

//scene.add(cubeGreen);
//scene.add(cubeRed); 
//cubeRed.position.set(1, 0, 0);

for (let i = -3; i < 4; i++) {
    for(let j = -2; j < 3; j++){
        const cube = new THREE.Mesh( geometry, materialGreen );
        scene.add(cube);
        cube.position.set(i, j, 0);
    }   
}

camera.position.z = 5;

function animate() {
    scene.rotateX(0.01);
    scene.rotateY(0.005);
	renderer.render( scene, camera );
}