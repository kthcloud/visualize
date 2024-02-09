// import * as THREE from 'three';
import * as THREE from "./three.js";
let camera, scene, renderer;
let cylinder;
let lastFrame = 0;

let radius = 10;
const geometry = new THREE.CylinderGeometry(radius, radius, 20, 256, 1, true);
let texture;


const initThree = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("canvas3d"),
    preserveDrawingBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // add ambient light
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  // green background
  scene.background = new THREE.Color("red");

  camera.position.x = 0;
  camera.position.y = 4.3;
  camera.position.z = 7;
  camera.lookAt(0, 0, 1000);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    if (Date.now() - lastFrame > 1000) {
      html2canvas(document.getElementById("root")).then((canvas) => {
        let ctx = canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let newCanvas = document.getElementById("canvas-scaler");
        newCanvas.width = canvas.width * 9.8;
        newCanvas.height = canvas.height * 6;
        let newCtx = newCanvas.getContext("2d");
        newCtx.fillStyle = "transparent";
        newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
        // Once captured, use the canvas as a texture
        // "zoom out" image by adding a white border of 50% of the image size

        let x = (newCanvas.width - canvas.width) * 0.5;
        // let y = (newCanvas.height - canvas.height) * 0.5;
        newCtx.putImageData(imageData, x, 0);
        canvas = newCanvas;

        if (!texture) {
          texture = new THREE.Texture(canvas);
        }
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        texture.repeat.y = 1;

        // clone the texture
        // add 50% padding around the texture
        texture.offset.x = 0.5;
        texture.offset.y = 0.2;

        // Create a curved surface (e.g., cylinder) and apply the texture
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const newCylinder = new THREE.Mesh(geometry, material);

        // remove
        scene.remove(cylinder);

        // add
        cylinder = newCylinder;
        cylinder.position.x = 0;
        cylinder.position.y = 0;
        cylinder.position.z = 0;
        scene.add(cylinder);
        lastFrame = Date.now();
        renderer.render(scene, camera);
      });
    }
  }

  animate();
};

initThree();
