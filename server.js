'use strict';

const server = require('net').createServer();
const PORT = process.env.PORT || 8000;
let id = 0;
let sockets = {};

function timestamp() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`;
}

function notifyAll(socket, msg) {
  Object.entries(sockets).forEach(([key,cs]) => {
    if(socket.id === key) return;
    cs.write(`${socket.name} ${timestamp()}: `);
    cs.write(msg);
  });
}

server.on('connection', socket => {
  socket.id = id++;

  console.log('Client connected');
  socket.write('Please type your name:');

  socket.on('data', data => {
    if(!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}!\n`);
      sockets[socket.id] = socket;
      notifyAll(socket, "Joined the newtork");
      return;
    }

    notifyAll(socket, data);
  });

  socket.on('end', () => {
    delete sockets[socket.id];

    notifyAll(socket, "Left the Network");

    console.log('Client disconnected');
  });

});

server.listen(8000, () => {
    console.log(`Server bound on port ${PORT}`);
});
