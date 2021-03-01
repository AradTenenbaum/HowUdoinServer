const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;


const runServer = (app) => {
    const server = http.createServer(app);
    const io = socketio(server, {cors: {origin: "*"}});

    io.on('connect', (socket) => {
        console.log('User Connected');


        socket.on('disconnect', () => {
            console.log('Disconnect');
        });
    });

    server.listen(PORT, () => console.log(`Server started on ${PORT}`));
};

module.exports = runServer;