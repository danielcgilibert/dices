import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { PORT } from './config.js'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
})

app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', socket => {
  // send a message to the client
  socket.emit('message', ['hola', 'mundo'])

  // receive a message from the client
  socket.on('new-message', (...args) => {
    console.log('entra')

    console.log('hello from client', args)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
