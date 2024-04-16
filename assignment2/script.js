import * as THREE from "three"
import * as datBoi from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**
 * setup
 */

// sizes
const sizes = {
    width: window.innerHeight * 0.5,
    height: window.innerHeight * 0.5,
    aspectRatio: 1 //window.innerWidth/window.innerHeight
}


/**
 * scene
 */

// canvas
const canvas = document.querySelector('.webgl')

// scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('grey')

// camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(10, 10, 10)
scene.add(camera)

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)

// orbit controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * lights
 */

// directional light
const directionalLight = new THREE.PointLight(0x808080, 100)
directionalLight.position.set(5,5,5)
directionalLight.castShadow = true
scene.add(directionalLight)

/**
 * meshes
 */

// cube geometry
const cubeGeo = new THREE.BoxGeometry(1, 1, 1)

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
const norMat = new THREE.MeshStandardMaterial()
const pointMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('grey')
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

const dataPoint = new THREE.Mesh(cubeGeo, pointMat)
dataPoint.castShadow = true
scene.add(dataPoint)

const planeGeo = new THREE.PlaneGeometry(11, 11)
const planeX = new THREE.Mesh(planeGeo, norMat)
planeX.position.x = -0.5
planeX.position.y = 5
planeX.position.z = 5
planeX.rotation.y = Math.PI * 0.5
planeX.receiveShadow = true
const planeY = new THREE.Mesh(planeGeo, norMat)
planeY.position.x = 5
planeY.position.y = -0.5
planeY.position.z = 5
planeY.rotation.x = Math.PI * -0.5
planeY.receiveShadow = true
const planeZ = new THREE.Mesh(planeGeo, norMat)
planeZ.position.x = 5
planeZ.position.y = 5
planeZ.position.z = -0.5
planeZ.receiveShadow = true
scene.add(planeX)
scene.add(planeY)
scene.add(planeZ)

const barGeo = new THREE.BoxGeometry(11, 0.5, 0.5)
const barX = new THREE.Mesh(barGeo, redMat)
barX.position.x = 5
barX.position.y = -0.25
barX.position.z = -0.25
const barY = new THREE.Mesh(barGeo, greenMat)
barY.position.y = 5
barY.position.x = -0.25
barY.position.z = -0.25
barY.rotation.z = Math.PI * 0.5
const barZ = new THREE.Mesh(barGeo, blueMat)
barZ.position.z = 5
barZ.position.y = -0.25
barZ.position.x = -0.25
barZ.rotation.y = Math.PI * 0.5
scene.add(barX)
scene.add(barY)
scene.add(barZ)

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
    term1: 'kusunoki', // kusunoki
    term2: 'miyagi', // miyagi
    term3: 'himeno', // himeno
    term1Enabled: true,
    term2Enabled: true,
    term3Enabled: true,
    termArray: [[0,0,0]],
    rotateCamera: false,
    animateData: false
    /*
    reveal(){
        // save terms to uiobj
        preset = ui.save();

        // parse text and terms
        parseTextandTerms()

        // hide the termsFolder ui
        termsFolder.hide()

        // show interactionFolder ui
        createInteractionFolders()
    } */
}

// texter parsers
// parse text and terms
const parseTextandTerms = () => {
    
    // strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    
    // tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)

    for (let i = 0; i < uiobj.textArray.length; i++){
        if(i>0){
            uiobj.termArray[i] = [0,0,0]
        }
    }

    // find term 1
    findTermInParsedText(uiobj.term1, 0)

    // find term 2
    findTermInParsedText(uiobj.term2, 1)

    // find term 3
    findTermInParsedText(uiobj.term3, 2)

    //console.log(uiobj.termArray)
}

const findTermInParsedText = (term, position) => {
    for (let i = 0; i < uiobj.textArray.length; i++){
        //console.log(i, uiobj.textArray[i])
        if(i>0){
            uiobj.termArray[i][position] = uiobj.termArray[i-1][position]
        }
        
        if(uiobj.textArray[i] === term){
            //console.log(i, term)

            /*
            // convert i into n, which is a value between 0 and 20
            const n = (100 / uiobj.textArray.length) * i * 0.2
            //console.log(n, term)

            // call drawCube function x times using converted n value
            // i am choosing x to be 1 because i think it looks best
            for(let x = 0; x < 1; x++){
                drawCube(n, material)
            }
            */
            uiobj.termArray[i][position]++
        }
    }
}

// load source text
fetch("https://vidberg.com/cors/threedays.txt")
    .then(response => response.text())
    .then((data) => {
        uiobj.text = data
        parseTextandTerms()
    })


// ui
const ui = new datBoi.GUI({
    container: document.querySelector('#parent1')
})
/*
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
*/

// interaction folders
//const createInteractionFolders = () => {
// cubes folder
const cubesFolder = ui.addFolder('Filter Terms')

cubesFolder
    .add(uiobj, 'term1Enabled')
    .name(`${uiobj.term1}`)

cubesFolder
    .add(uiobj, 'term2Enabled')
    .name(`${uiobj.term2}`)

cubesFolder
    .add(uiobj, 'term3Enabled')
    .name(`${uiobj.term3}`)

cubesFolder
    .add(uiobj, 'animateData')
    .name('Animate Data')

/*
// camera folder
const cameraFolder = ui.addFolder('Camera')

cameraFolder
    .add(uiobj, 'rotateCamera')
    .name('Rotate Camera')

    */
//}

// animation
const drawVis = (dataPlace) => {
    let term1 = uiobj.termArray[dataPlace][0]
    let term2 = uiobj.termArray[dataPlace][1]
    let term3 = uiobj.termArray[dataPlace][2]
    if(!uiobj.term1Enabled){
        term1 = 0
    }
    if(!uiobj.term2Enabled){
        term2 = 0
    }
    if(!uiobj.term3Enabled){
        term3 = 0
    }
    const total = Math.max(1, term1 + term2 + term3)
    scene.children[2].position.x = (term1 / total) * 10 // kusunoki
    scene.children[2].position.y = (term2 / total) * 10 // miyagi
    scene.children[2].position.z = (term3 / total) * 10 // himeno
    console.log(scene.children[2].position)
}

//console.log(scene.children[2])

/**
 * animation loop
 */

const clock = new THREE.Clock()
let dataPlace = 0;

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

    // data vis
    if(uiobj.animateData ){
        dataPlace += 50
        if(dataPlace >= uiobj.termArray.length){
            dataPlace = 0
        }
        drawVis(dataPlace)
    }

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)

}
animation()