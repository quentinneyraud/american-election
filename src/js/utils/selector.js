export const selectClass = (className, all = false) => {
  const selection = document.getElementsByClassName(className)
  return (all) ? selection : selection[0]
}

export const selectId = (id) => {
  return document.getElementById(id)
}
