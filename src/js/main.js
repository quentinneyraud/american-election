import '../styles/core.scss'
import domready from 'domready'
import Promise from 'bluebird'
import 'gsap'

import Loader from './Loader'
import LoginPage from './LoginPage'
import GamePage from './GamePage'

if (!__PROD__) {
  Promise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
  })
}

const loader = new Loader()
const loginPage = new LoginPage()
const gamePage = new GamePage()

dbg(gamePage)

domready(() => {
  loader.hide(loginPage.onEnter.bind(loginPage))
})

if (module.hot) {
  module.hot.accept()
}
