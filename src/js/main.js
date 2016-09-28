import '../styles/core.scss'
import WebFont from 'webfontloader'
import domready from 'domready'
import Promise from 'bluebird'
import 'gsap'

import Loader from './Loader'
import SignUpPage from './SignUpPage'
import GamePage from './GamePage'

// Promise config
if (!__PROD__) {
  Promise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
  })
}

// create objects
const loader = new Loader()
const gamePage = new GamePage(loader)
const signUpPage = new SignUpPage()
signUpPage.setLeaveCallback(gamePage.onEnter.bind(gamePage))

// Wait dom ready & fonts ready event
const state = {domReady: false, fontsReady: false}
const start = () => {
  if (state.domReady && state.fontsReady) {
    loader.hide(signUpPage.onEnter.bind(signUpPage))
  }
}

// wait dom ready
domready(() => {
  state.domReady = true
  start()
})

// load fonts
WebFont.load({
  google: {
    families: ['Montserrat:400,700'],
    text: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?!.,éèà1234567890'
  },
  classes: false,
  fontactive: () => {
    state.fontsReady = true
    start()
  }
})

if (module.hot) {
  module.hot.accept()
}
