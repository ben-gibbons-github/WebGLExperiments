var renderer = new THREE.WebGLRenderer();
var lastTime = new Date().getTime();
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 100, 100, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

var light = new THREE.PointLight( 0xffffff, 1, 1000 );
light.castShadow = true;            // default false
light.position.set( 50, 150, 50 );

scene.add( light );

var cubes = [];

var addCube = function(x, y, z, xSize, ySize, zSize)
{
	var geometry = new THREE.BoxGeometry( xSize, ySize, zSize );
	var mat = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		wireframe: false,
	} );

	var cube = new THREE.Mesh( geometry, mat );


	cube.castShadow = true;
	cube.receiveShadow = true;

	var newX = x + 10 - 20 * Math.random();
	var newY = - 40 - 20 * Math.random();
	var newZ = z + 10 - 20 * Math.random();

	var mult = 0.8;
	var startTime = lastTime + (x * 10 + y * 10 + z * 10 + 10000 * Math.random() + 6000) * mult;
	var duration = 1000 * mult;

	cube.position.x = newX;
	cube.position.y = newY;
	cube.position.z = newZ;

	var cubeWrapper = { x: x, y: y, z: z, newX: newX, newY: newY, newZ: newZ, startTime: startTime, mesh: cube, duration: duration };
	cubes.push(cubeWrapper);

	scene.add( cube );
}


var addBuilding = function(x, y, z, xSize, zSize, stories, storyHeight)
{
	for (var i = 0; i < stories; i++)
	{
		addCube(x, y, z, xSize, storyHeight, zSize);

		if (Math.random() > 0.8)
			xSize *= (Math.random() + Math.random()) / 2;

		if (Math.random() > 0.8)
			zSize *= (Math.random() + Math.random()) / 2;

		if (Math.random() > 0.8)
			storyHeight *= (Math.random() + Math.random()) / 2;

		y += storyHeight;
	}
}

addCube(0, 0, 0, 1000, 1, 1000);
for (var x = -200; x < 200; x += 20)
	for (var y = -200; y < 200; y += 20)
		addBuilding(x, 0, y, 18, 18, 10 * Math.random(), 10 * Math.random() + 5);

var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		

	for (var i = 0; i < cubes.length; i++)
	{
		var cube = cubes[i];
		var x = cube.newX;
		var y = cube.newY;
		var z = cube.newZ;

		if (timeNow > cube.startTime)
		{
			if (timeNow > cube.startTime + cube.duration)
			{
				x = cube.x;
				y = cube.y;
				z = cube.z;
			}
			else
			{
				var lerp = (timeNow - cube.startTime) / cube.duration;

				x = cube.newX + (cube.x - cube.newX) * lerp;
				y = cube.newY + (cube.y - cube.newY) * lerp;
				z = cube.newZ + (cube.z - cube.newZ) * lerp;
			}
		}

		cube.mesh.position.x = x;
		cube.mesh.position.y = y;
		cube.mesh.position.z = z;
	}



	renderer.render( scene, camera );
	lastTime = timeNow;
};


animate();
