console.log("helloWorld")
import * as THREE from "three"
console.log(THREE)
import { OrbitControls } from "OrbitControls"
console.log(OrbitControls)
import * as datBoi from "lil-gui"
console.log(datBoi)

/*
   setup
*/

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/*
   scene
*/

// canvas
const canvas = document.querySelector('.webgl')

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// camera
const camera = new THREE.PerspectiveCamera(
    75, // fov
    sizes.aspectRatio, // aspect ratio
    0.1, // near plane
    100 // far plane
)
scene.add(camera)
camera.position.z = 5 // backed up the camera instead of moving focus

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
   meshes
*/

// plane
const planeGeo = new THREE.PlaneGeometry(10, 10, 100, 100)
const planeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeo, planeMat)
plane.rotation.x = Math.PI * 0.5
scene.add(plane)

// testSphere
//const geometry = new THREE.SphereGeometry(1)
//const geometry = new THREE.BoxGeometry(2,3,4)
const geometry = new THREE.DodecahedronGeometry()
const material = new THREE.MeshNormalMaterial()
/* MeshBasicMaterial is shadowless
const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color('Cyan')
})
material.color = new THREE.Color('red')*/
/* MeshStandardMaterial requires lights, otherwise will show as black */
const object = new THREE.Mesh(geometry, material)

scene.add(object)

/*
   ui
*/

// ui
const ui = new datBoi.GUI()

// ui object
const uiObjectPosition = {}
uiObjectPosition.play = false
const uiObjectRotation = {}
uiObjectRotation.play = false

// plane ui
const planeFolder = ui.addFolder('Plane')

planeFolder
    .add(planeMat, 'wireframe')

// object ui
const objectFolder = ui.addFolder('Object')

objectFolder
    .add(object.position, 'y')
    .min(-5)
    .max(5)
    .step(0.1)
    .name('Position Y')
    .listen()

objectFolder
    .add(object.rotation, 'x')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.1)
    .name('Rotation X')
    .listen()

objectFolder
    .add(uiObjectPosition, 'play')
    .name('Animate object position')

objectFolder
    .add(uiObjectRotation, 'play')
    .name('Animate object rotation')

/*
   animation loop
*/
const clock = new THREE.Clock()

// animate
const animation = () => {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // rotate plane
    //plane.rotation.x = Math.PI * elapsedTime * 0.1

    // animate object
    if(uiObjectPosition.play){
        object.position.y = Math.sin(elapsedTime * 0.2) * 2
    }
    if(uiObjectRotation.play){
        object.rotation.x = Math.sin(elapsedTime * 0.2) * Math.PI
    }

    // controls
    controls.update()

    // update renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()