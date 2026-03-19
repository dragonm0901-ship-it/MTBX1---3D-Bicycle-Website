// 1. Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance" 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene.fog = new THREE.Fog('#080808', 10, 50);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Key Lights
const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
light1.position.set(5, 10, 7.5);
light1.castShadow = true;
scene.add(light1);

// Ground Shadow Plane
const floorGeom = new THREE.PlaneGeometry(100, 100);
const floorMat = new THREE.ShadowMaterial({ opacity: 0.4 });
const floor = new THREE.Mesh(floorGeom, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.5;
floor.receiveShadow = true;
scene.add(floor);

// 3. Asset Management
let bike;
const loader = new THREE.GLTFLoader();

loader.load('models/santa_cruz_v10_downhill_mountain_bicycle.glb', (gltf) => {
    bike = gltf.scene;

    // --- AUTO-SCALE & CENTER ---
    const box = new THREE.Box3().setFromObject(bike);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale model
    const scaleFactor = 3 / size.y;
    bike.scale.set(scaleFactor, scaleFactor, scaleFactor);

    bike.position.x += (bike.position.x - center.x) * scaleFactor;
    bike.position.y += (bike.position.y - center.y) * scaleFactor;
    bike.position.z += (bike.position.z - center.z) * scaleFactor;

    bike.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;

            if(node.material) {
                node.material.roughness = 0.4;
                node.material.metalness = 0.6;
            }
        }
    });

    scene.add(bike);
    
    // Starting Position
    camera.position.set(0, 0, 8); 
    bike.rotation.y = -Math.PI / 2;

    document.getElementById('loader').style.display = 'none';
    initAnimations();
}, 
(err) => { console.error("Visibility Error: Check model path.", err); });

// 4. Scroll Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const totalRotation = -Math.PI * 3; 

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.8, // premium feel
            invalidateOnRefresh: true
        }
    });


// POS 1 -> 2
    tl.to(bike.position, { x: -1.2, y: -0.6, z: 1.5 }, "step1")
      .to(bike.rotation, { y: -0.8, x: 0.1 }, "step1") 
      .to("#zoom-frame .detail-card", { opacity: 1, x: 0 }, "step1");

    // POS 2 -> 3
    tl.to(bike.position, { x: 1.8, y: 0.5, z: 4.4 }, "step2")
      .to(bike.rotation, { y: 1.8, x: -0.2 }, "step2") 
      .to("#zoom-cockpit .detail-card", { opacity: 1, x: 0 }, "step2");

    // POS 3 -> 4
    tl.to(bike.position, { x: 1, y: 0.6, z: 5.0 }, "step3")
      .to(bike.rotation, { y: -0.9, x: 0.2 }, "step3")
      .to("#zoom-wheelset .detail-card", { opacity: 1, x: 0 }, "step3");

    // POS 4 -> 5
    tl.to(bike.position, { x: 0, y: -0.8, z: 0 }, "final")
      .to(bike.rotation, { x: 0, y: 2.9 / 2, z: 0 }, "final") 
      .to(camera.position, { z: 6.5 }, "final");
}

// 6. UI Interaction Handlers
function toggleMenu(type) {
    const modal = document.getElementById('info-modal');
    modal.style.display = 'block';
    const body = document.getElementById('modal-body');
    if(type === 'tech') {
        body.innerHTML = `<h3>Tech Specs</h3><ul><li>T1000 Carbon Fiber</li><li>Ceramic Bearings</li></ul>`;
    } else {
        body.innerHTML = `<h3>Components</h3><ul><li>XTR Di2 Drivetrain</li><li>Enve Carbon Wheels</li></ul>`;
    }
}

function openBooking() {
    alert("Booking System Initialized. Our team will contact you for a ride.");
}

function closeModal() { document.getElementById('info-modal').style.display = 'none'; }

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    if(bike) {
        // Gentle float animation
        bike.position.y += Math.sin(Date.now() * 0.001) * 0.0003;
    }
    renderer.render(scene, camera);
}
animate();

let bikeModel = null; // This will hold your 3D object after loading

// 1. Loading the Model (simplified Three.js GLTF loader example)
loader.load('bike_model.gltf', function (gltf) {
    bikeModel = gltf.scene;
    scene.add(bikeModel);
});