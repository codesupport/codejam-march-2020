import {OrbitControls} from "./three/OrbitControls.js";

(() => {
	const scene = new THREE.Scene;
	const container = document.querySelector("#render-window");
	const camera = new THREE.PerspectiveCamera(55, container.clientWidth/container.clientHeight, 0.1, 30000);
	const ambientLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 7 );
	const renderer = new THREE.WebGLRenderer();

	camera.position.set(-5, 5, 7); // Must be non 0,0,0 for controls to work
	renderer.setSize( container.clientWidth, container.clientHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.gammaFactor = 2.2;
	renderer.physicallyCorrectLights = true;
	renderer.setSize(container.clientWidth, container.clientHeight);

	//scene.background = new THREE.Color( 0x200e2b );
	//scene.fog = new THREE.Fog(0x200e2b, 2000, 2500);
	//this.ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
	//this.directionalLight = new THREE.DirectionalLight(0xffffff, 5);
	//this.directionalLight.position.set(10,10,10);
	//this.scene.add(this.ambientLight, this.directionalLight);


	const controls = new OrbitControls(camera, renderer.domElement);



	const textureLoader = new THREE.TextureLoader();
	const materialArray = [
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-front.png"),
			side:THREE.BackSide
		}),
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-back.png"),
			side:THREE.BackSide
		}),
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-up.png"),
			side:THREE.BackSide
		}),
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-down.png"),
			side:THREE.BackSide
		}),
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-right.png"),
			side:THREE.BackSide
		}),
		new THREE.MeshBasicMaterial({
			map:textureLoader.load("./assets/images/mt-left.png"),
			side:THREE.BackSide
		})
	];

	const skyboxGeometry = new THREE.BoxGeometry(10000,10000,10000);
	const skybox = new THREE.Mesh(skyboxGeometry, materialArray);

	const dotGeometry = new THREE.Geometry();
	const dotMaterial = new THREE.PointsMaterial({size:1, sizeAttenuation:false});

	for(let i = 0; i < 1900; i++){
		dotGeometry.vertices.push(new THREE.Vector3(getRandomNumber(-1000, 1000),  getRandomNumber(-700, 700), getRandomNumber(-1000, 1000)));
	}

	const dots = new THREE.Points(dotGeometry, dotMaterial);

	scene.add(dots);
	scene.add(ambientLight);
	scene.add(skybox);
	
	container.appendChild(renderer.domElement);

	function getRandomNumber(min, max){
		return Math.random() * (max-min) + min;
	}

	window.addEventListener("resize", () => {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( container.clientWidth, container.clientHeight );
	});

	renderer.setAnimationLoop( () => {
		renderer.render(scene, camera);
		// requestAnimationFrame(renderer);
	});
})();
