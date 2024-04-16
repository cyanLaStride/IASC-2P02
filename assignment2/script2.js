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
const canvas = document.querySelector('.webgl2')

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
camera.position.set(0, 70, 0)
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

const drawCube = (y, material, size) => {
    /*
    const cube = new THREE.Mesh(cubeGeo, material)
    cube.position.y = y - 10
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10

    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    cube.randomizer = Math.random() * 30

    scene.add(cube)
    */
    const pointGeo = new THREE.BoxGeometry(0.2, 0.2, size)
    const cube = new THREE.Mesh(pointGeo, material)
    cube.position.x = y - 50
    cube.position.z += (50 - size * 0.5)

    cube.randomizer = Math.random() * 30

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
    term1: 'yen',
    term2: 'vending',
    term3: 'debt',
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
        /* the chapter finding machine
        if(uiobj.textArray[i] === 'the' && uiobj.textArray[i+1] === 'seated' ){
            console.log(i)
        }
        //*/
        if(uiobj.textArray[i] === term){
            //console.log(i, term)

            // the pyramid of doom
            let size = 14730
            if(i > 2596){
                size = 11070
                if(i > 7771){
                    size = 90
                    if(i > 13246){
                        size = 89
                        if(i > 15879){
                            size = 88
                            if(i > 18904){
                                size = 87
                                if(i > 21984){
                                    size = 86
                                    if(i > 24253){
                                        size = 81
                                        if(i > 28029){
                                            size = 80
                                            if(i > 33539){
                                                size = 78
                                                if(i > 40031){
                                                    size = 62
                                                    if(i > 44584){
                                                        size = 60
                                                        if(i > 48991){
                                                            size = 45
                                                            if(i > 52474){
                                                                size = 33
                                                                if(i > 53777){
                                                                    size = 3
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // i know there are better ways to do this but once i started i couldnt stop laughing

            // convert i into n, which is a value between 0 and 20
            const n = (100 / uiobj.textArray.length) * i //* 0.2
            //console.log(n, term)

            // call drawCube function x times using converted n value
            // i am choosing x to be 1 because i think it looks best
            for(let x = 0; x < 1; x++){
                drawCube(n, material, size)
            }
            
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
    container: document.querySelector('#parent2')
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
    .add(redMat, 'visible')
    .name(`${uiobj.term1}`)

cubesFolder
    .add(greenMat, 'visible')
    .name(`${uiobj.term2}`)

cubesFolder
    .add(blueMat, 'visible')
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

    // animate data
    
    if(uiobj.animateData){
        for(let i=0; i < scene.children.length; i++){
            if(scene.children[i].type === "Mesh"){
                /*
                scene.children[i].scale.x = Math.sin(elapsedTime + scene.children[i].randomizer)
                scene.children[i].scale.y = Math.sin(elapsedTime + scene.children[i].randomizer)
                scene.children[i].scale.z = Math.sin(elapsedTime + scene.children[i].randomizer)
                */
                scene.children[i].position.y = Math.sin((elapsedTime + scene.children[i].randomizer) * 0.2)
            }
        }
    }
    

    // renderer
    renderer.render(scene, camera)

    // request next frame
    window.requestAnimationFrame(animation)

}
animation()