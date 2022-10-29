const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000
const server = app.listen(PORT,() => console.log(` Server running on port ${PORT}`))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let connectedSockets = new Set()

io.on('connection',onConnect)

function onConnect(socket) {
    console.log(socket.id)
    connectedSockets.add(socket.id)

    io.emit('clients-total', connectedSockets.size)


    socket.on('disconnect', () => {
        console.log('Socket disconnected: ',socket.id)
        connectedSockets.delete(socket.id)
        io.emit('clients-total', connectedSockets.size)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat', data)

    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}