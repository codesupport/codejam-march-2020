import {OrbitControls} from "./three/OrbitControls.js";

if (window.location.host.includes("github")){
	import("./assets/js/_rounded-box.js").then( RoundedBoxModule => {
		init(RoundedBoxModule.RoundedBox);
	});
}else{
	import("./_rounded-box.js").then( RoundedBoxModule => {
		init(RoundedBoxModule.RoundedBox);
	});
}


function init(RoundedBox){
	const scene = new THREE.Scene;
	const container = document.querySelector("#render-window");
	const camera = new THREE.PerspectiveCamera(55, container.clientWidth/container.clientHeight, 0.1, 30000);
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	const renderer = new THREE.WebGLRenderer();

	camera.position.set(0,10,-100); // Must be non 0,0,0 for controls to work

	renderer.setSize( container.clientWidth, container.clientHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.gammaFactor = 2.2;
	renderer.physicallyCorrectLights = true;
	renderer.setSize(container.clientWidth, container.clientHeight);

	const controls = new OrbitControls(camera, renderer.domElement);
	camera.lookAt(0,10,50);
	controls.target.set(0,10,50);
	controls.maxDistance = 1000;

	// Load textures and add them to an array of mesh materials
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

	// Create skybox geometry and the mesh itself with applied geometry and materials
	const skyboxGeometry = new THREE.BoxGeometry(10000,10000,10000);
	const skybox = new THREE.Mesh(skyboxGeometry, materialArray);

	const dotGeometry = new THREE.Geometry();
	const roundedBox = new RoundedBox(200, 65, 5, 2, 1);
	const roundedBoxMaterial = new THREE.MeshLambertMaterial({
		color:new THREE.Color("rgb(20,87,179)")
	});
	const dotMaterial = new THREE.PointsMaterial({size:1, sizeAttenuation:false});
	const dots = new THREE.Points(dotGeometry, dotMaterial);

	// Create a ton of "star" dots
	for(let i = 0; i < 1900; i++){
		dotGeometry.vertices.push(new THREE.Vector3(getRandomNumber(-1000, 1000),  getRandomNumber(-700, 700), getRandomNumber(-1000, 1000)));
	}

	const codeSupportBox = new THREE.Mesh(roundedBox.geometry, roundedBoxMaterial);
	codeSupportBox.position.set(0,10,50);

	// Add items to scene
	scene.add(dots);
	scene.add(ambientLight);
	scene.add(skybox);
	scene.add(codeSupportBox);

	// Add lights
	const directionalLight = new THREE.DirectionalLight(new THREE.Color("rgb(50,50,50)"), 5);
	directionalLight.position.set(0,100,-50);
	directionalLight.target = codeSupportBox;
	scene.add(directionalLight);

	// Add the text
	const fontLoader = new THREE.FontLoader();
	fontLoader.load("./assets/fonts/helvetiker_bold.typeface.json", (font) => {
		const textGeometry = new THREE.TextGeometry("CodeSupport", {
			font:font,
			size:"20",
			height:"1",
			curveSegments:4,
			bevelThickness:1,
			bevelSize:1,
			bevelEnabled:true
		});

		const textMesh = new THREE.Mesh(textGeometry, [
			new THREE.MeshPhongMaterial( { color: new THREE.Color("rgb(100,100,100)")} ), // front
			new THREE.MeshPhongMaterial( { color: new THREE.Color("rgb(100,100,100)")} ) // side
		]);

		textMesh.rotation.set(0,Math.PI,0);
		textMesh.position.set(87, 0, 51)

		scene.add(textMesh);
	});

	// Add the canvas
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
}
