
// create 3d scene
const sceneCanvas = document.getElementById('sceneCanvas')
const width = window.innerWidth
const height = window.innerHeight
sceneCanvas.setAttribute('width', width)
sceneCanvas.setAttribute('height', height)

const renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas })
renderer.setClearColor(0x000000)

const camera = new THREE.PerspectiveCamera(5, width / height, 1, 5000)
camera.position.set(0, 0, 4000)

const scene = new THREE.Scene()

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 4000)

scene.add(light)

// create group of dots for image
const imageGroup = new THREE.Group()

const createDot = (x, y, z) => {
    const geometry = new THREE.SphereBufferGeometry(3, 10, 10)
    const material = new THREE.MeshPhongMaterial( { color: 0xF1C232, emissiveIntensity: 0.2, emissive: 0xffffff} ) 
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    imageGroup.add(mesh)
}
scene.add(imageGroup)

// create canvas for image
const canvas = document.createElement('canvas')
const size = 256
const ctx = canvas.getContext('2d')

canvas.width = size
canvas.height = size

// array for image coordinates
let crossCoor = []

// create new image
const img = new Image()
img.onload = function () {
    ctx.drawImage(img, 0, 0)

    // get coordinates
    const imageColor = ctx.getImageData(0, 9, size, size).data

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const alpha = imageColor[((size * y) + x) * 4 + 3]
            if (alpha > 0) {
                crossCoor.push([x - size/2, y - size/2])
            }
        }
    }
   
    // create dots by coordinates
    crossCoor.map(el => {
        if (el[0] % 6 === 0 && el[1] % 6 === 0) {
            createDot(el[0], el[1], Math.random() * 40)
        }
    })
}

// current image
const some = 1
img.src = `./fonts/${some}.png`


const animate = () => {
    imageGroup.rotation.y += 0.011
    imageGroup.rotation.x = -0.19
    imageGroup.rotation.z = Math.PI
    renderer.render(scene, camera)

    requestAnimationFrame(function () { animate() })
}

animate()
