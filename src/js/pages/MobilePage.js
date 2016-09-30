import socketIo from 'socket.io-client'
import {getQueryVariable} from '../utils/index'
import {QUERY_PARAMETER_NAME, SERVER_URL} from '../config'

const dbg = debug('app:MobilePage')

export default class MobilePage {
  constructor () {
    dbg('Initialize MobilePage')
    this.socket = null
    this.roomId = getQueryVariable(QUERY_PARAMETER_NAME)

    this.fixVibrate()
    this.checkDeviceMotion()

    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
  }

  initializeElements () {
    this.$els = {

    }
  }

  initializeEvents () {
  }

  initializeGsap () {

  }

  fixVibrate () {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate
  }

  checkDeviceMotion () {
    if (!window.DeviceMotionEvent) {
      // stop
    }
  }

  onDeviceMotion (event) {
    const {x, y} = event.acceleration

    this.socket.emit('orientation-to-server', {roomId: this.roomId, motionDatas: {x, y}})
  }

  vibrate (ms = 15) {
    if (navigator.vibrate) {
      navigator.vibrate(ms)
    }
  }

  onEnter () {
    if (!this.roomId) {
      // erreur, on récupère pas l'id
      return
    }
    dbg('get room id', this.roomId)
    this.connectToSocket()
    this.bindSocketEvents()
  }

  connectToSocket () {
    dbg('connect to socket server')
    this.socket = socketIo(SERVER_URL)
  }

  bindSocketEvents () {
    this.socket.on('connect', this.onSocketConnected.bind(this))
    this.socket.on('can-start', this.onStart.bind(this))
    this.socket.on('cut', this.onCut.bind(this))
  }

  onSocketConnected () {
    dbg('socket connected, emit join-room')
    this.socket.emit('join-room', {roomId: this.roomId, from: 'mobile'})
  }

  onStart () {
    dbg('can start')
    window.addEventListener('devicemotion', this.onDeviceMotion.bind(this))
  }

  onCut (datas) {
    if (datas.type === 'bad') {
      this.vibrate(100)
    } else {
      this.vibrate(15)
    }
  }
}
