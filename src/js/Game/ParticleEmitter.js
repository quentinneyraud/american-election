const MAX_PARTICLES = 300
const PARTICLES_GRAVITY = 300
const PARTICLES_Y_SPEED_MIN = -400
const PARTICLES_Y_SPEED_MAX = 400

export default class ParticleEmitter {
  constructor () {
    this.game = null
  }

  setGame (game) {
    this.game = game
  }

  create () {
    this.instance = this.game.add.emitter(0, 0, MAX_PARTICLES)
    this.instance.makeParticles('particle')
    this.instance.gravity = PARTICLES_GRAVITY
    this.instance.setYSpeed(PARTICLES_Y_SPEED_MIN, PARTICLES_Y_SPEED_MAX)
  }
}
