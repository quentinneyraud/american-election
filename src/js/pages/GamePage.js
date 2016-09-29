import QrCodeJs from 'qrcodejs2'
import socketIo from 'socket.io-client'
import {generateRandomId, selectId, selectClass} from '../utils/index'
import '../lib/SplitText'
import {QUERY_PARAMETER_NAME, SERVER_URL} from '../config'

const dbg = debug('app:GamePage')
let loader = null

export default class gamePage {
  constructor (ploader) {
    dbg('Initialize GamePage')

    loader = ploader
    this.roomId = generateRandomId()
    this.loadingDotsIntervalId = null

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
      loadingDots: selectClass('game-loading-dots')
    }
    this.$els.splitLoadingDots = new SplitText(this.$els.loadingDots, {type: 'chars'}).chars
  }

  initializeEvents () {
  }

  initializeGsap () {
    TweenMax.set(this.$els.gameSection, {yPercent: 100})
    TweenMax.set([this.$els.qrcode, this.$els.rule, this.$els.loading], {xPercent: -50, yPercent: -50, autoAlpha: 0})
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
  }

  onSocketConnected () {
    dbg('connected')
    this.socket.emit('join-room', {roomId: this.roomId})
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
    new TimelineMax()
      .fromTo(this.$els.rule, 0.7, {autoAlpha: 0, yPercent: 100}, {autoAlpha: 1, yPercent: -50, ease: Power2.easeOut}, 'game_start')
      .fromTo(this.$els.qrcode, 0.7, {autoAlpha: 0, yPercent: 100}, {autoAlpha: 1, yPercent: -50, ease: Power2.easeOut}, 'game_start')
      .fromTo(this.$els.loading, 0.7, {autoAlpha: 0, yPercent: 100}, {autoAlpha: 1, yPercent: -50, ease: Power2.easeOut}, 'game_start')
  }

  onOrientationReceived (datas) {
    dbg('receive orientation', datas)
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
