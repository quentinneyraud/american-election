import QrCodeJs from 'qrcodejs2'
import socketIo from 'socket.io-client'
import {generateRandomId, selectId, selectClass} from '../utils/index'
import '../lib/SplitText'
import {QUERY_PARAMETER_NAME, SERVER_URL} from '../config'
import User from '../User'

const dbg = debug('app:GamePage')
let loader = null

export default class gamePage {
  constructor (ploader) {
    dbg('Initialize GamePage')

    loader = ploader
    this.roomId = generateRandomId()
    this.loadingDotsIntervalId = null
    this.replaceNameInInstructions()

    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {
      gameSection: selectId('game'),
      rule: selectClass('game-rule'),
      url: selectClass('game-rule-url'),
      qrcode: selectId('qrcode'),
      loading: selectClass('game-loading'),
      loadingDots: selectClass('game-loading-dots'),
      instructions: selectClass('game-instructions'),
      counters: selectClass('game-counter', true)
    }
    this.$els.splitLoadingDots = new SplitText(this.$els.loadingDots, {type: 'chars'}).chars
  }

  initializeEvents () {
  }

  initializeGsap () {
    TweenMax.set(this.$els.gameSection, {yPercent: 100})
    TweenMax.set([this.$els.qrcode, this.$els.rule, this.$els.loading], {xPercent: -50, yPercent: -50, autoAlpha: 0})
    TweenMax.set(this.$els.instructions, {yPercent: -50})
  }

  replaceNameInInstructions () {
    document.querySelector('.game-instructions p:nth-child(2)').innerText = document.querySelector('.game-instructions p:nth-child(2)').innerText.replace('__NAME__', User.name)
  }

  onEnter () {
    loader.show()

    this.generateQrCode()
    this.connectToSocket()
    this.bindSocketEvents()
  }

  connectToSocket () {
    dbg('connect to socket server')
    this.socket = socketIo(SERVER_URL)
  }

  bindSocketEvents () {
    this.socket.on('connect', this.onSocketConnected.bind(this))
    this.socket.on('room-joined', this.onSocketRoomJoined.bind(this))
    this.socket.on('orientation-to-client', this.onOrientationReceived.bind(this))
    this.socket.on('can-start', this.onStart.bind(this))
  }

  onSocketConnected () {
    dbg('connected')
    this.socket.emit('join-room', {roomId: this.roomId, from: 'screen'})
  }

  onSocketRoomJoined () {
    dbg('room joined')
    this.$els.url.innerText = `${window.location.href}?${QUERY_PARAMETER_NAME}=${this.roomId}`

    loader.hide(this.onLoadingEnd.bind(this))
  }

  onLoadingEnd () {
    this.loadingDotsIntervalId = setInterval(() => {
      TweenMax.staggerTo(this.$els.splitLoadingDots, 0.4, {y: -6, ease: Linear.easeNone, yoyo: true, repeat: 1}, 0.2)
    }, 2500)
    TweenMax.to([this.$els.rule, this.$els.qrcode, this.$els.loading], 0.5, {autoAlpha: 1, ease: Power2.easeIn})
  }

  onOrientationReceived (datas) {
    dbg('receive orientation', datas)
  }

  onStart () {
    clearInterval(this.loadingDotsIntervalId)
    new TimelineMax()
      .to([this.$els.rule, this.$els.loading, this.$els.qrcode], 0.5, {left: '-100%', ease: Power2.easeOut})
      .fromTo(this.$els.instructions, 1, {left:'100%'}, {left:'0%', ease: Power2.easeOut})
      .to(this.$els.instructions, 1, {left:'-100%', ease: Power2.easeIn}, '+=5')
      .to(this.$els.counters[0], 0.5, {left: '50%', ease: Power2.easeIn})
      .to(this.$els.counters[0], 0.5, {left: '-100%', ease: Power2.easeIn}, '+=1')
      .to(this.$els.counters[1], 0.5, {left: '50%', ease: Power2.easeIn})
      .to(this.$els.counters[1], 0.5, {left: '-100%', ease: Power2.easeIn}, '+=1')
      .to(this.$els.counters[2], 0.5, {left: '50%', ease: Power2.easeIn})
      .to(this.$els.counters[2], 0.5, {left: '-100%', ease: Power2.easeIn}, '+=1')
  }

  generateQrCode () {
    new QrCodeJs('qrcode', {
      text: `${window.location.href}?${QUERY_PARAMETER_NAME}=${this.roomId}`,
      width: 128,
      height: 128,
      colorDark: '#FFFFFF',
      colorLight: '#070F4E',
      correctLevel: QrCodeJs.CorrectLevel.H
    })
  }
}
