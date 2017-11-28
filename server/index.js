'use strict';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const port = 9000;

io.on('connection', (socket) => {
  console.log('The user is connected');
  socket.on('disconnect', function () {
    console.log('The user is disconnected');
  });
  socket.on('add-message', (message) => {
    io.emit('message', {type: 'new-message', text: message});
  });
});
http.listen(port, () => {
  console.log(`started on port ${port}`);
});
