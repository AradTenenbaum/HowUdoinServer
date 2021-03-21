const socketio = require('socket.io');
const http = require('http');

const {addUser, removeUser, getUser, getFriendsConnected} = require('./userSocket');
const PORT = process.env.PORT || 5000;


const runServer = (app) => {
    const server = http.createServer(app);
    const io = socketio(server, {cors: {origin: "*"}});

    io.on('connect', (socket) => {
        console.log('User Connected');
        // Join chat action
        socket.on('join', ({ username, friends }, callback) => {
            const user = addUser({id: socket.id, username, friends});
            const friendsConnected = getFriendsConnected(friends);
            // Send the user all his connected friends
            socket.emit('friendsConnected', {friendsConnected});
            // Send all friends that he is connected
            friendsConnected.map((friend) => io.to(friend.id).emit('friendConnected', { username, id: socket.id }));
            // End with callback
            // callback();
        });

        socket.on('sendMessage', ({ toUserId, message }, callback) => {
            const user = getUser(socket.id);
            const userto = getUser(toUserId);
            if(message.length > 0) {
                io.to(toUserId).emit('message', {usernameFrom: user.username, usernameTo: userto.username, message});
            }
            // callback();
        });

        // Disconnect action
        socket.on('disconnect', () => {
            console.log('Disconnect');

            const user = removeUser(socket.id);

            if(user) {
                const friendsConnected = getFriendsConnected(user.friends);
                friendsConnected.map((friend) => io.to(friend.id).emit('friendDisconnected', { username: user.username, id: socket.id }));
            }
        });
    });

    server.listen(PORT, () => console.log(`Server started on ${PORT}`));
};

module.exports = runServer;