const http = require('http')
const SocketServer = require('ws').Server
const fs = require('fs')
const PORT = process.env.PORT || 3333

var clientToken = null

var server = http.createServer((req, res) => {
  if (req.url === '/api') {
    res.setHeader('content-type', 'text/html')
    fs.createReadStream(__dirname + '/index.html').pipe(res)
  } else if (req.url === '/getToken') {
    clientToken = Math.random().toString()
    res.end(clientToken)
  } else {
    res.end('go away \n')
  }
})

server.listen(PORT, function() {
  console.log(`Listening on ${PORT} with WebSocket support`)
})

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  const fullPath = ws.upgradeReq.url
  const token = fullPath.replace(/\/api\//, '')
  console.log(token)
  if (token !== clientToken) {
    ws.close()
  }
  console.log('Client connected')
  ws.on('close', () => console.log('Client disconnected'))
})

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  })
}, 1000)
