var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, -200, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();



var MAX_Y = 200;
var MAX_X = 200;
var MAX_POINTS = MAX_X * MAX_Y * 4;

// geometry
var geometry = new THREE.BufferGeometry();

// attributes
var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

// material
var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
var line = new THREE.Line( geometry, material );
line.geometry.setDrawRange( 0, MAX_POINTS );

scene.add( line );

renderer.render( scene, camera );



var lastTime = new Date().getTime();



var addPosition = function(x, y, z, Size, positions, index, timeNow)
{
    positions[ index ++ ] = (x - MAX_X / 2) * Size;
    positions[ index ++ ] = (y - MAX_Y / 2) * Size;
    positions[ index ++ ] = (Math.sin(timeNow / 5000 + x / 20) + Math.sin(timeNow / 15000 + y / 10)) * 50;
    return index;
}

var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
	

	var positions = line.geometry.attributes.position.array;

	var z = 0;
	var index = 0;
	var Size = 4;

	for ( var x = 0; x < MAX_X; x++ ) {
		for ( var y = 0; y < MAX_Y; y ++ ) {

			index = addPosition(x - 0.5, y - 0.5, z, Size, positions, index, timeNow);
			index = addPosition(x + 0.5, y - 0.5, z, Size, positions, index, timeNow);
			index = addPosition(x + 0.5, y + 0.5, z, Size, positions, index, timeNow);
			index = addPosition(x - 0.5, y + 0.5, z, Size, positions, index, timeNow);
		}
	}

	line.geometry.attributes.position.needsUpdate = true; // required after the first render

	renderer.render( scene, camera );
	lastTime = timeNow;
};


animate();
