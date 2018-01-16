angular
        .module('myApp')
        .directive('appDirective', appDirective);

function appDirective(){
    return{
        link: function(scope, element, attrs){
            element.bind('error', function(){
                if( attrs.src != attrs.appDirective ){
                    attrs.$set('src', attrs.appDirective);
                }
            });
        }
    }
}