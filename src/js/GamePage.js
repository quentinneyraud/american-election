import QrCodeJs from 'qrcodejs2'
import socketIo from 'socket.io-client'
import {generateRandomId} from './utils/index'

const dbg = debug('app:GamePage')
let loader = null

export default class gamePage {
  constructor (ploader) {
    dbg('Initialize GamePage')

    loader = ploader
    this.roomId = generateRandomId()

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
  }

  onEnter () {
    loader.show()

    this.generateQrCode()
    this.connectToSocket()
    this.bindSocketEvents()
  }

  connectToSocket () {
    dbg('connect to socket server')
    this.socket = socketIo('http://localhost:8080')
  }

  bindSocketEvents () {
    this.socket.on('connect', this.onSocketConnected.bind(this))
    this.socket.on('room-joined', this.onSocketRoomJoined.bind(this))
    this.socket.on('orientation-to-client', this.onOrientationReceived.bind(this))
  }

  onSocketConnected () {
    this.socket.emit('join-room', {roomId: this.roomId})
  }

  onSocketRoomJoined () {
    loader.hide()
  }

  onOrientationReceived (datas) {
    console.log('receive orientation', datas)
  }

  generateQrCode () {
    new QrCodeJs("test", {
      text: `http://localhost:3000?code=${this.roomId}`,
      width: 128,
      height: 128,
      colorDark : "#FFFFFF",
      colorLight : "#070F4E",
      correctLevel : QrCodeJs.CorrectLevel.H
    })
  }
}
