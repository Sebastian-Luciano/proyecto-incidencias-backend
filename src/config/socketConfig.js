const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('newIncidence', (incidence) => {
      io.emit('incidenceUpdate', incidence);
    });
  });
};

export default setupSocket;