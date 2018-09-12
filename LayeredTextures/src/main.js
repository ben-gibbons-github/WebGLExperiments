
// set up renderer
var renderer;
var mouseX = 0, mouseY = 0;
var targetX = 0, targetY = 0;
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - window.innerWidth / 2;
	mouseY = event.clientY - window.innerHeight / 2;
}
function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}
function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
	}
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'touchstart', onDocumentTouchStart, false );
document.addEventListener( 'touchmove', onDocumentTouchMove, false );

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

camera.position.set( 0, 0, 300 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var loader = new THREE.TextureLoader();
var texture1 = loader.load( "tex/forest1.png" );
var texture2 = loader.load( "tex/forest2.png" );
var texture25 = loader.load( "tex/forest25.png" );
var texture3 = loader.load( "tex/forest3.png" );

var geometry = new THREE.PlaneGeometry( 1366 / 4, 768 / 4 );

var planes = [];

{
	var material = new THREE.MeshBasicMaterial( {map: texture3, side: THREE.DoubleSide} );
	material.depthWrite = false;
	material.transparent = true;
	var plane = new THREE.Mesh( geometry, material );
	plane.position.z = -3;

	scene.add( plane );
	planes.push(plane);
}
{
	var material = new THREE.MeshBasicMaterial( {map: texture25, side: THREE.DoubleSide} );
	material.depthWrite = false;
	material.transparent = true;
	var plane = new THREE.Mesh( geometry, material );
	plane.position.z = -2;
	scene.add( plane );
	planes.push(plane);
}
{
	var material = new THREE.MeshBasicMaterial( {map: texture2, side: THREE.DoubleSide} );
	material.depthWrite = false;
	material.transparent = true;
	var plane = new THREE.Mesh( geometry, material );
	plane.position.z = -1;
	scene.add( plane );
	planes.push(plane);
}
{
	var material = new THREE.MeshBasicMaterial( {map: texture1, side: THREE.DoubleSide} );
	material.depthWrite = false;
	material.transparent = true;
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	planes.push(plane);
}

var animate = function () {
	requestAnimationFrame( animate );

	targetX = targetX + (mouseX - targetX) * 0.01;
	targetY = targetY + (mouseY - targetY) * 0.01;

	for (var i = 0; i < planes.length; i++)
	{
		var plane = planes[i];
		plane.position.x = targetX * i / 10;
		plane.position.y = -targetY * i / 10;
	}

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		

	renderer.render( scene, camera );
	TWEEN.update();

	lastTime = timeNow;
};

animate();
