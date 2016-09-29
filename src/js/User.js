class User {
  constructor () {
    this.name = null
    this.side = null
    this.image = null
  }

  setName (name) {
    this.name = name
  }

  setSide (side) {
    this.side = side
  }

  setPhoto (photo) {
    this.photo = photo
  }
}

export default new User()
