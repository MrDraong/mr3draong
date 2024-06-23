import * as THREE from "three";

const scene = new THREE.Scene();
scene.rotateX(0.5);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 0;
camera.position.z = 5;

// Créer le canvas à la taille du navigateur et l'ajoute dans le body
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Lumière de type soleil, par défaut topdown
const directionalLight = new THREE.DirectionalLight(0x404040, 250);
directionalLight.position.set(-10, 10, 1);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const materialBrown = new THREE.MeshPhongMaterial({
  color: 0x92623a,
});
//const materialRed = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
//const cubeRed = new THREE.Mesh( geometry, materialRed );
scene.background = new THREE.Color("skyblue");

for (let x = -3; x < 4; x = x + 0.5) {
  for (let z = -2; z < 3; z = z + 0.5) {
    const cube = new THREE.Mesh(geometry, materialBrown);
    scene.add(cube);
    cube.position.set(x, 0, z);
  }
}

function animate() {
  renderer.render(scene, camera);
}
