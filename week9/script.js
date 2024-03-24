import * as THREE from "three"
import * as datBoi from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**
 * setup
 */

// sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth/window.innerHeight
}


/**
 * scene
 */

// canvas
const canvas = document.querySelector('.webgl')

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('black')

// camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// orbit controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * animation loop
 */
const clock = new THREE.Clock()

// animate
const animation = () => {

    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // orbit controls
    controls.update()

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)

}
animation()