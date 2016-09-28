const dbg = debug('app:GamePage')
let loader = null

export default class gamePage {
  constructor (ploader) {
    dbg('Initialize GamePage')

    loader = ploader

    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {
      gameSection: document.getElementById('game')
    }
  }

  initializeEvents () {
  }

  initializeGsap () {
    TweenMax.set(this.$els.gameSection, {yPercent: 100})
    TweenMax.set('.road', {rotationX: 30, transformPerspective: 130, xPercent: -50})
    TweenMax.to('.lines', 4, {yPercent: -50, repeat: -1, ease: Linear.easeNone})
  }

  onEnter () {
    loader.show()
  }
}
