import * as THREE from "three";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

let scene, camera, raycaster, renderer, effect;
let intersected, clicked;
let linkedinCube;
let currentTile = 0,
  offsetX = 0,
  elapsedTime = 0,
  slimeAnimationDuration = 1.5;
let spriteMap, displayTime;
const horizontalSize = 5,
  verticalSize = 1;

const pointer = new THREE.Vector2();
const clickPointer = new THREE.Vector2();
const clock = new THREE.Clock();

const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();

init();

function init() {
  // Create scene with some angle
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf7edb9);

  // Sunlight effect
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(-1, 1, 1);
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

  createCubes();
  createText();
  createSlime();

  // Create canvas inside the body
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  document.body.appendChild(renderer.domElement);
  // Adding a cartoon effect with outline on objects borders
  effect = new OutlineEffect(renderer);

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("resize", onWindowResize);
}

function createCubes() {
  const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  const linkedinTexture = textureLoader.load("assets/textures/linkedin.png");

  linkedinCube = new THREE.Mesh(cubeGeometry, [
    new THREE.MeshToonMaterial({
      color: 0x0a66c2,
    }),
    new THREE.MeshToonMaterial({
      map: linkedinTexture,
    }),
    new THREE.MeshToonMaterial({
      color: 0x0a66c2,
    }),
    new THREE.MeshToonMaterial({
      color: 0x0a66c2,
    }),
    new THREE.MeshToonMaterial({
      color: 0x0a66c2,
    }),
    new THREE.MeshToonMaterial({
      color: 0x0a66c2,
    }),
  ]);
  Object.defineProperty(linkedinCube, "cubeName", { value: "linkedin" });
  linkedinCube.position.set(2, -1.5, 2.5);
  linkedinCube.rotateY(0.5);
  scene.add(linkedinCube);

  const githubCube = new THREE.Mesh(
    cubeGeometry,
    new THREE.MeshToonMaterial({
      color: 0x2b3137,
    })
  );
  Object.defineProperty(githubCube, "cubeName", { value: "github" });
  githubCube.position.set(0, -1.5, 2.5);
  githubCube.rotateY(0.5);
  scene.add(githubCube);
}

function createText() {
  fontLoader.load(
    "assets/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("MrDraong", {
        font: font,
        size: 5,
        depth: 0,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 3,
      });
      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshBasicMaterial({ color: 0x5da399 })
      );
      textGeometry.center();
      textMesh.position.setZ(-10);
      scene.add(textMesh);
    }
  );
}

function createSlime() {
  offsetX = (currentTile % horizontalSize) / horizontalSize;

  spriteMap = textureLoader.load("assets/textures/purple_slime.png", () => {
    const material = new THREE.SpriteMaterial({
      map: spriteMap,
      color: 0xffffff,
    });
    const slimeSprite = new THREE.Sprite(material);
    Object.defineProperty(slimeSprite, "cubeName", { value: "itchio" });
    slimeSprite.scale.set(0.5, 0.5, 1);
    slimeSprite.position.set(-2, -1.5, 2.5);
    scene.add(slimeSprite);
  });

  spriteMap.magFilter = THREE.NearestFilter;
  spriteMap.repeat.set(1 / horizontalSize, 1 / verticalSize);
  spriteMap.offset.x = offsetX;

  displayTime = slimeAnimationDuration / horizontalSize;
}

function updateSlime() {
  elapsedTime += clock.getDelta();
  if (displayTime > 0 && elapsedTime >= displayTime) {
    elapsedTime = 0;
    currentTile = (currentTile + 1) % horizontalSize;
    offsetX = (currentTile % horizontalSize) / horizontalSize;
    spriteMap.offset.x = offsetX;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    if (intersected != intersects[0].object) {
      intersected = intersects[0].object;

      if (intersected?.cubeName === "linkedin") {
        intersected.currentHex = intersected.material[0].emissive.getHex();
        intersected.material.forEach((material) => {
          material.emissive.setHex(0x79d2e6);
        });
      } else if (intersected?.cubeName === "github") {
        intersected.currentHex = intersected.material.emissive.getHex();
        intersected.material.emissive.setHex(0x79d2e6);
      } else if (intersected?.cubeName === "itchio") {
        intersected.material.color.set("#79d2e6");
      }
    }
  } else if (intersected) {
    if (intersected?.cubeName === "linkedin") {
      intersected.material.forEach((material) => {
        material.emissive.setHex(intersected.currentHex);
      });
    } else if (intersected?.cubeName === "github") {
      intersected.material.emissive.setHex(intersected.currentHex);
    } else if (intersected?.cubeName === "itchio") {
      intersected.material.color.set("#fff");
    }
    intersected = null;
  }
}

function onPointerDown(event) {
  clickPointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(clickPointer, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    if (clicked != intersects[0].object) {
      clicked = intersects[0].object;
      switch (clicked.cubeName) {
        case "linkedin":
          window.open(
            "https://www.linkedin.com/in/charles-capiaux-88a501184",
            "Linkedin"
          );
          break;
        case "github":
          window.open("https://github.com/MrDraong", "Github");
          break;

        case "itchio":
          window.open("https://mrdraong.itch.io/", "Itchio");
      }
    }
  }
}

function animate() {
  linkedinCube.rotateY(0.01);
  updateSlime();
  render();
}

function render() {
  effect.render(scene, camera);
}
