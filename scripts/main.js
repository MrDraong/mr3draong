import * as THREE from "three";
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
let scene, camera, raycaster, renderer;
let intersected, clicked;
const pointer = new THREE.Vector2();
const clickPointer = new THREE.Vector2();

init();

function init(){

    // Création de la scene et lui donne un angle
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    scene.rotateX(0.4); 
    // Lumière de type soleil, par défaut topdown
    const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
    directionalLight.position.set(-10, 10, 1);
    scene.add(directionalLight);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.y = 0;
    camera.position.z = 5;
    
    raycaster = new THREE.Raycaster();
    
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const smallCubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    
    // Création d'une plateforme à partir de cubes
    for (let x = -3; x < 4; x = x + 0.5) {
      for (let z = -2; z < 3; z = z + 0.5) {
        const cube = new THREE.Mesh(cubeGeometry, new THREE.MeshToonMaterial({
          color: 0x92623a,
        }));
        cube.position.set(x, 0, z);
        scene.add(cube);
      }
    }
    const linkedinCube = new THREE.Mesh(smallCubeGeometry, new THREE.MeshToonMaterial({
      color: 0x1040ff,
    }));
    Object.defineProperty(linkedinCube, "cubeName", {value : "linkedin"});
    linkedinCube.position.set(-2, 0.4, 2.5);
    linkedinCube.rotateY(0.5);
    scene.add(linkedinCube);

    const githubCube = new THREE.Mesh(smallCubeGeometry, new THREE.MeshToonMaterial({
      color: 0x2b3137,
    }));
    Object.defineProperty(githubCube, "cubeName", {value : "github"});
    githubCube.position.set(0, 0.4, 2.5);
    githubCube.rotateY(0.5);
    scene.add(githubCube);

    const itchioCube = new THREE.Mesh(smallCubeGeometry, new THREE.MeshToonMaterial({
      color: 0xda2c49,
    }));
    Object.defineProperty(itchioCube, "cubeName", {value : "itchio"});
    itchioCube.position.set(2.5, 0.4, 2.5);
    itchioCube.rotateY(0.5);
    scene.add(itchioCube);

    // Créer le canvas à la taille du navigateur et l'ajoute dans le body
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
}

function onPointerMove(event) {
	pointer.set((( event.clientX / window.innerWidth ) * 2 - 1), (- ( event.clientY / window.innerHeight ) * 2 + 1));
	raycaster.setFromCamera( pointer, camera );

	const intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

        if ( intersected != intersects[ 0 ].object ) {

            if (intersected) {
              intersected.material.emissive.setHex( intersected.currentHex );
            }
            
            intersected = intersects[ 0 ].object;
            if(intersected?.cubeName === "linkedin" || intersected?.cubeName === "github" || intersected?.cubeName === "itchio"){
              intersected.currentHex = intersected.material.emissive.getHex();
              intersected.material.emissive.setHex( 0x00ff00 );
            }         
            
        }

    }
}

function onPointerDown(event) {
  clickPointer.set((( event.clientX / window.innerWidth ) * 2 - 1), (- ( event.clientY / window.innerHeight ) * 2 + 1));
  
	raycaster.setFromCamera( clickPointer, camera );

	const intersects = raycaster.intersectObjects( scene.children );
  
	if ( intersects.length > 0 ) {
        if ( clicked != intersects[ 0 ].object ) {

          clicked = intersects[ 0 ].object;
            
            if(clicked.cubeName === "linkedin") {
              window.open("https://www.linkedin.com/in/charles-capiaux-88a501184", "Linkedin");
            }
            if (clicked.cubeName === "github"){
              window.open("https://github.com/MrDraong", "Github");
            }
            if(clicked.cubeName === "itchio"){
              window.open("https://mrdraong.itch.io/", "Itchio");
            }
        }

    }
}

function animate() {
  render()
}

function render() {
  const effect = new OutlineEffect( renderer );
	effect.render( scene, camera );
}