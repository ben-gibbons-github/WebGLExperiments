var renderer = new THREE.WebGLRenderer();
var lastTime = new Date().getTime();

// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 100, 150, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var cubes = [];


var addCube = function(x, y, z, xSize, ySize, zSize)
{
	var geometry = new THREE.BoxGeometry( xSize, ySize, zSize );
	var mat = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		wireframe: false,
	} );

	var cube = new THREE.Mesh( geometry, mat );

	var newX = x + 10 - 20 * Math.random();
	var newY = - 40 - 20 * Math.random();
	var newZ = z + 10 - 20 * Math.random();

	var mult = 0.8;
	var startTime = lastTime + (x * 10 + y * 10 + z * 10 + 10000 * Math.random() + 6000) * mult;
	var duration = 1000 * mult;

	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;

	var cubeWrapper = { x: x, y: y, z: z, newX: newX, newY: newY,
	 newZ: newZ, 
	 xSize: xSize, ySize: ySize, zSize: zSize, startTime: startTime, mesh: cube, duration: duration };
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

	for (var i = 0; i < 20; i += 4)
	{
		var mat = new THREE.SpriteMaterial( {
			map: new THREE.CanvasTexture( generateSprite(10 + 20 * Math.random() * Math.sin(x / 1000), 10 + 20 * Math.random(), 5 + 20 * Math.random()) ),
			blending: THREE.AdditiveBlending
		} );

		var particle = new THREE.Sprite( mat );
		particle.scale.x = particle.scale.y = 60;
		particle.position.set(x, i - 50, z);
		scene.add(particle);

		new TWEEN.Tween( particle.position )
			.delay( 0 )
			.to( { x: x, y: Math.random() * 100, z: z }, 10000 * (1 + Math.random()) )
			.start();
	}

}

var rgbToHex = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

var fullColorHex = function(r,g,b) {   
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red+green+blue;
};

addCube(0, 0, 0, 1000, 1, 1000);

var lights = [];

for (var x = -200; x < 200; x += 20)
	for (var y = -200; y < 200; y += 20)
	{
		if (x % 100 == 0 && y % 100 == 0 && false)
		{
			var r = Math.random();
			var g = Math.random();
			var b = Math.random();
			var light = new THREE.PointLight( new THREE.Color(r * 2, g * 2, b * 2), 1, 40 );
			light.castShadow = true;            // default false

			var starMat = new THREE.SpriteMaterial( {
				map: new THREE.CanvasTexture( generateSprite(r * 255, g * 255, b * 255) ),
				blending: THREE.AdditiveBlending
			} );
			var  particle = new THREE.Sprite( starMat );
			particle.scale.x = particle.scale.y = 64;

			light.mat = starMat;
			light.position.x = x;
			light.position.y = 0;
			light.position.z = y;

			new TWEEN.Tween( light.position )
				.delay( 0 )
				.to( { x: Math.random() * 400 - 200, y: Math.random() * 200, z: Math.random() * 400 - 200 }, 10000 * (1 + Math.random()) )
				.start();

			scene.add(particle);
			lights.push(light);
			scene.add(light);
		}

		addBuilding(x, 0, y, 18, 18, 10 * Math.random(), 10 * Math.random() + 5);
	}

var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		
	for (var i = 0; i < lights.length; i++)
	{
		if (Math.random() > 0.5)
		{
			var light = lights[i];
			var particle = new THREE.Sprite( light.mat );
			particle.scale.x = particle.scale.y = 16;
			particle.position.set(light.position.x, light.position.y, light.position.z);
			scene.add(particle);
			new TWEEN.Tween( particle.scale )
					.delay( 0 )
					.to( { x: 0.01, y: 0.01 }, 3000 )
					.start();
		}
	}

	TWEEN.update();


	renderer.render( scene, camera );
	lastTime = timeNow;
};


var lights = 0;
function showBuildingLights()
{
	var cube = cubes[Math.floor(Math.random() * cubes.length)];

	var geometry = new THREE.BoxGeometry( cube.xSize * 0.25, cube.ySize * 0.6, cube.zSize * 1.01 );
	var mat = new THREE.MeshBasicMaterial( {
		color: 0xffffff,
		wireframe: false,
	} );

	var mesh = new THREE.Mesh( geometry, mat );
	mesh.position.set(cube.x, cube.y, cube.z);

	scene.add(mesh);

	if (lights++ < 100)
		setTimeout(showBuildingLights, 10);
}

setTimeout(showBuildingLights, 10);

function generateSprite(r, g, b) {
	var canvas = document.createElement( 'canvas' );
	canvas.width = 64;
	canvas.height = 64;
	var context = canvas.getContext( '2d' );
	var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
	gradient.addColorStop( 0, 'rgba('+r+','+g+','+b+',1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );
	return canvas;
}


animate();
