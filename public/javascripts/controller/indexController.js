app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

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
                socket.emit('newUser', { username })
            })
            .catch((err) => {
                console.log(err);
            });
    }

}]);