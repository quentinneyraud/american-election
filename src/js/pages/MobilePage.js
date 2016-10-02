import socketIo from 'socket.io-client'
import {getQueryVariable} from '../utils/index'
import {QUERY_PARAMETER_NAME, SERVER_URL} from '../config'

const dbg = debug('app:MobilePage')

export default class MobilePage {
  constructor () {
    dbg('Initialize MobilePage')
    this.socket = null
    this.roomId = getQueryVariable(QUERY_PARAMETER_NAME)

    this.initializeElements()
    this.initializeEvents()
    this.initializeGsap()
    this.xStart = null
    this.yStart = null
  }

  initializeElements () {
    this.$els = {

    }
  }

  initializeEvents () {
  }

  initializeGsap () {

  }

  onDeviceMotion (event) {
    if (!this.xStart && !this.yStart) {
      this.xStart = event.gamma
      this.yStart = event.beta
    }
    this.socket.emit('orientation-to-server', {roomId: this.roomId, motionDatas: {
      x: event.gamma - this.xStart * 10,
      y: event.beta - this.yStart * 10
    }})
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
  }

  onSocketConnected () {
    dbg('socket connected, emit join-room')
    this.socket.emit('join-room', {roomId: this.roomId, from: 'mobile'})
  }

  onStart () {
    dbg('can start')
    window.addEventListener('deviceorientation', this.onDeviceMotion.bind(this))
  }
}
