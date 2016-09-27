import '../styles/core.scss'
import domready from 'domready'
import Promise from 'bluebird'
import 'gsap'

import Loader from './Loader'
import LoginPage from './LoginPage'

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

domready(() => {
  loader.hide(loginPage.onEnter.bind(loginPage))
  // TweenMax.set('.road', {rotationX: 30, transformPerspective: 130, xPercent: -50})
  // TweenMax.to('.lines', 4, {yPercent: -50, repeat: -1, ease: Linear.easeNone})
})

if (module.hot) {
  module.hot.accept()
}
