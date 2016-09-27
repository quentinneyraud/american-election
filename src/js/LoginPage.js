import './lib/SplitText'

const dbg = debug('app:LoginPage')

export default class LoginPage {
  constructor () {
    dbg('Initialize LoginPage')
    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {
      portrait: document.getElementsByClassName('signup-portrait')[0],
      form: document.getElementsByClassName('signup-form')[0],
      popup: document.getElementsByClassName('signup-popup')[0],
      title: document.getElementsByClassName('signup-title')[0],
      subtitle: document.getElementsByClassName('signup-subtitle')[0],
      canvas: document.getElementById('#login-canvas')
    }
    this.$els.splitTitle = new SplitText(this.$els.title, {type: 'chars'}).chars
  }

  initializeEvents () {

  }

  initializeGsap () {
    TweenMax.set([this.$els.portrait, this.$els.form, this.$els.popup], {autoAlpha: 0})
    TweenMax.set(this.$els.title, {xPercent: -50, yPercent: -50, scale: 1.5})
    TweenMax.set(this.$els.splitTitle, {autoAlpha: 0})
  }

  onEnter () {
    new TimelineMax()
      .staggerFromTo(this.$els.splitTitle, 0.2, {autoAlpha: 0, scale: 0}, {autoAlpha: 1, scale: 1, ease: Power4.easeIn}, 0.05, 'title_start')
      .to(this.$els.title, 0.5, {top: '10%', scale: 1, ease: Power4.easeIn, force3D: false}, 'title_start+=1.5')
      .fromTo(this.$els.subtitle, 0.4, {autoAlpha: 0, y: 20}, {autoAlpha: 1, y:0, ease: Power3.easeIn}, '+=1')
      .to(this.$els.subtitle, 0.2, {autoAlpha: 0, y: -20}, '+=3')
      .staggerTo([this.$els.portrait, this.$els.form], 0.5, {autoAlpha: 1, ease: Power2.easeIn}, 0.3)
  }

  requestCameraAuthorization () {
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia)

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: true,
          audio: true
        },
        function (localMediaStream) {
          var video = document.querySelector('video')
          video.src = window.URL.createObjectURL(localMediaStream)
        },
        function (err) {
          console.log('The following error occured: ' + err)
        }
      )
    } else {
      console.log('getUserMedia not supported')
    }
  }
}
