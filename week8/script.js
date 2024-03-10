import * as THREE from "three"
console.log(THREE)

/**
 * setup
 */

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
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
camera.position.set(1, 0, 3)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

/**
 * meshes
 */

// cube
const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
const cubeMat = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(cubeGeo, cubeMat)

scene.add(cube)

/**
 * dom interactions
 */
const domObject = {
    part: 1
}

// part 1
document.querySelector('#click1').onclick = function(){
    document.querySelector('#first').classList.add('hidden')
    document.querySelector('#second').classList.remove('hidden')
    domObject.part = 2
}

// part 2
document.querySelector('#click2').onclick = function(){
    document.querySelector('#second').classList.add('hidden')
    document.querySelector('#third').classList.remove('hidden')
    domObject.part = 3
}

// part 3
document.querySelector('#click3').onclick = function(){
    document.querySelector('#third').classList.add('hidden')
    document.querySelector('#first').classList.remove('hidden')
    domObject.part = 1
}

/**
 * animation loop
 */
const clock = new THREE.Clock()

// animate
const animation = () => {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // dom interactions
    // part 2
    if(domObject.part == 2){
        if(cube.rotation.y <= Math.PI * 0.5){
            cube.rotation.y += 0.02
        }
    }
    // part 3
    if(domObject.part == 3){

    }
    // reset
    if(domObject.part == 1){

    }

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)
}

animation()