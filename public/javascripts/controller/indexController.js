app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {

    $scope.messages = [];
    $scope.players  = {};

    $scope.init = () => {
        const username = prompt('Please enter username');

        if (username)
            initSocket(username);
        else
            return false;
    };
    
    async function initSocket(username) {
        const connectOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500,
        };

        try {
            const socketUrl = await configFactory.getConfig();
            if (socketUrl.data.socketUrl !== 'http://localhost:3000') {
                connectOptions.path = "/live-balls/socket.io";
            }
            const socket = await indexFactory.connectSocket(socketUrl.data.socketUrl, connectOptions);
            //console.log('Bağlantı Yapıldı.', socket);
            socket.emit('newUser', { username });

            socket.on('newUser', (data) => {
                const messageData = {
                    type: 0, // info
                    username: data.username,
                    message: 'Katıldı',
                };

                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                scrollTop();
                $scope.$apply();
            });

            socket.on('disUser', (user) => {
                const messageData = {
                    type: 0, // info
                    username: user.username,
                    message: 'Ayrıldı',
                };

                $scope.messages.push(messageData);
                delete $scope.players[user.id];
                scrollTop();
                $scope.$apply();
            });

            socket.on('initPlayers', (users) => {
                $scope.players = users;
                $scope.$apply();
            });

            socket.on('animate', (data) => {
                const { socketId, x, y } = data;
                $('#' + socketId).animate({ 'left': x, 'top': y }, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', (data) => {
                $scope.messages.push(data);
                $scope.$apply();
                showBubbleMessage(data.socketId, data.message);
                scrollTop();
            });

            let animate = false;
            $scope.onClickPlayer = ($event) => {
                if (!animate) {
                    animate = true;
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate', { x, y });

                    $('#' + socket.id).animate({ 'left': x, 'top': y }, () => {
                        animate = false;
                    });
                }
            };

            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: 1, // user message
                    username: username,
                    message: message,
                };

                $scope.messages.push(messageData);
                $scope.message = '';

                socket.emit('newMessage', messageData);
                showBubbleMessage(socket.id, message);
                scrollTop();
            };
        } catch (e) {
            //throw Error(e);
            console.log(e);
        }
    }

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        }, 200);
    }

    function showBubbleMessage(id, msg) {
        $('#' + id).find('.message').show().html(msg);

        setTimeout(() => {
            $('#' + id).find('.message').hide().html('');
        }, 2000);
    }
}]);