'use strict'

const { ipcRenderer } = require('electron')
const windowNames = require('../global-constants').windowNames

windowNames.forEach(constant =>
  document.getElementById(`${constant}-btn`).addEventListener('click', () => {
  ipcRenderer.send(constant)
}));
