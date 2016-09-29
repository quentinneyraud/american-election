import '../lib/SplitText'
import Portrait from '../Portrait'
import { selectClass, selectId } from '../utils/index'
import User from '../User'

const dbg = debug('app:LoginPage')
const diviserW = window.innerWidth / 20
const diviserH = window.innerHeight / 20

export default class LoginPage {
  constructor () {
    dbg('Initialize LoginPage')
    this.portrait = new Portrait()
    this.leaveCallback = null

    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {
      signupSection: selectId('signup'),
      gameSection: selectId('game'),
      portrait: document.querySelector('.signup-portrait img'),
      start: selectClass('signup-start'),
      card: selectClass('signup-card'),
      form: selectClass('signup-form'),
      title: selectClass('signup-title'),
      subtitle: selectClass('signup-subtitle'),
      transition: selectClass('signup-transition')
    }
    this.$els.splitTitle = new SplitText(this.$els.title, {type: 'chars'}).chars
  }

  initializeEvents () {
    this.$els.portrait.addEventListener('click', this.portrait.showModal.bind(this.portrait))
    this.$els.start.addEventListener('click', this.onStart.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  initializeGsap () {
    TweenMax.set([this.$els.popup, this.$els.card], {autoAlpha: 0})
    TweenMax.set(this.$els.title, {xPercent: -50, yPercent: -50, scale: 1.5})
    TweenMax.set(this.$els.card, {xPercent: -50, yPercent: -50})
    TweenMax.set(this.$els.start, {xPercent: -50})
    TweenMax.set(this.$els.splitTitle, {autoAlpha: 0})
  }

  setLeaveCallback (cb) {
    this.leaveCallback = cb
  }

  onEnter () {
    new TimelineMax()
      .staggerFromTo(this.$els.splitTitle, 0.2, {autoAlpha: 0, scale: 0}, {autoAlpha: 1, scale: 1, ease: Power4.easeIn}, 0.05, 'title_start')
      .to(this.$els.title, 0.5, {top: '10%', scale: 1, ease: Power2.easeIn, force3D: false}, 'title_start+=1.5')
      .fromTo(this.$els.subtitle, 0.4, {autoAlpha: 0, y: 20}, {autoAlpha: 1, y: 0, ease: Power3.easeIn}, '+=1')
      .to(this.$els.subtitle, 0.2, {autoAlpha: 0, y: -20}, '+=2')
      .fromTo(this.$els.card, 0.7, {autoAlpha: 0, yPercent: 200}, {autoAlpha: 1, yPercent: -50, ease: Power2.easeOut})
      .fromTo(this.$els.start, 0.7, {autoAlpha: 0, yPercent: 200}, {autoAlpha: 1, yPercent: 0, ease: Power2.easeOut}, '+=0')
  }

  onMouseMove (event) {
    TweenMax.to(this.$els.card, 0.5, {rotationY: `${event.clientX / diviserW - 10}deg`, x: event.clientX / diviserW - 10, transformPerspective: 0})
    TweenMax.to(this.$els.card, 0.5, {rotationX: `${event.clientY / diviserH - 10}deg`, y: event.clientY / diviserH - 10, transformPerspective: 0})
  }

  onStart () {
    User.setName(document.querySelector('.signup-form input[name=name]').value)
    User.setSide(document.querySelector('.signup-form input[name=side]'))
    new TimelineMax()
      .staggerTo([this.$els.title, this.$els.card, this.$els.start], Math.random() / 2 + 0.5, {yPercent: -200, ease: Power2.easeIn}, 'transition_start')
      .to(this.$els.signupSection, 0.5, {yPercent: -100, ease: Power2.easeInOut}, 'transition_start')
      .fromTo(this.$els.gameSection, 0.5, {yPercent: 100}, {yPercent: 0, ease: Power2.easeInOut}, 'transition_start')
      .call(this.leaveCallback, null, this)
  }
}
