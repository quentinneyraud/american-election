const dbg = debug('app:Pointer')
const POINTER_LENGTH = 20

export default class Pointer {
  constructor () {
    dbg('Initialize Pointer')
    this.game = null
    this.points = []
  }

  setGame (game) {
    this.game = game
  }

  create () {
    this.instance = this.game.add.graphics(0, 0)
  }

  onUpdate () {
    if (this.points.length < 1 || this.points[0].x === 0) {
      return
    }

    this.instance.clear()
    this.instance.alpha = 0.5

    this.drawPointerLines()
  }

  addPoint (x, y) {
    this.points.push({x, y})
    this.points = this.points.splice(this.points.length - POINTER_LENGTH, this.points.length)
  }

  drawPointerLines () {
    this.instance.moveTo(this.points[0].x, this.points[0].y)
    let xArray = this.points.map(element => element.x)
    let yArray = this.points.map(element => element.y)
    let x = 1 / (Math.max.apply(null, xArray) - Math.min.apply(null, xArray))

    for (let i = 0; i <= 1; i += x) {
      let ppx = Phaser.Math.catmullRomInterpolation(xArray, i)
      let ppy = Phaser.Math.catmullRomInterpolation(yArray, i)
      this.instance.lineStyle(5, 0x7D26CD, 1)
      this.instance.lineTo(ppx, ppy)
    }
  }

  getLastLines () {
    let lines = []
    for (let i = 1; i < this.points.length / 2; i++) {
      lines.push(new Phaser.Line(this.points[i].x, this.points[i].y, this.points[i - 1].x, this.points[i - 1].y))
    }
    return lines
  }

  resetPoints () {
    this.points = []
  }
}
