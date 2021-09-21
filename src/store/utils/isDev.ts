// https://github.com/electron/electron/issues/7714#issuecomment-549579114
// Works now for Electron, needs to be refactored for later mobile use unless we want to
// add --dev flag to that call too
const remote = window && window.require ? window.require('electron').remote : null

function checkIfDev() {
  return !!remote && remote.process.argv[2] == '--dev'
}

export const isDev = checkIfDev()
