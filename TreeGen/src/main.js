var renderer = new THREE.WebGLRenderer();
var lastTime = new Date().getTime();
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 100, 300, 300 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

var light = new THREE.PointLight( 0xffffff, 1, 1000 );
light.castShadow = true;            // default false
light.position.set( 50, 150, 50 );

scene.add( light );

var blobs = [];

var addBlob = function(x, y, z, radius, offsetTime, color)
{
	var geometry = new THREE.SphereGeometry( 1, 6, 6 );
	var mat = new THREE.MeshToonMaterial( {
		color: color,
		wireframe: false,
	} );

	var sphere = new THREE.Mesh( geometry, mat );

	sphere.position.x = x;
	sphere.position.y = y;
	sphere.position.z = z;

	sphere.castShadow = true;
	sphere.receiveShadow = true;

	var duration = 400;
	var startTime = lastTime + offsetTime;
	var spherWrapper = { radius: radius, startTime: startTime, mesh: sphere, duration: duration };
	blobs.push(spherWrapper);

	scene.add( sphere );
}

var addBranch = function(x, y, z, radius, time, thresh, isEndBranch, rotation, zRotation)
{
	rotation = rotation + (Math.random() - 0.5) * Math.PI * (thresh + 0.04);
	zRotation = zRotation + (Math.random() - 0.5) * Math.PI * (thresh + 0.04);

	var segments = 1 + Math.random() * 4;
	var speed = radius * 2;
	if (radius < 1)
		speed *= 1.25;

	for (var i = 0; i < segments; i++)
	{
		var dx = Math.cos(rotation) * Math.cos(zRotation) * speed;
		var dy = Math.sin(zRotation) * speed;
		var dz = Math.sin(rotation) * Math.cos(zRotation) * speed;

		x += dx;
		y += dy;
		z += dz;

		if (radius < 1)
		{
			if (i == 0)
				addBlob(x, y, z, radius * 16, time, 0x009619);
		}
		else
			addBlob(x, y, z, radius * 2, time, 0x7a6802);

		if (radius < 1)
			radius *= 0.96;
		else
			radius *= 0.97;

		time += 20;
	}

	if (!isEndBranch)
	{
		addBranch(x, y, z, radius, time, thresh + 0.05, radius < 0.4, rotation, zRotation);
		if (Math.random() > 0.75)
			addBranch(x, y, z, radius, time, thresh + 0.05, radius < 0.4, Math.PI * 2 * Math.random(), Math.PI * (Math.random() * 0.2 + 0.4));
	}

	return time;
}

var MAX = 10;
for (var i = 1; i < MAX; i++)
{
	addBranch((i - MAX / 2) * 40, 0, (i - MAX / 2) * -40, 2, i * 300 + 1000, 0, false, 0, Math.PI / 2);
	if (Math.random() > 0.75)
		addBranch((i - MAX / 2) * 40, 0, (i - MAX / 2) * -40, 2, i * 300 + 1000, 0, false, Math.PI * 2 * Math.random(), Math.PI / 4);
}


var animate = function () {
	requestAnimationFrame( animate );

	var timeNow = new Date().getTime();
	var deltaTime = timeNow - lastTime;
	if (deltaTime > 60)
		deltaTime = 60;
		
	for (var i = 0; i < blobs.length; i++)
	{
		var blob = blobs[i];
		var radius = 0.01;

		if (timeNow > blob.startTime)
		{
			if (timeNow > blob.startTime + blob.duration)
				radius = blob.radius;
			else
			{
				var mult = (timeNow - blob.startTime) / blob.duration;
				radius = blob.radius * mult;
			}
		}

		blob.mesh.scale.x = radius;
		blob.mesh.scale.y = radius;
		blob.mesh.scale.z = radius;
	}

	renderer.render( scene, camera );
	lastTime = timeNow;
};


animate();
