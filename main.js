const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const light = new THREE.AmbientLight( 0xffffff )
scene.add( light )

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
directionalLight.castShadow = true
scene.add( directionalLight )
directionalLight.position.set( 0, 1, 1 )

camera.position.z = 5
renderer.setClearColor( 0xB7C3F3, 1 )

const loader = new THREE.GLTFLoader()
let doll

const start_position = 6
const end_position = -start_position

const text = document.querySelector('.text')

let DEAD_PLAYERS = 0
let SAFE_PLAYERS = 0

const startBtn = document.querySelector('.start-btn')

//musics
const bgMusic = new Audio('./music/bg.mp3')
bgMusic.loop = true
const winMusic = new Audio('./music/win.mp3')
const loseMusic = new Audio('./music/lose.mp3')

loader.load( './model/scene.gltf', function ( gltf ){
    scene.add( gltf.scene )
    doll = gltf.scene
    gltf.scene.position.set(0,-1, 0)
    gltf.scene.scale.set(0.4, 0.4, 0.4)
    startBtn.innerText = "start"
})

function lookBackward(){
    gsap.to(doll.rotation, {duration: .45, y: -3.15})
    setTimeout(() => dallFacingBack = true, 150)
}
function lookForward(){
    gsap.to(doll.rotation, {duration: .45, y: 0})
    setTimeout(() => dallFacingBack = false, 450)
}

function createCube(size, posX, rotY = 0, color = 0xfbc851){
    const geometry = new THREE.BoxGeometry( size.w, size.h, size.d )
    const material = new THREE.MeshBasicMaterial( { color } )
    const cube = new THREE.Mesh( geometry, material )
    cube.position.set(posX, 0, 0)
    cube.rotation.y = rotY
    scene.add( cube )
    return cube
}

//Creating runway
createCube({w: start_position * 2 + .21, h: 1.5, d: 1}, 0, 0, 0xe5a716).position.z = -1
createCube({w: .2, h: 1.5, d: 1}, start_position, -.4)
createCube({w: .2, h: 1.5, d: 1}, end_position, .4)


class Player {
    constructor(name = "Player", radius = .25, posY = 0, color = 0xffffff, id){
        const geometry = new THREE.SphereGeometry( radius, 100, 100 )
        const material = new THREE.MeshBasicMaterial( { color } )
        const player = new THREE.Mesh( geometry, material )
        scene.add( player )
        player.position.x = start_position - .4
        player.position.z = 1
        player.position.y = posY
        this.player = player
        this.playerInfo = {
            positionX: start_position - .4,
            velocity: 0,
            name,
            id,
            isDead: false
        }
    }

    run(){
        if(this.playerInfo.isDead) return
        this.playerInfo.velocity = .03
    }

    stop(){
        gsap.to(this.playerInfo, { duration: .1, velocity: 0 })
    }

    check(){
        if(this.playerInfo.isDead) return
        if(!dallFacingBack && this.playerInfo.velocity > 0){
            text.innerText = this.playerInfo.name + " lost!!!"
            this.playerInfo.isDead = true
            this.stop()
            DEAD_PLAYERS++
            loseMusic.play()
            document.querySelector(`#${this.playerInfo.id} .error`).style.display = 'initial'
            if(DEAD_PLAYERS == players.length){
                text.innerText = "Everyone lost!!!"
                gameStat = "ended"
            }
            if(DEAD_PLAYERS + SAFE_PLAYERS == players.length){
                gameStat = "ended"
            }
        }
        if(this.playerInfo.positionX < end_position + .7){
            text.innerText = this.playerInfo.name + " is safe!!!"
            this.playerInfo.isDead = true
            this.stop()
            SAFE_PLAYERS++
            winMusic.play()
            document.querySelector(`#${this.playerInfo.id} .pass`).style.display = 'initial'
            if(SAFE_PLAYERS == players.length){
                text.innerText = "Everyone is safe!!!"
                gameStat = "ended"
            }
            if(DEAD_PLAYERS + SAFE_PLAYERS == players.length){
                gameStat = "ended"
            }
        }
    }

    update(){
        this.check()
        this.playerInfo.positionX -= this.playerInfo.velocity
        this.player.position.x = this.playerInfo.positionX
    }
}

async function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

let players = []
const TIME_LIMIT = 25
async function init(){
const player1 = new Player(window.playerName.player1, .25, 1.5, 0xf8544e, 'player1')
const player2 = new Player(window.playerName.player2, .25, .9, 0xff8046, 'player2')
const player3 = new Player(window.playerName.player3, .25, -.0, 0xFFFF00, 'player3')
const player4 = new Player(window.playerName.player4, .25, -.6, 0x7afa73, 'player4')
const player5 = new Player(window.playerName.player5, .25, -1.2, 0x3bcffc, 'player5')
const player6 = new Player(window.playerName.player6, .25, -2.1, 0xc526ed, 'player6')

players = [
    {
        player: player1,
        key: "1",
        name: "player1"
    },
    {
        player: player2,
        key: "z",
        name: "player2"
    },
    {
        player: player3,
        key: "=",
        name: "player3"
    },
    {
        player: player4,
        key: "/",
        name: "player4"
    },
    {
        player: player5,
        key: "*",
        name: "player5"
    },
    {
        player: player6,
        key: "Enter",
        name: "player6"
    }
]
    await delay(500)
    text.innerText = "Starting in 3"
    await delay(500)
    text.innerText = "Starting in 2"
    await delay(500)
    text.innerText = "Starting in 1"
    lookBackward()
    await delay(500)
    text.innerText = "Gooo!!!"
    bgMusic.play()
    start()
}

let gameStat = "loading"

function start(){
    gameStat = "started"
    const progressBar = createCube({w: 8, h: .1, d: 1}, 0, 0, 0xebaa12)
    progressBar.position.y = 3.35
    gsap.to(progressBar.scale, {duration: TIME_LIMIT, x: 0, ease: "none"})
    setTimeout(() => {
        if(gameStat != "ended"){
            text.innerText = "Time Out!!!"
            loseMusic.play()
            gameStat = "ended"
        }
    }, TIME_LIMIT * 1000)
    startDall()
}

let dallFacingBack = true
async function startDall(){
   lookBackward()
   await delay((Math.random() * 1500) + 1500)
   lookForward()
   await delay((Math.random() * 800) + 800)
   startDall()
}


startBtn.addEventListener('click', () => {
    if(startBtn.innerText == "START"){
        init()
        document.querySelector('.modal').style.display = "none"
    }
})

function animate(){
    renderer.render( scene, camera )
    players.map(player => player.player.update())
    if(gameStat == "ended") return
    requestAnimationFrame( animate )
}
animate()

window.addEventListener("keydown", function(e){
    console.log('!!!', e.key)
    if(gameStat != "started") return
    let p = players.find(player => player.key == e.key)
    if(p){
        p.player.run()
    }
})
window.addEventListener("keyup", function(e){
    let p = players.find(player => player.key == e.key)
    if(p){
        p.player.stop()
    }
})

window.addEventListener('resize', onWindowResize, false )

function onWindowResize(){
    console.log('調整視窗大小')
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
}
window.addEventListener('load', () => {
    console.log('load')
    onWindowResize()
    window.playerName = {}
    const player1Name = prompt('player1 名字: ', '一號參賽者')
    window.playerName.player1 = player1Name
    document.querySelector('#player1 span').innerText = player1Name
    const player2Name = prompt('player2 名字: ', '二號參賽者')
    window.playerName.player2 = player2Name
    document.querySelector('#player2 span').innerText = player2Name
    const player3Name = prompt('player3 名字: ', '三號參賽者')
    window.playerName.player3 = player3Name
    document.querySelector('#player3 span').innerText = player3Name
    const player4Name = prompt('player4 名字: ', '四號參賽者')
    window.playerName.player4 = player4Name
    document.querySelector('#player4 span').innerText = player4Name
    const player5Name = prompt('player5 名字: ', '五號參賽者')
    window.playerName.player5 = player5Name
    document.querySelector('#player5 span').innerText = player5Name
    const player6Name = prompt('player6 名字: ', '六號參賽者')
    window.playerName.player6 = player6Name
    document.querySelector('#player6 span').innerText = player6Name
}, false)