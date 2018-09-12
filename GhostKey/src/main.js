

var renderer;

canvas = document.getElementById("webGlCanvas");
if (canvas)
{
	canvas.width  = window.innerWidth - 225;
	renderer = new THREE.WebGLRenderer({canvas: canvas});
}
else
{
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
var lastTime = new Date().getTime();
var startTime = lastTime;

// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

document.body.appendChild( renderer.domElement );



var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );

if (canvas)
{
	camera.aspect = canvas.width / canvas.height;
	camera.updateProjectionMatrix();
}

camera.position.set( 100, 100, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight( 0x4286f4 ); // soft white light
scene.add( ambientLight );

var light = new THREE.PointLight( 0x9bc1ff, 1, 1000 ); // soft white light
scene.add( light );

var starMat = new THREE.SpriteMaterial( {
	map: new THREE.CanvasTexture( generateSprite() ),
	blending: THREE.AdditiveBlending
} );

var starMat2 = new THREE.SpriteMaterial( {
	map: new THREE.CanvasTexture( generateSprite2() ),
	blending: THREE.AdditiveBlending
} );

particles = [];
var particleIndex = 0;



var cubes = [];

var addCube = function(mult, r, z, xSize, ySize, zSize, wireFrame, addToList)
{
	var geometry = new THREE.BoxGeometry( xSize, ySize, zSize );
	var mat = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		wireframe: wireFrame,
	} );
	mat.blending = THREE.AdditiveBlending;

	var mesh = new THREE.Mesh( geometry, mat );

	var cubeWrapper = { mult: mult, r: r, z: z, mesh: mesh };
	if (addToList)
		cubes.push(cubeWrapper);

	scene.add( mesh );
}

for (var i = 0; i < 50; i++)
{
	var distance = Math.random() * 100 + 30;
	addCube(Math.random() * 1.5 + 0.5, distance, 10 - 20 * Math.random(), Math.random() * 20, Math.random() * 20, Math.random() * 40, Math.random() > 0.4, true);
}

addCube(Math.random() * 1.5 + 0.5, 0, 20, 20, 20, 20, true, true);
addCube(Math.random() * 1.5 + 0.5, 0, 20, 20, 20, 20, false, true);

var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		

	for (var i = 0; i < cubes.length; i++)
	{
		{
			var cube = cubes[i];

			var rot = (cube.mult * timeNow * 0.001);
			var r = cube.r * Math.min(10, (timeNow - startTime) / 10000)
			var x = Math.cos(rot) * r;
			var y = 0;
			var z = Math.sin(rot) * r;

			cube.mesh.rotation.y = -rot;
			cube.mesh.position.x = x;
			cube.mesh.position.y = y;
			cube.mesh.position.z = z;

			if (i % 2 == 0)
				addParticle(x, y, z, 32);
		}
	}

	for (var i = 0; i < particles.length; i++)
		particles[i].scale.y = particles[i].scale.x *= 0.96;

	particle = new THREE.Sprite( starMat2 );
	var rot = Math.random() * Math.PI * 2;
	var r = 100 * Math.random() * Math.min(10, (timeNow - startTime) / 10000);
	particle.position.set(r * Math.cos(rot), 0, r * Math.sin(rot));
	particle.scale.x = particle.scale.y = 16 * Math.random() * Math.random();
	scene.add( particle );

	new TWEEN.Tween( particle.position )
		.delay( 0 )
		.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 100000 * (1 + Math.random()) )
		.start();

	if (timeNow < startTime + 50000)
		addParticle(0, 0, 0, 32 * Math.random() + 32);

	renderer.render( scene, camera );
	TWEEN.update();

	lastTime = timeNow;
};

function addParticle(x, y, z, size)
{
	var particle;
	if (particles.length < 1000)
	{
		particle = new THREE.Sprite( starMat );
		particles.push(particle);
		scene.add( particle );
	}
	else
	{
		particle = particles[particleIndex];
		particleIndex++;
		if (particleIndex >= 1000)
			particleIndex = 0;
	}

	particle.position.set(x, y, z);
	particle.scale.x = particle.scale.y = size;


}

function generateSprite() {
	var canvas = document.createElement( 'canvas' );
	canvas.width = 64;
	canvas.height = 64;
	var context = canvas.getContext( '2d' );
	var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
	gradient.addColorStop( 0, 'rgba(64,100,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(0,32,32,1)' );
	gradient.addColorStop( 0.4, 'rgba(0,0,16,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );
	return canvas;
}


function generateSprite2() {
	var canvas = document.createElement( 'canvas' );
	canvas.width = 64;
	canvas.height = 64;
	var context = canvas.getContext( '2d' );
	var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
	gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
	gradient.addColorStop( 0.2, 'rgba(0,32,128,1)' );
	gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
	gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
	context.fillStyle = gradient;
	context.fillRect( 0, 0, canvas.width, canvas.height );
	return canvas;
}

animate();
