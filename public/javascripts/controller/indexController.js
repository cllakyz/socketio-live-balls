app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    const connectOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 500,
    };

    indexFactory.connectSocket('http://localhost:30000', connectOptions)
        .then((socket) => {
            console.log('Bağlantı Yapıldı.', socket);
        })
        .catch((err) => {
            console.log(err);
        });
}]);