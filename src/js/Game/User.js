import {selectId} from '../utils/index'

export default class User {
  constructor (name, percentage, id) {
    this.name = name
    this.percentage = percentage

    this.domElement = selectId(id)
    this.setHtmlName()
    this.setHtmlPercentage()
  }

  setHtmlName () {
    this.domElement.querySelector('.game-container-score-candidat').innerText = this.name
  }

  setHtmlPercentage () {
    this.domElement.querySelector('.game-container-score-percentage').innerHTML = `${this.percentage}<span>%</span>`
  }

  decrementPercentage (value = 1) {
    console.log(this.name + ' - ' + value)
    this.percentage-=value
    this.setHtmlPercentage()
  }

  incrementPercentage (value = 1) {
    console.log(this.name + ' + ' + value)
    this.percentage+=value
    this.setHtmlPercentage()
  }
}
