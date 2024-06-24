import * as THREE from "three";

let scene, camera, raycaster, renderer;
let intersected;
const pointer = new THREE.Vector2();

init(); 

function init(){

    // Création de la scene et lui donne un angle
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    scene.rotateX(0.5); 
    // Lumière de type soleil, par défaut topdown
    const directionalLight = new THREE.DirectionalLight(0x404040, 250);
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
    
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    
    // Création d'une plateforme à partir de cubes
    for (let x = -3; x < 4; x = x + 0.5) {
      for (let z = -2; z < 3; z = z + 0.5) {
        const cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: 0x92623a,
          }));
        scene.add(cube);
        cube.position.set(x, 0, z);
      }
    }

    // Créer le canvas à la taille du navigateur et l'ajoute dans le body
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    document.body.appendChild(renderer.domElement);

    //window.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
}

/*function onPointerMove(event) {
	pointer.set((( event.clientX / window.innerWidth ) * 2 - 1), (- ( event.clientY / window.innerHeight ) * 2 + 1));

}*/

function onPointerDown(event) {
    pointer.set((( event.clientX / window.innerWidth ) * 2 - 1), (- ( event.clientY / window.innerHeight ) * 2 + 1));
    
    // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {

        if ( intersected != intersects[ 0 ].object ) {

            if ( intersected ) {
                intersected.material.emissive.setHex( intersected.currentHex );
            }

            intersected = intersects[ 0 ].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.setHex( 0x00ff00 );

        }

    }
}

function onPointerUp(event) {
    if (intersected) {
        intersected.material.emissive.setHex( intersected.currentHex );
    }

    intersected = null;
}

function animate() {
  render()
}

function render() {
	renderer.render( scene, camera );
}