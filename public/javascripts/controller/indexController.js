app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [];

    $scope.init = () => {
        const username = prompt('Please enter username');

        if (username)
            initSocket(username);
        else
            return false;
    };
    
    function initSocket(username) {
        const connectOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500,
        };

        indexFactory.connectSocket('http://localhost:3000', connectOptions)
            .then((socket) => {
                //console.log('Bağlantı Yapıldı.', socket);
                socket.emit('newUser', { username });

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: 0, // info
                        username: data.username,
                        message: 'Katıldı',
                    };

                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                socket.on('disUser', (user) => {
                    const messageData = {
                        type: 0, // info
                        username: user.username,
                        message: 'Ayrıldı',
                    };

                    $scope.messages.push(messageData);
                    $scope.$apply();
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

}]);