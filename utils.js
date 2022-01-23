// Select DOM elements from classes
const selectDomElements = (classes) => {
  // Convert string to array
  const arr = classes.replace(/\s/g, '').split(',')

  const dom = {}
  arr.forEach(val => {
    dom[val] = document.querySelector(`.${val}`)
    if (!dom[val]) throw Error(`Class ${val} does not exist`)
  });

  return dom
}