const dbg = debug('app:Loader')

const FAKE_LOADER_DURATION = 2

export default class Loader {
  constructor () {
    dbg('Initialize Loader')
    this.initializeElements()
  }

  initializeElements () {
    this.$els = {
      loader: document.getElementsByClassName('loader')[0]
    }
  }

  show () {
    TweenMax.to(this.$els.loader, 0.3, {autoAlpha: 1})
  }

  hide (cb = null) {
    TweenMax.to(this.$els.loader, 0.5, {autoAlpha: 0, ease: Power2.easeIn, delay: FAKE_LOADER_DURATION, onComplete: cb})
  }
}
