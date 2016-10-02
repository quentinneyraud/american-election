import QrCodeJs from 'qrcodejs2'
import socketIo from 'socket.io-client'
import {generateRandomId, selectId, selectClass} from '../utils/index'
import '../lib/SplitText'
import {QUERY_PARAMETER_NAME, SERVER_URL, URL} from '../config'
import User from '../User'
import Game from '../Game/index'

const dbg = debug('app:GamePage')
const GAME_DURATION = 90
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
    this.game = new Game('game-phaser')
  }

  initializeElements () {
    this.$els = {
      deviceSelection: selectClass('device-selection'),
      gameSection: selectId('game'),
      url: selectClass('device-selection-mobile-url'),
      loadingDots: selectClass('device-selection-mobile-loading-dots'),
      instructions: selectClass('game-instructions'),
      counters: selectClass('game-counter', true),
      gameContainer: selectClass('game-container'),
      desktopButton: selectClass('device-selection-desktop-button'),
      dayCounter: selectClass('game-container-counter'),
      gameResultMessage: selectClass('game-container-result'),
      gameResultReload: selectClass('game-container-reload')
    }
    this.$els.splitLoadingDots = new SplitText(this.$els.loadingDots, {type: 'chars'}).chars
  }

  initializeEvents () {
    this.$els.desktopButton.addEventListener('click', this.onDesktopButtonClick.bind(this))
    this.$els.gameResultReload.addEventListener('click', this.onReloadClick.bind(this))
  }

  initializeGsap () {
    TweenMax.set(this.$els.gameSection, {yPercent: 100})
    TweenMax.set([this.$els.gameContainer, this.$els.instructions, this.$els.gameResultMessage, this.$els.gameResultReload, this.$els.deviceSelection], {autoAlpha: 0})
  }

  onEnter () {
    loader.show()

    this.game.createTimeline(User.name)
    this.$els.url.innerText = `${URL}/?${QUERY_PARAMETER_NAME}=${this.roomId}`
    this.generateQrCode()
    this.connectToSocket()
    this.bindSocketEvents()
  }

  decrementDayCounter () {
    const dayCounterIntervalId = setInterval(() => {
      let nextDay = parseInt(this.$els.dayCounter.innerText) -1

      if (nextDay === -1) {
        clearInterval(dayCounterIntervalId)
        this.game.instance.destroy()
        this.onEndGame()
      } else {
        this.$els.dayCounter.innerText = nextDay
      }
    }, GAME_DURATION / 40 * 1000)
  }

  onDesktopButtonClick () {
    this.disconnectSocket()
    this.game.isOnDesktop = true
    this.onStart()
  }

  connectToSocket () {
    dbg('connect to socket server', SERVER_URL)
    this.socket = socketIo(SERVER_URL)
  }

  disconnectSocket () {
    dbg('disconnect socket')
    this.socket.disconnect()
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
    loader.hide(this.onLoadingEnd.bind(this))
  }

  onLoadingEnd () {
    this.loadingDotsIntervalId = setInterval(() => {
      TweenMax.staggerTo(this.$els.splitLoadingDots, 0.4, {y: -6, ease: Linear.easeNone, yoyo: true, repeat: 1}, 0.2)
    }, 2500)
    TweenMax.to(this.$els.deviceSelection, 0.5, {autoAlpha: 1, ease: Power2.easeIn})
  }

  onOrientationReceived (datas) {
    this.game.onPointerMove(datas.x, datas.y)
  }

  onStart () {
    clearInterval(this.loadingDotsIntervalId)
    new TimelineMax()
      .to(this.$els.deviceSelection, 1, {xPercent: -150, ease: Power2.easeOut})
      .fromTo(this.$els.instructions, 1, {xPercent: 100, autoAlpha: 0}, {xPercent: 0, autoAlpha: 1, ease: Power2.easeOut})
      .to(this.$els.instructions, 1, {xPercent: -100, ease: Power2.easeIn}, '+=7')
      .to(this.$els.gameContainer, 0.5, {autoAlpha: 1, ease: Power2.easeIn})
      .call(this.game.start, null, this.game)
      .call(this.decrementDayCounter, null, this)
  }

  generateQrCode () {
    new QrCodeJs('qrcode', {
      text: `${URL}/?${QUERY_PARAMETER_NAME}=${this.roomId}`,
      width: 128,
      height: 128,
      colorDark: '#FFFFFF',
      colorLight: '#070F4E',
      correctLevel: QrCodeJs.CorrectLevel.H
    })
  }

  onEndGame () {
    if (this.game.users.me.percentage > this.game.users.trump.percentage && this.game.users.me.percentage > this.game.users.clinton.percentage) {
      this.$els.gameResultMessage.innerHTML = 'Bravo, tu as battu Trump et Clinton.</br> Tu es élu président'
    } else {
      this.$els.gameResultMessage.innerHTML = 'Dommage, tu as été battu.'
    }

    TweenMax.to([this.$els.gameResultMessage, this.$els.gameResultReload], 0.5, {autoAlpha: 1})
  }

  onReloadClick (event) {
    event.preventDefault()
    window.location.reload()
  }
}
