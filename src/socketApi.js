const socketio = require('socket.io');
const io = socketio();

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
        users[socket.id].position.x = data.x;
        users[socket.id].position.y = data.y;
        socket.broadcast.emit('animate', { socketId: socket.id, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });
});

module.exports = socketApi;