import ObjectManager from './ObjectManager'
import Pointer from './Pointer'
import ParticleEmitter from './ParticleEmitter'

const dbg = debug('app:Game')

export default class Game {
  constructor (domElement) {
    dbg('Initialize Game')
    this.objectManager = new ObjectManager()
    this.pointer = new Pointer()
    this.particleEmitter = new ParticleEmitter()
    this.lineToCollisionTest = null
    this.domElement = domElement
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
    this.pointer.addPoint(this.instance.input.x, this.instance.input.y)
    this.pointer.onUpdate()

    this.pointer.getLastFiveLines().forEach((line) => {
      this.lineToCollisionTest = line
      this.objectManager.heads.forEachExists(this.checkCollision, this)
      this.objectManager.bombs.forEachExists(this.checkCollision, this)
    })
  }

  onRender () {

  }

  getAssetsConfig () {
    return require('./assets.json')
  }

  setPhysics () {
    this.instance.physics.startSystem(Phaser.Physics.ARCADE)
    this.instance.physics.arcade.gravity.y = 300
  }

  checkCollision (sprite) {
    let l1 = new Phaser.Line(sprite.body.right - sprite.width, sprite.body.bottom - sprite.height, sprite.body.right, sprite.body.bottom)
    /* var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height)
     l2.angle = 90*/

    if (Phaser.Line.intersects(this.lineToCollisionTest, l1, true)
    /* || Phaser.Line.intersects(line, l2, true)*/) {
      /* vérifie si c'est pas la ligne d'avant qui hit
      let contactPoint = new Phaser.Point(0, 0)
      contactPoint.x = game.input.x;
      contactPoint.y = game.input.y;
      var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
      if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
        return;
      }
      */
      if (sprite.parent === this.objectManager.heads) {
        this.onHeadHit(sprite)
      } else {
        this.onBombHit()
      }
    }
  }

  onBombHit () {
    dbg('hit bomb')

    this.objectManager.bombs.forEachExists(this.hitObject, this)
    this.objectManager.heads.forEachExists(this.hitObject, this)
  }

  onHeadHit (sprite) {
    dbg('hit head')

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
