import ObjectManager from './ObjectManager'
import Pointer from './Pointer'
import ParticleEmitter from './ParticleEmitter'
import User from './User'

const dbg = debug('app:Game')

export default class Game {
  constructor (domElement) {
    dbg('Initialize Game')
    this.objectManager = new ObjectManager()
    this.pointer = new Pointer()
    this.particleEmitter = new ParticleEmitter()
    this.lineToCollisionTest = null
    this.domElement = domElement
    this.users = {}
    this.isOnDesktop = false
  }

  start () {
    dbg('Start')
    this.instance = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, this.domElement, {
      preload: this.onPreload.bind(this),
      create: this.onCreate.bind(this),
      update: this.onUpdate.bind(this),
      render: this.onRender.bind(this)
    }, true)

    this.objectManager.setGame(this.instance)
    this.pointer.setGame(this.instance)
    this.particleEmitter.setGame(this.instance)
  }

  createTimeline (userName) {
    this.users.trump = new User('Donald Trump', 40, 'trump')
    this.users.clinton = new User('Hillary Clinton', 60, 'clinton')
    this.users.me = new User(userName, 0, 'me')
  }

  onPreload () {
    this.objectManager.loadAssets(this.getAssetsConfig())
  }

  onCreate () {
    this.setPhysics()
    this.objectManager.createHeads()
    this.objectManager.createBombs()
    this.particleEmitter.create()
    this.pointer.create()

    this.objectManager.onUpdate()
  }

  onUpdate () {
    this.objectManager.onUpdate()
    if (this.isOnDesktop) {
      this.pointer.addPoint(this.instance.input.x, this.instance.input.y)
    }
    this.pointer.onUpdate()

    this.pointer.getLastLines().forEach((line) => {
      this.lineToCollisionTest = line
      this.objectManager.trumpHeads.forEachExists(this.checkCollision, this)
      this.objectManager.clintonHeads.forEachExists(this.checkCollision, this)
      this.objectManager.bombs.forEachExists(this.checkCollision, this)
    })
  }

  onPointerMove (x, y) {
    this.pointer.addPoint(x, y)
  }

  onRender () {

  }

  getAssetsConfig () {
    return require('./assets.json')
  }

  setPhysics () {
    this.instance.physics.startSystem(Phaser.Physics.ARCADE)
    this.instance.physics.arcade.gravity.y = 250
  }

  checkCollision (sprite) {
    let l1 = new Phaser.Line(sprite.body.right - sprite.width, sprite.body.bottom - sprite.height, sprite.body.right, sprite.body.bottom)
    let l2 = new Phaser.Line(sprite.body.right - sprite.width, sprite.body.bottom, sprite.body.right, sprite.body.bottom - sprite.height)
    l2.rotate(90)

    if (Phaser.Line.intersects(this.lineToCollisionTest, l1, true)
     || Phaser.Line.intersects(this.lineToCollisionTest, l2, true)) {
      if (sprite.parent === this.objectManager.trumpHeads || sprite.parent === this.objectManager.clintonHeads) {
        this.onHeadHit(sprite)
      } else {
        this.onBombHit()
      }
    }
  }

  onBombHit () {
    dbg('hit bomb')

    this.objectManager.bombs.forEachExists(this.hitObject, this)
    this.objectManager.trumpHeads.forEachExists(this.hitObject, this)
    this.objectManager.clintonHeads.forEachExists(this.hitObject, this)
    this.users.me.decrementPercentage(10)
    this.users.trump.incrementPercentage(5)
    this.users.clinton.incrementPercentage(5)
  }

  onHeadHit (sprite) {
    if (sprite.data.candidat.indexOf('trump') > -1) {
      this.users.trump.decrementPercentage()
    } else {
      this.users.clinton.decrementPercentage()
    }
    this.users.me.incrementPercentage()
    this.hitObject(sprite)
  }

  hitObject (sprite) {
    this.particleEmitter.instance.x = sprite.x
    this.particleEmitter.instance.y = sprite.y
    this.particleEmitter.instance.start(true, 2000, null, 4)
    sprite.kill()
    this.pointer.resetPoints()
  }
}
