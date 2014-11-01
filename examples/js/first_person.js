var renderer, camera;
var scene, element;
var ambient, point;
var aspectRatio, windowHalf;
var mouse, time;

var controls;
var clock;

var useRift = false;

var riftCam;

var boxes = [];
var core = [];
var dataPackets = [];

var ground, groundGeometry, groundMaterial;

var bodyAngle;
var bodyAxis;
var bodyPosition;
var viewAngle;

var velocity;
var oculusBridge;

// Map for key states
var keys = [];
for(var i = 0; i < 130; i++){
  keys.push(false);
}


function initScene() {
  clock = new THREE.Clock();
  mouse = new THREE.Vector2(0, 0);

  windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
  aspectRatio = window.innerWidth / window.innerHeight;
  
  scene = new THREE.Scene();  

  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000);
  camera.useQuaternion = true;

  camera.position.set(100, 150, 100);
  camera.lookAt(scene.position);

  // Initialize the renderer
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0xE0E0FF);
  renderer.setSize(window.innerWidth, window.innerHeight);

   scene.fog = new THREE.Fog(0xA3C2FF, 300, 700);

  element = document.getElementById('viewport');
  element.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
}


function initLights(){

  hemisphere = new THREE.HemisphereLight(0x222222);
  scene.add(hemisphere);

  point = new THREE.DirectionalLight( 0xffffff, 1, 0, Math.PI, 1 );
  point.position.set( -250, 250, 150 );
  
  scene.add(point);
}

var floorTexture;
function initGeometry(){

  floorTexture = new THREE.ImageUtils.loadTexture( "textures/grass.jpg" );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
  floorTexture.repeat.set( 50, 50 );
  floorTexture.anisotropy = 32;

  var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, transparent:true, opacity:1.0 } );
  var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;

  scene.add(floor);

  // add some boxes.
  var boxTexture = new THREE.ImageUtils.loadTexture( "textures/b1.jpg" );
  var material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});
  
  var height = 2 * 100+10;
  var width = 4*0.4 * 20 + 2;
  var box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);
  box.position.set(0.1 * 1000 - 500, 0.3/2 ,0.2 * 1000 - 500);
  box.rotation.set(0, 0.3 * Math.PI * 2, 0);
  boxes.push(box);
  scene.add(box);
  
  boxTexture = new THREE.ImageUtils.loadTexture( "textures/b2.jpg" );
  material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});
  height = 4 * 100+10;
  width = 5*0.4 * 20 + 2; 
  box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);
  box.position.set(0.5 * 1000 - 500, (0.4)/2 ,0.2 * 1000 - 500);
  box.rotation.set(0, 0.2 * Math.PI * 2, 0);
  boxes.push(box);
  scene.add(box);
  
  boxTexture = new THREE.ImageUtils.loadTexture( "textures/b3.jpg" );
  material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});
  height = 3.5 * 100+10;
  width = 5*0.6 * 20 + 2; 
  box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);
  box.position.set(0.1 * 1000 - 500, (0.6)/2 ,0.7 * 1000 - 500);
  box.rotation.set(0, 0.2 * Math.PI * 2, 0);
  boxes.push(box);
  scene.add(box);
  
  boxTexture = new THREE.ImageUtils.loadTexture( "textures/b1.jpg" );
  material = new THREE.MeshLambertMaterial({ emissive:0x505050, map: boxTexture, color: 0xffffff});
  height = 0.5 * 10+10;
  width = 2; 
  box = new THREE.Mesh( new THREE.CubeGeometry(width, height, width), material);
  box.position.set(1 * 1000 - 500, 0.2/2 ,0.5 * 1000 - 500);
  box.rotation.set(0, 0.2 * Math.PI * 2, 0);
  boxes.push(box);
  scene.add(box);
  
  
  //Adding evidences
  var geometry   = new THREE.SphereGeometry(4,10,10);
  var material1  = new THREE.MeshPhongMaterial();
  material1.map = THREE.ImageUtils.loadTexture("textures/evidence1.jpg");
  var evidenceMesh1 = new THREE.Mesh(geometry, material1);
  evidenceMesh1.position.set(0.6 * 1000 - 500, -0.1 * 960 + 100 ,0.6 * 1000 - 500);
  scene.add(evidenceMesh1);
  
  evidenceTexture2 = new THREE.ImageUtils.loadTexture( "textures/evidence2.jpg" );
  var material2 = new THREE.MeshLambertMaterial({map: evidenceTexture2});
  box = new THREE.Mesh( new THREE.CubeGeometry(3, 0.5 * 10+5, 8), material2);
  box.position.set(0.54 * 1000 - 500, 0.2/2 ,0.56 * 1000 - 500);
  box.rotation.set(0, 0.2 * Math.PI * 2, 0);
  boxes.push(box);
  scene.add(box);
  

 
  
    var material = new THREE.MeshLambertMaterial({ emissive:0x008000, color: 0xFFFF00});
    var size = 0.5 * 15+3;
    var tape1 = new THREE.Mesh( new THREE.CubeGeometry(size*15, size*0.2, size*0.01), material);
    tape1.position.set(0.6 * 1000 - 500, -0.1 * 800 + 100 ,0.5 * 1000 - 500);
    //box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    scene.add(tape1);
    
    var tape2 = new THREE.Mesh( new THREE.CubeGeometry(size*15, size*0.2, size*0.01), material);
    tape2.position.set(0.52 * 1000 - 500, -0.1 * 800 + 100 ,0.579 * 1000 - 500);
    tape2.rotation.y = Math.PI/2;
    scene.add(tape2);
    
    var tape3 = new THREE.Mesh( new THREE.CubeGeometry(size*15, size*0.2, size*0.01), material);
    tape3.position.set(0.6 * 1000 - 500, -0.1 * 800 + 100 ,0.656 * 1000 - 500);
    //box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    scene.add(tape3);
    
    var tape4 = new THREE.Mesh( new THREE.CubeGeometry(size*15, size*0.2, size*0.01), material);
    tape4.position.set(0.68 * 1000 - 500, -0.1 * 800 + 100 ,0.579 * 1000 - 500);
    tape4.rotation.y = Math.PI/2;
    scene.add(tape4);
    
   
  }



function init(){

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);

  document.getElementById("toggle-render").addEventListener("click", function(){
    useRift = !useRift;
    onResize();
  });

  document.getElementById("help").addEventListener("click", function(){
    var el = document.getElementById("help-text");
    el.style.display = (el.style.display == "none") ? "" : "none";
  });

  window.addEventListener('resize', onResize, false);

  time          = Date.now();
  bodyAngle     = 0;
  bodyAxis      = new THREE.Vector3(0, 1, 0);
  bodyPosition  = new THREE.Vector3(0, 15, 0);
  velocity      = new THREE.Vector3();

  initScene();
  initGeometry();
  initLights();
  
  oculusBridge = new OculusBridge({
    "debug" : true,
    "onOrientationUpdate" : bridgeOrientationUpdated,
    "onConfigUpdate"      : bridgeConfigUpdated,
    "onConnect"           : bridgeConnected,
    "onDisconnect"        : bridgeDisconnected
  });
  oculusBridge.connect();

  riftCam = new THREE.OculusRiftEffect(renderer);
}


function onResize() {
  if(!useRift){
    windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    aspectRatio = window.innerWidth / window.innerHeight;
   
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
   
    renderer.setSize(window.innerWidth, window.innerHeight);
  } else {
    riftCam.setSize(window.innerWidth, window.innerHeight);
  }
}


function bridgeConnected(){
  document.getElementById("logo").className = "";
}

function bridgeDisconnected(){
  document.getElementById("logo").className = "offline";
}

function bridgeConfigUpdated(config){
  console.log("Oculus config updated.");
  riftCam.setHMD(config);      
}

function bridgeOrientationUpdated(quatValues) {

  // Do first-person style controls (like the Tuscany demo) using the rift and keyboard.

  // TODO: Don't instantiate new objects in here, these should be re-used to avoid garbage collection.

  // make a quaternion for the the body angle rotated about the Y axis.
  var quat = new THREE.Quaternion();
  quat.setFromAxisAngle(bodyAxis, bodyAngle);

  // make a quaternion for the current orientation of the Rift
  var quatCam = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

  // multiply the body rotation by the Rift rotation.
  quat.multiply(quatCam);


  // Make a vector pointing along the Z axis and rotate it accoring to the combined look/body angle.
  var xzVector = new THREE.Vector3(0, 0, 1);
  xzVector.applyQuaternion(quat);

  // Compute the X/Z angle based on the combined look/body angle.  This will be used for FPS style movement controls
  // so you can steer with a combination of the keyboard and by moving your head.
  viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

  // Apply the combined look/body angle to the camera.
  camera.quaternion.copy(quat);
}


function onMouseMove(event) {
  mouse.set( (event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
}


function onMouseDown(event) {
  // Stub
  floorTexture.needsUpdate = true;
  console.log("update.");
}


function onKeyDown(event) {

  if(event.keyCode == 48){ // zero key.
    useRift = !useRift;
    onResize();
  }

  // prevent repeat keystrokes.
  if(!keys[32] && (event.keyCode == 32)){ // Spacebar to jump
    velocity.y += 1.9;
  }

  keys[event.keyCode] = true;
}


function onKeyUp(event) {
  keys[event.keyCode] = false;
}


function updateInput(delta) {
  
  var step        = 25 * delta;
  var turn_speed  = (55 * delta) * Math.PI / 180;


  // Forward/backward

  if(keys[87] || keys[38]){ // W or UP
      bodyPosition.x += Math.cos(viewAngle) * step;
      bodyPosition.z += Math.sin(viewAngle) * step;
  }

  if(keys[83] || keys[40]){ // S or DOWN
      bodyPosition.x -= Math.cos(viewAngle) * step;
      bodyPosition.z -= Math.sin(viewAngle) * step;
  }

  // Turn

  if(keys[81]){ // E
      bodyAngle += turn_speed;
  }   
  
  if(keys[69]){ // Q
       bodyAngle -= turn_speed;
  }

  // Straif

  if(keys[65] || keys[37]){ // A or LEFT
      bodyPosition.x -= Math.cos(viewAngle + Math.PI/2) * step;
      bodyPosition.z -= Math.sin(viewAngle + Math.PI/2) * step;
  }   
  
  if(keys[68] || keys[39]){ // D or RIGHT
      bodyPosition.x += Math.cos(viewAngle+Math.PI/2) * step;
      bodyPosition.z += Math.sin(viewAngle+Math.PI/2) * step;
  }
  

  // VERY simple gravity/ground plane physics for jumping.
  
  velocity.y -= 0.15;
  
  bodyPosition.y += velocity.y;
  
  if(bodyPosition.y < 15){
    velocity.y *= -0.12;
    bodyPosition.y = 15;
  }

  // update the camera position when rendering to the oculus rift.
  if(useRift) {
    camera.position.set(bodyPosition.x, bodyPosition.y, bodyPosition.z);
  }
}


function animate() {
  var delta = clock.getDelta();
  time += delta;
  
  updateInput(delta);
  for(var i = 0; i < core.length; i++){
    core[i].rotation.x += delta * 0.25;
    core[i].rotation.y -= delta * 0.33;
    core[i].rotation.z += delta * 0.1278;
  }

  var bounds = 600;
  for(var i = 0; i < dataPackets.length; i++){
    dataPackets[i].obj.position.add( dataPackets[i].speed);
    if(dataPackets[i].obj.position.x < -bounds) {
      dataPackets[i].obj.position.x = bounds;
    } else if(dataPackets[i].obj.position.x > bounds){
      dataPackets[i].obj.position.x = -bounds;
    }
    if(dataPackets[i].obj.position.z < -bounds) {
      dataPackets[i].obj.position.z = bounds;
    } else if(dataPackets[i].obj.position.z > bounds){
      dataPackets[i].obj.position.z = -bounds;
    }
  }

  
  if(render()){
    requestAnimationFrame(animate);  
  }
}

function crashSecurity(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("security_error").style.display = "block";
}

function crashOther(e){
  oculusBridge.disconnect();
  document.getElementById("viewport").style.display = "none";
  document.getElementById("generic_error").style.display = "block";
  document.getElementById("exception_message").innerHTML = e.message;
}

function render() { 
  try{
    if(useRift){
      riftCam.render(scene, camera);
    }else{
      controls.update();
      renderer.render(scene, camera);
    }  
  } catch(e){
    console.log(e);
    if(e.name == "SecurityError"){
      crashSecurity(e);
    } else {
      crashOther(e);
    }
    return false;
  }
  return true;
}


window.onload = function() {
  init();
  animate();
}