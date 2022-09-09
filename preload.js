
// global.kinect = require('kinect-azure')
// global.opencv = require('../realityedit/public/opencv');
// global.files = require('fs').promises;

// console.log(global, window)

// preload with contextIsolation enabled
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
    require: (callback) => window.require(callback)
})