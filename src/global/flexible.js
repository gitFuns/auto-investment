(function(window) {
  let tid = null
  let docEle = document.documentElement

  function setRem() {
    let newBase
    let visualView = docEle.clientWidth
    docEle.style.maxWidth = '750px'
    docEle.style.minWidth = '320px'
    if (visualView <= 750) {
      newBase = 100 * visualView / 750
    } else {
      newBase = 100
      docEle.style.margin = '0 auto'
    }
    docEle.style.fontSize = newBase + 'px'
  }

  window.addEventListener('resize', function() {
    tid && window.clearTimeout(tid)
    tid = setTimeout(setRem)
  }, false)

  document.addEventListener('DOMContentLoaded', function() {
    const FastClick = require('fastclick')

    FastClick.attach(document.body)
  }, false)

  window.getAuthentication = function (argument) {
    window.bridge = Object.create(null)
    window.bridge.authenticationString = argument['authenticationString']
  }

  setRem()
})(window)
