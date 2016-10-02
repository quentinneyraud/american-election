import {randomInt, randomFloat} from '../utils/index'

const dbg = debug('app:HeadManager')
const FIRST_THROW_DELAY = 5000
const THROW_RATE_MIN = 0
const THROW_RATE_MAX = 1000

export default class ObjectManager {
  constructor () {
    dbg('Initialize ObjectManager')
    this.game = null
    this.trumpHeads = null
    this.clintonHeads = null
    this.bombs = null
    this.trumpHeadNames = []
    this.clintonHeadNames = []
    this.bombNames = []
    this.nextThrowTime = FIRST_THROW_DELAY
  }

  setGame (game) {
    this.game = game
  }

  loadAssets (assets) {
    dbg('Load assets')
    assets.forEach((element) => {
      dbg(`Load ${element.name} from ${element.image}`)
      this.game.load.image(element.name, require(element.image))

      if (element.type === 'head') {
        if (element.candidat === 'trump') {
          this.trumpHeadNames.push(element.name)
        } else {
          this.clintonHeadNames.push(element.name)
        }
      } else if (element.type === 'bomb') {
        this.bombNames.push(element.name)
      }
    })
  }

  createHeads () {
    this.trumpHeads = this.createGroup(this.trumpHeadNames, 'trump')
    this.clintonHeads = this.createGroup(this.clintonHeadNames, 'clinton')
  }

  createBombs () {
    this.bombs = this.createGroup(this.bombNames)
  }

  createGroup (cacheKeys, candidat) {
    const group = this.game.add.group()
    group.enableBody = true
    group.physicsBodyType = Phaser.Physics.ARCADE

    cacheKeys.forEach((cacheKey) => {
      group.create(0, 0, cacheKey, null, false)
      group.create(0, 0, cacheKey, null, false)
      group.create(0, 0, cacheKey, null, false)
    })

    group.setAll('data', {candidat})
    group.setAll('checkWorldBounds', true)
    group.setAll('outOfBoundsKill', true)
    return group
  }

  onUpdate () {
    if (this.game.time.now > this.nextThrowTime && this.trumpHeads.countDead() > 0 && this.clintonHeads.countDead() > 0 && this.bombs.countDead() > 0) {
      this.nextThrowTime = this.game.time.now + this.getNextThrowDelay()
      this.throwHead()
      if (Math.random() > 0.5) {
        this.throwBomb()
      }
    }
  }

  getNextThrowDelay () {
    return randomFloat(THROW_RATE_MIN, THROW_RATE_MAX)
  }

  throwHead () {
    this.throwObject(this.trumpHeads)
    this.throwObject(this.clintonHeads)
  }

  throwBomb () {
    this.throwObject(this.bombs)
  }

  throwObject (group) {
    const object = group.getFirstDead()
    if (object) {
      object.reset(randomInt(this.game.width / 4, this.game.width / 4 * 3), this.game.height)
      object.anchor.setTo(0.5, 0.5)
      object.body.angularAcceleration = randomInt(0, 100)
      this.game.physics.arcade.moveToXY(object, this.game.world.centerX, /* randomInt(this.game.world.centerY, this.game.world.centerY - 150)*/0, randomInt(350, 600))
    }
  }
}
