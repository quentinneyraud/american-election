import '../styles/core.scss'
import domready from 'domready'
import Promise from 'bluebird'

const dbg = debug('app:main')

if (!__PROD__) {
  Promise.config({
    warnings: true,
    longStackTraces: true,
    cancellation: true,
    monitoring: true
  })
}

domready(() => {
  dbg('Ok')
})

if (module.hot) {
  module.hot.accept()
}
