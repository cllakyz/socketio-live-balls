const env = require('../../../config/env.json')[process.env.NODE_ENV || 'development'];

app.factory('configFactory', ['$http', ($http) => {
    const getConfig = () => {
        return new Promise((resolve, reject) => {
            $http
                .get(env.path + 'getEnv')
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    return {
        getConfig
    }
}]);