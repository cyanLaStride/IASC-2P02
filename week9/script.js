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
camera.position.set(0, 0, 20)
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
 * lights
 */

// directional light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/**
 * meshes
 */

// cube geometry
const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// cube materials
const redMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('red')
})
const greenMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('green')
})
const blueMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('blue')
})

const drawCube = (y, material) => {
    const cube = new THREE.Mesh(cubeGeo, material)
    cube.position.y = y - 10
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10

    cube.rotation.x = Math.random () * 2 * Math.PI
    cube.rotation.y = Math.random () * 2 * Math.PI
    cube.rotation.z = Math.random () * 2 * Math.PI

    scene.add(cube)
}

//drawCube(1, redMat)
//drawCube(0, greenMat)
//drawCube(-1, blueMat)


/**
 * text parsers and ui
 */
let preset = {}

const uiobj = {
    text: '',
    textArray: [""],
    term1: 'cupboard',
    term2: 'hat',
    term3: 'broom',
    rotateCamera: false,
    reveal(){
        // save terms to uiobj
        preset = ui.save();

        // parse text and terms
        parseTextandTerms()

        // hide the termsFolder ui
        termsFolder.hide()

        // show interactionFolder ui
        createInteractionFolders()
    }
}

// texter parsers
// load source text
fetch("https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt")
    .then(response => response.text())
    .then((data) => {
        uiobj.text = data
    })

// parse text and terms
const parseTextandTerms = () => {
    
    // strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    
    // tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)

    // find term 1
    findTermInParsedText(uiobj.term1, redMat)

    // find term 2
    findTermInParsedText(uiobj.term2, greenMat)

    // find term 3
    findTermInParsedText(uiobj.term3, blueMat)

    //console.log(uiobj.textArray)
}

const findTermInParsedText = (term, material) => {
    for (let i = 0; i < uiobj.textArray.length; i++){
        //console.log(i, uiobj.textArray[i])
        if(uiobj.textArray[i] === term){
            //console.log(i, term)

            // convert i into n, which is a value between 0 and 20
            const n = (100 / uiobj.textArray.length) * i * 0.2
            //console.log(n, term)

            // call drawCube function x times using converted n value
            // i am choosing x to be 1 because i think it looks best
            for(let x = 0; x < 1; x++){
                drawCube(n, material)
            }
        }
    }
}

// ui
const ui = new datBoi.GUI()

// terms folder
const termsFolder = ui.addFolder('Enter Terms')

termsFolder
    .add(uiobj, 'term1')
    .name('Red Term')

termsFolder
    .add(uiobj, 'term2')
    .name('Green Term')

termsFolder
    .add(uiobj, 'term3')
    .name('Blue Term')

termsFolder
    .add(uiobj, 'reveal')
    .name('Reveal')

// interaction folders
const createInteractionFolders = () => {
    // cubes folder
    const cubesFolder = ui.addFolder('Filter Terms')

    cubesFolder
        .add(redMat, 'visible')
        .name(`${uiobj.term1}`)

    cubesFolder
        .add(greenMat, 'visible')
        .name(`${uiobj.term2}`)

    cubesFolder
        .add(blueMat, 'visible')
        .name(`${uiobj.term3}`)

    // camera folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')
}

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

    // camera rotation
    if(uiobj.rotateCamera){
        camera.position.x = Math.sin(elapsedTime * 0.2) * 20
        camera.position.z = Math.cos(elapsedTime * 0.2) * 20
    }

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)

}
animation()