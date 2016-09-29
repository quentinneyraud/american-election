import '../styles/core.scss'
import WebFont from 'webfontloader'
import domready from 'domready'
// import Promise from 'bluebird'
import 'gsap'

import Loader from './Loader'
import SignUpPage from './pages/SignUpPage'
import GamePage from './pages/GamePage'
import MobilePage from './pages/MobilePage'
import {isMobile, selectId} from './utils/index'

// Promise config
/* if (!__PROD__) {
  Promise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
  })
} */

const loader = new Loader()

// callback of loader hide
let onAllAssetsReady = null

// Define loader hide callback & hide unused sections according support
if (isMobile()) {
  const mobilePage = new MobilePage()
  onAllAssetsReady = mobilePage.onEnter.bind(mobilePage)

  selectId('signup').parentNode.removeChild(selectId('signup'))
  selectId('game').parentNode.removeChild(selectId('game'))
} else {
  // create objects
  const gamePage = new GamePage(loader)
  const signUpPage = new SignUpPage()
  signUpPage.setLeaveCallback(gamePage.onEnter.bind(gamePage))

  onAllAssetsReady = signUpPage.onEnter.bind(signUpPage)

  selectId('mobile').parentNode.removeChild(selectId('mobile'))
}

// Wait dom ready & fonts ready event
const states = [
  {
    eventType: 'domReady',
    state: false
  },
  {
    eventType: 'fontsReady',
    state: false
  }
]
const start = () => {
  if (!states.some(element => !element.state)) {
    loader.hide(onAllAssetsReady)
  }
}

// wait dom ready
domready(() => {
  states.filter(element => element.eventType === 'domReady')[0].state = true
  start()
})

// load fonts
WebFont.load({
  google: {
    families: ['Montserrat:400,700'],
    text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?!.,>%éèà1234567890'
  },
  classes: false,
  fontactive: () => {
    states.filter(element => element.eventType === 'fontsReady')[0].state = true
    start()
  }
})

if (module.hot) {
  module.hot.accept()
}
