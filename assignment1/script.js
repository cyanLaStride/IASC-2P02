import * as THREE from "three"
console.log(THREE)
import { OrbitControls } from "OrbitControls"
console.log(OrbitControls)
import * as datBoi from "lil-gui"
console.log(datBoi)

/**
 * setup
 */

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// mobile specs
const mob = {
    x: 0,
    y: 0,
    z : 8,
    speed: 0.5,
    offset1: Math.PI * 0/3 - 0.5,
    offset2: Math.PI * 2/3 - 0.5,
    offset3: Math.PI * 4/3 - 0.5,
    rot1: 0.01,
    rot2: 0.013,
    rot3: 0.016
}

/**
 * scene
 */

// canvas
const canvas = document.querySelector('.webgl')

// scene
const scene = new THREE.Scene()

// camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(-7, 0, 7)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * meshes
 */
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('grey'),
    side: THREE.DoubleSide
})

// caveWall
const caveWallGeometry = new THREE.PlaneGeometry(10, 5)
const caveWall = new THREE.Mesh(caveWallGeometry, caveMaterial)
caveWall.position.set(0, 0, -5)
caveWall.receiveShadow = true
scene.add(caveWall)

// barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10, 2)
const barrierWall = new THREE.Mesh(barrierWallGeometry, caveMaterial)
barrierWall.position.set(0, -1.5, 5)
barrierWall.castShadow = true
//barrierWall.receiveShadow = true
scene.add(barrierWall)

// caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10, 10)
const caveFloor = new THREE.Mesh(caveFloorGeometry, caveMaterial)
caveFloor.position.set(0, -2.5, 0)
caveFloor.rotation.x = Math.PI * 0.5
caveFloor.receiveShadow = true
//caveFloor.castShadow = true
scene.add(caveFloor)

//  -- objects --
// torusKnot
const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.2)
const torusKnotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
torusKnot.position.set(mob.x, mob.y, mob.z)
torusKnot.rotation.x = Math.PI * 0.5
torusKnot.castShadow = true
scene.add(torusKnot)

// dolls
const dollGeo = new THREE. TorusKnotGeometry(0.05, 0.03)
const dollMat = new THREE.MeshNormalMaterial()
const doll1 = new THREE.Mesh(dollGeo, dollMat)
const doll2 = new THREE.Mesh(dollGeo, dollMat)
const doll3 = new THREE.Mesh(dollGeo, dollMat)
doll1.position.set(mob.x, mob.y, mob.z)
doll1.castShadow = true
scene.add(doll1)
doll2.position.set(mob.x, mob.y, mob.z)
doll2.castShadow = true
scene.add(doll2)
doll3.position.set(mob.x, mob.y, mob.z)
doll3.castShadow = true
scene.add(doll3)

/**
 * lights
 */

// ambientLight
const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

// directionalLight
const directionalLight = new THREE.PointLight(0xffffff, 0.5, 0, 0)
directionalLight.position.set(mob.x, mob.y, mob.z)
//directionalLight.rotation.z = Math.PI * 0.5
directionalLight.target = caveWall
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)

// directionalLightHelper
/*
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)
*/

/**
 * ui
 */
const ui = new datBoi.GUI()

const uiObject = {}

uiObject.reset = () => {
    directionalLight.position.set(0, 0, 8)
}

// directionalLight
const lightPositionFolder = ui.addFolder('Directional Light Position')

lightPositionFolder
    .add(directionalLight.position, 'x')
    .min(-7)
    .max(7)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-7)
    .max(7)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(0)
    .max(14)
    .step(0.1)
    .listen()

lightPositionFolder
    .add(uiObject, 'reset')
    .name('Reset Position')

/**
 * animation loop
 */
const clock = new THREE.Clock()

// animate
const animation = () => {
    //return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // animate objects
    torusKnot.rotation.z = elapsedTime * mob.speed
    //torusKnot.position.x = Math.sin(elapsedTime * 0.5) * 2
    doll1.position.set(-Math.sin(elapsedTime * mob.speed + mob.offset1) + mob.x, mob.y, Math.cos(elapsedTime * mob.speed + mob.offset1) + mob.z)
    doll2.position.set(-Math.sin(elapsedTime * mob.speed + mob.offset2) + mob.x, mob.y, Math.cos(elapsedTime * mob.speed + mob.offset2) + mob.z)
    doll3.position.set(-Math.sin(elapsedTime * mob.speed + mob.offset3) + mob.x, mob.y, Math.cos(elapsedTime * mob.speed + mob.offset3) + mob.z)
    doll1.rotation.y = elapsedTime * mob.rot1
    doll2.rotation.y = elapsedTime * mob.rot2 + 100
    doll3.rotation.y = elapsedTime * mob.rot3 + 200
    doll1.rotation.x = elapsedTime * mob.rot3
    doll2.rotation.x = elapsedTime * mob.rot2 + 100
    doll3.rotation.x = elapsedTime * mob.rot1 + 200

    // update directionalLightHelper
    //directionalLightHelper.update()

    // controls
    controls.update()

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()