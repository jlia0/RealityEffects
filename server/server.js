const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const app = express()
const server = http.Server(app)
const io = socketio(server)

app.set('io', io)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/script.js'))
})

server.listen(4000, () => {
    console.log('listening 4000')
})

app.get('/add', (req, res) => {
    let data = req.query.data;
    if (!data) return false
    req.app.get('io').emit('add', data)
    res.send('OK')
})

io.on('connection', (socket) => {
    console.log('connected')

})





