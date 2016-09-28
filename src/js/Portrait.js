import Raf from 'raf'

const dbg = debug('app:Portrait')
const ELLIPSE_TOP = 120
const ELLIPSE_WIDTH = 90
const ELLIPSE_HEIGHT = 120
let rafId = null

export default class Portrait {
  constructor () {
    dbg('Initialize Portrait')
    Raf.polyfill()

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
    window.cancelAnimationFrame(rafId)
    this.openTimeline.timeScale(1.5).reverse()
  }

  onAuthorizationGranted (stream) {
    this.$els.video.setAttribute('autoplay', true)
    this.$els.video.src = window.URL.createObjectURL(stream)
    this.render()
  }

  render () {
    this.context.drawImage(this.$els.video, 0, 0)
    this.context.strokeStyle = '#FF0000'
    this.context.ellipse(this.$els.canvas.width / 2, ELLIPSE_TOP, ELLIPSE_WIDTH, ELLIPSE_HEIGHT, Math.PI, 0, 2 * Math.PI)
    /* this.context.moveTo(311,224);
    this.context.lineTo(305,217);
    this.context.moveTo(305,217);
    this.context.lineTo(300,237);
    this.context.moveTo(300,237);
    this.context.lineTo(309,245);
    this.context.moveTo(309,245);
    this.context.lineTo(325,293);
    this.context.moveTo(325,293);
    this.context.lineTo(356,300);
    this.context.moveTo(356,300);
    this.context.lineTo(384,294);
    this.context.moveTo(384,294);
    this.context.lineTo(395,252);
    this.context.moveTo(395,252);
    this.context.lineTo(405,243);
    this.context.moveTo(405,243);
    this.context.lineTo(410,224);
    this.context.moveTo(410,224);
    this.context.lineTo(398,229);
    this.context.moveTo(398,229);
    this.context.lineTo(399,202);
    this.context.moveTo(399,202);
    this.context.lineTo(371,170);
    this.context.moveTo(371,170);
    this.context.lineTo(341,169);
    this.context.moveTo(341,169);
    this.context.lineTo(315,186);
    this.context.moveTo(315,186);
    this.context.lineTo(310,221); */
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
    /* context.moveTo(311,224);
    context.lineTo(305,217);
    context.moveTo(305,217);
    context.lineTo(300,237);
    context.moveTo(300,237);
    context.lineTo(309,245);
    context.moveTo(309,245);
    context.lineTo(325,293);
    context.moveTo(325,293);
    context.lineTo(356,300);
    context.moveTo(356,300);
    context.lineTo(384,294);
    context.moveTo(384,294);
    context.lineTo(395,252);
    context.moveTo(395,252);
    context.lineTo(405,243);
    context.moveTo(405,243);
    context.lineTo(410,224);
    context.moveTo(410,224);
    context.lineTo(398,229);
    context.moveTo(398,229);
    context.lineTo(399,202);
    context.moveTo(399,202);
    context.lineTo(371,170);
    context.moveTo(371,170);
    context.lineTo(341,169);
    context.moveTo(341,169);
    context.lineTo(315,186);
    context.moveTo(315,186);
    context.lineTo(310,221); */
    context.closePath()
    context.clip()
    context.drawImage(this.$els.canvas, 0, 0)
    context.restore()

    /* const ellipseCanvas = document.createElement('canvas')
    ellipseCanvas.width = ELLIPSE_WIDTH - 2
    ellipseCanvas.height = ELLIPSE_HEIGHT - 2
    const ellipseContext = ellipseCanvas.getContext('2d') */

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

    context.drawImage(img, 0, 0)
    context.drawImage(canvasSrc, 0, 0)

    return {
      canvas,
      image: canvas.toDataURL()
    }
  }
}
