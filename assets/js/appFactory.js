angular
        .module('myApp')
        .factory('appFactory', appFactory);

function appFactory($http, $q){
    return {
        getAir: getAir
    };

    function getAir(){
        return  $http.get('https://api.skypicker.com/airlines')
                .then(getAirComplete)
                .catch(getAirFailed);
        
        function getAirComplete(response){
            return response;
        }

        function getAirFailed(error){
            console.log('XHR Failed for getAir.' + error.data);
        }
    }
}