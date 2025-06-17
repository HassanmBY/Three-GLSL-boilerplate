import * as THREE from "three";
import {
	OrbitControls,
	EffectComposer,
	RenderPass,
	UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

const BLOOM = {
	active: false,
	strength: 0.2,
};

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

let clock = new THREE.Clock();

function init() {
	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.z = 5;

	// Renderer
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Orbit control
	const orbitControl = new OrbitControls(camera, renderer.domElement);
	orbitControl.enableDamping = true;
	orbitControl.dampingFactor = 0.025;
	orbitControl.rotateSpeed = 1;
	orbitControl.update();

	// Effect Composer
	const effectComposer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);

	effectComposer.addPass(renderPass);

	const bloomPass = new UnrealBloomPass(
		new THREE.Vector2(window.innerWidth, window.innerHeight), // resolution
		+BLOOM.active * BLOOM.strength, // strength
		0.4, // radius
		0.05 // threshold
	);

	effectComposer.addPass(bloomPass);

	effectComposer.render();

	// Materials

	const shaderMaterial = new THREE.ShaderMaterial({
		fragmentShader: fragmentShader,
		vertexShader: vertexShader,
		uniforms: {
			uTime: { value: 0 },
			uRadius: { value: 0.001 },
			uResolution: { value: 200 },
			uMouse: { value: new THREE.Vector2(0.0, 0.0) },
			cameraPosition: { value: camera.position },
			uResolution: {
				value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1.0),
			},
		},
		wireframe: true,
	});

	// Resize handling
	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	// Geometry
	const geometry = new THREE.SphereGeometry();
	const material = new THREE.MeshNormalMaterial();
	const cube = new THREE.Mesh(geometry, shaderMaterial);
	scene.add(cube);

	// Animation loop
	function animate() {
		let elapsed = clock.getElapsedTime();
		requestAnimationFrame(animate);

		// Rotate cube
		// cube.rotation.x += Math.sin(elapsed / 360);
		// cube.rotation.y += Math.sin(elapsed / 360);
		// cube.rotation.z += Math.sin(elapsed / 360);
		effectComposer.render();
		orbitControl.update();
	}

	animate();
}

init();
