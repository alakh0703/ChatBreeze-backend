const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*', // This allows any origin, which can be a security risk in a production environment. You should specify your actual production origin.
  },
});

const sockets = require('./sockets');

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

sockets.listen(io);
