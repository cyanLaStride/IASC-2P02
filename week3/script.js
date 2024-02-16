console.log("hewwo wowwd")
import * as THREE from "three"

/**
 * scene
 */

// canvas
const canvas = document.querySelector('.webgl')

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#002222')

// camera
const camera = new THREE.PerspectiveCamera(
    75, // fov
    window.innerWidth / window.innerHeight, // aspect
    0.1, // near
    100 // far
)
camera.position.set(0, 0, 5)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 * meshes
 */

// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(testSphere)

/**
 * animation loop
 */
const clock = new THREE.Clock()

// animate
const animation = () => {
    // return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    // animate testSphere
    testSphere.position.y = Math.sin(elapsedTime)
    testSphere.position.z = Math.sin(elapsedTime)*-2

    // renderer
    renderer.render(scene, camera)

    //request next time
    window.requestAnimationFrame(animation)
}

animation()