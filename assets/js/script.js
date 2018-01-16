angular
        .module('myApp', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angucomplete-alt', 'angular-loading-bar'])
        .config(function(){

        });

// appController.$inject   = ['appFactory', 'ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angucomplete-alt'];




    // function appController(appFactory, $scope, $filter, $http, appFactory){
    //     function airlines(){
    //         $http.get(urlAirline).then(function(response){
    //             vm.airlines     = response.data;
    //         });
    //     }

    //     // $http.get(urlAirline).then(function(response)
    //     // {
    //     //     $scope.airlines     = response.data;

    //     //     // JSON get Airlines Logos
    //     //     $scope.logos        = function(id)
    //     //     {
    //     //         var url         = "https://images.kiwi.com/airlines/32/" + id + ".png";
    //     //         appFact

    //     //     }
    //     // });
    // }

        // angular
        //         .module('myApp', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'angucomplete-alt'])
        //         .controller('appController', appController);
        
        // appController.$inject   = ['appFactory'];