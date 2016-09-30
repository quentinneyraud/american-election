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

    this.instance.beginFill(0xFFFFFF)
    this.drawPointerLines()
    this.instance.endFill()

    /* for(var i = 1; i< this.points.length; i++) {
      line = new Phaser.Line(this.points[i].x, this.points[i].y, this.points[i-1].x, this.points[i-1].y);
      game.debug.geom(line);

      good_objects.forEachExists(checkIntersects);
      bad_objects.forEachExists(checkIntersects);
    }*/
  }

  addPoint (x, y) {
    this.points.push({x, y})
    this.points = this.points.splice(this.points.length - POINTER_LENGTH, this.points.length)
  }

  drawPointerLines () {
    this.instance.moveTo(this.points[0].x, this.points[0].y)
    this.points.forEach(({x, y}) => {
      this.instance.lineTo(x, y)
    })
  }

  getLastFiveLines () {
    let lines = []
    for (let i = 1; i < Math.floor(this.points.length / 2); i++) {
      lines.push(new Phaser.Line(this.points[i].x, this.points[i].y, this.points[i - 1].x, this.points[i - 1].y))
      // game.debug.geom(line);
    }
    return lines
  }

  resetPoints () {
    this.points = []
  }
}
