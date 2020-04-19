const socketio = require('socket.io');
const io = socketio();

const socketApi = {
    io
};

const users = { };

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0,
            }
        };

        users[socket.id] = Object.assign(data, defaultData);

        socket.broadcast.emit('newUser', users[socket.id]);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });
});

module.exports = socketApi;