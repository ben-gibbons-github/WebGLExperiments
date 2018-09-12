

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

var starMat = new THREE.SpriteMaterial( {
	map: new THREE.CanvasTexture( generateSprite() ),
	blending: THREE.AdditiveBlending
} );

particles = [];
var particleIndex = 0;
const MAX_PARTICLES = 2000;

var stars = [];

var addStar = function(x, y, z)
{
	var starWrapper = { x: x, y: y, z: z };
	stars.push(starWrapper);
}

for (var i = 0; i < 10; i++)
{
	addStar(50 - Math.random() * 100, 100 * Math.random(), 50 - Math.random() * 100);
}

var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		

	for (var i = 0; i < stars.length; i++)
	{
		var star = stars[i];
		star.y -= deltaTime / 50;
		star.x += deltaTime / 150;
		if (star.y < -50)
		{
			star.y = 50;
			star.x = 50 - 100 * Math.random();
			star.z = 50 - 100 * Math.random();
		}
		addParticle(star.x, star.y, star.z, 32);
		addParticle(star.x + 5 - Math.random() * 10, star.y + 5 - Math.random() * 10, star.z + 5 - Math.random() * 10, 3);
	}

	for (var i = 0; i < particles.length; i++)
		particles[i].scale.y = particles[i].scale.x *= 0.97;

	renderer.render( scene, camera );
	TWEEN.update();

	lastTime = timeNow;
};

function addParticle(x, y, z, size)
{
	var particle;
	if (particles.length < MAX_PARTICLES)
	{
		particle = new THREE.Sprite( starMat );
		particles.push(particle);
		scene.add( particle );
	}
	else
	{
		particle = particles[particleIndex];
		particleIndex++;
		if (particleIndex >= MAX_PARTICLES)
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
