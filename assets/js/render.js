import {OrbitControls} from "./three/OrbitControls.js";

(() => {
	const scene = new THREE.Scene;

	const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);
	camera.position.set(0,0,0);

	const renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.addEventListener("change", renderer);
})();
