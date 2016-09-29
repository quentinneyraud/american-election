import Raf from 'raf'

const dbg = debug('app:Portrait')
const ELLIPSE_TOP = 140
const ELLIPSE_WIDTH = 100
const ELLIPSE_HEIGHT = 140
let rafId = null

export default class Portrait {
  constructor () {
    dbg('Initialize Portrait')
    Raf.polyfill()
    this.stream = null
    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {
      overlay: document.getElementsByClassName('signup-overlay')[0],
      canvas: document.getElementById('signup-canvas'),
      video: document.getElementById('signup-video'),
      popup: document.getElementsByClassName('signup-popup')[0],
      validButton: document.getElementsByClassName('signup-popup-valid')[0],
      exitButton: document.getElementsByClassName('signup-popup-exit')[0]
    }
    this.context = this.$els.canvas.getContext('2d')
  }

  initializeEvents () {
    this.$els.exitButton.addEventListener('click', this.hideModal.bind(this))
    this.$els.validButton.addEventListener('click', this.onValidButtonClick.bind(this))
  }

  initializeGsap () {
    this.openTimeline = new TimelineMax({paused: true})
      .set(this.$els.overlay, {zIndex: 100}, 'popup_start')
      .to(this.$els.overlay, 0.5, {opacity: 0.9, ease: Power2.easeIn}, 'popup_start')
      .to(this.$els.popup, 0.2, {autoAlpha: 1}, 'popup_start')
  }

  requestCameraAuthorization () {
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia)

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        video: true,
        audio: false
      }, (stream) => {
        this.onAuthorizationGranted(stream)
      },
      () => {
        this.onPictureError()
      })
    } else {
      this.onPictureError()
    }
  }

  showModal () {
    dbg('show')
    this.openTimeline.timeScale(1).addCallback(this.requestCameraAuthorization, 'popup_start+=0.5', null, this).play()
  }

  hideModal () {
    dbg('hide')
    this.stream.getTracks()[0].stop()
    window.cancelAnimationFrame(rafId)
    this.openTimeline.timeScale(1.5).reverse()
  }

  onAuthorizationGranted (stream) {
    this.$els.video.setAttribute('autoplay', true)
    this.$els.video.src = window.URL.createObjectURL(stream)
    this.stream = stream
    this.render()
  }

  render () {
    this.context.drawImage(this.$els.video, 0, 0)
    this.context.setLineDash([15, 15])
    this.context.strokeStyle = '#DDDDDD'
    this.context.ellipse(this.$els.canvas.width / 2, ELLIPSE_TOP, ELLIPSE_WIDTH, ELLIPSE_HEIGHT, Math.PI, 0, 2 * Math.PI)
    this.context.stroke()

    rafId = Raf(this.render.bind(this))
  }

  onPictureError () {
    // set default picture
  }

  onValidButtonClick () {
    const img = document.getElementsByClassName('signup-portrait-image')[0]

    const croppedImage = this.getCroppedEllispse()
    const mergedImage = this.getMergedImage(croppedImage.canvas)

    img.src = mergedImage.image
    this.hideModal()
  }

  getCroppedEllispse () {
    // Create Canvas
    const canvas = document.createElement('canvas')
    canvas.width = this.$els.canvas.width
    canvas.height = this.$els.canvas.height
    const context = canvas.getContext('2d')

    // Crop
    context.save()
    context.beginPath()
    context.ellipse(this.$els.canvas.width / 2, ELLIPSE_TOP, ELLIPSE_WIDTH - 2, ELLIPSE_HEIGHT - 2, Math.PI, 0, 2 * Math.PI)
    context.closePath()
    context.clip()
    context.drawImage(this.$els.canvas, 0, 0)
    context.restore()

    return {
      canvas,
      image: canvas.toDataURL()
    }
  }

  getMergedImage (canvasSrc) {
    // Create Canvas
    const img = document.getElementsByClassName('signup-portrait-image')[0]
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const context = canvas.getContext('2d')

    context.drawImage(canvasSrc, 30, 0, 500 / 1.5, 370 / 1.5)
    context.drawImage(img, 0, 0)

    return {
      canvas,
      image: canvas.toDataURL()
    }
  }
}
