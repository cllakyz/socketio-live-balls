const socketio = require('socket.io');

const NODE_ENV = process.env.NODE_ENV || 'development';
let io;
if (NODE_ENV !== 'development') {
    const envData = require('../config/env.json')[NODE_ENV];
    io = socketio(envData.socketUrl, { path: '/live-balls/socket.io' });
} else {
    io = socketio();
}

const socketApi = {
    io
};

const users = { };

// helpers
const randomColor = require('../helpers/randomColor');


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0,
            },
            color: randomColor()
        };

        users[socket.id] = Object.assign(data, defaultData);

        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);
    });

    socket.on('animate', (data) => {
        try {
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;
            socket.broadcast.emit('animate', { socketId: socket.id, x: data.x, y: data.y });
        } catch (e) {
            throw Error(e);
        }
    });

    socket.on('newMessage', (data) => {
        const messageData = Object.assign({ socketId: socket.id }, data);
        socket.broadcast.emit('newMessage', messageData);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });
});

module.exports = socketApi;