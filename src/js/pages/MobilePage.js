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
  }

  initializeElements () {
    this.$els = {

    }
  }

  initializeEvents () {
  }

  initializeGsap () {

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
    this.socket.on('room-joined', this.onSocketRoomJoined.bind(this))
  }

  onSocketConnected () {
    dbg('socket connected, emit join-room')
    this.socket.emit('join-room', {roomId: this.roomId})
  }

  onSocketRoomJoined () {
    dbg('room joined, emit orientation')
    this.socket.emit('orientation-to-server', {roomId: this.roomId, orientationDatas: 'test'})
  }
}
