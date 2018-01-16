angular
        .module('myApp')
        .filter('dateRange', dateRange)
        .controller('appController', appController);

function appController($scope, $http, $timeout, $filter, appFactory){
    var vm          = this;
    vm.disabled     = true;
    vm.searchText   = "Search";
    vm.uri          = "https://api.skypicker.com/flights?flyFrom=";
    vm.showHide     = true;
    vm.getDate      = getDate;
    vm.getTransit   = getTransit;
    vm.sort         = "price"; //default sort by price

    // input
    $scope.placeFrom    = function(selected){
        placeFrom       = selected.originalObject.id;
    }

    $scope.placeTo      = function(selected){
        placeTo         = selected.originalObject.id;
    }

    // Datepicker
    $scope.format           = "dd/MM/yyyy";
    $scope.altInputFormats  = ['d!/M!/yyyy'];

    $scope.MinAndMax  = function(){
      $scope.dateToOptions.minDate  = new Date().setDate( new Date($scope.dateFrom).getDate() + 1 );
    };

    $scope.dateFromOptions  = {
      formatYear: 'yy',
      startingDay: 1,
      minDate: new Date()
    };

    $scope.dateToOptions    = {
      formatYear: 'yy',
      startingDay: 1,
      minDate: new Date()
    };

    function getTransit(value, key)
    {
        var result  = value.route,
            args    = result.length,
            count   = 1,
            bracket = "";

            if( count + 1 > args ) return
                var start       = moment.unix(result[key].dTime),
                    end         = moment.unix(result[key - 1].aTime),
                    startDate   = new Date(start);
                    endDate     = new Date(end);

                    duration    = moment.preciseDiff(start, end);
                    bracket     = duration;

                //console.log( startDate + " - " + endDate + " = " + duration);
                count++;

        return bracket;
    }

    function getDate(date1, date2)
    {
        var first       = moment.unix(date1).format('YYYY-MM-DD HH:mm:ss');
        var second      = moment.unix(date2).format('YYYY-MM-DD HH:mm:ss');
        return moment.preciseDiff(first, second);
    }

    vm.searchStr    = function(sortKey){
        // Set Sort
        if( sortKey == null )
        {
            vm.sort     = "price";
        }
        else
        {
            vm.sort     = sortKey;
        }
        
        console.log(vm.sort);

        var addDays         = new Date($scope.dateFrom),
            dummyDateTo     = addDays.setDate(addDays.getDate() + 2);

        if( $scope.dateFrom == null )
        {
            $scope.error    = "Oops! Something wrong with date";
            return false;
        }

        if( $scope.dateTo == null )
        {
            var dateTo      = $filter('date')(dummyDateTo, "dd/MM/yyyy"),
                dateToUTC   = new Date(dummyDateTo);
        }
        else
        {
            var dateTo      = $filter('date')($scope.dateTo, "dd/MM/yyyy"),
                dateToUTC   = new Date($scope.dateTo);
        }

        var dateFrom        = $filter('date')($scope.dateFrom, "dd/MM/yyyy"),
            dateFromUTC     = new Date($scope.dateFrom);

        // Check same date
        if( dateFromUTC == dateToUTC )
        {
            $scope.error   = "Oops! Something wrong with date";
            return false;
        } else if( dateFromUTC > dateToUTC )
        {
            $scope.error   = "Oops! Something wrong with date";
            return false;
        }

        if( vm.flightType == 0 )
        { // Oneway flight
            $http.get(vm.uri + placeFrom + "&to=" + placeTo + "&dateFrom=" + dateFrom + "&dateTo=" + dateFrom + "&partner=steerawaytravels&partner_market=us&limit=200&sort=" + vm.sort)
            .then(function(response){
                vm.flight       = response.data.data;
            });

            $http.get('https://api.skypicker.com/airlines')
            .then(function(item){
                vm.airlines     = item.data;
            })
        }
        else if( vm.flightType == 1 )
        { // Return flight
            var addDate = new Date($scope.dateTo),
                newDate = addDate.setDate( addDate.getDate() + 2 );
                addon   = $filter('date')(newDate, "dd/MM/yyyy");

            $http.get(vm.uri + placeFrom + "&to=" + placeTo + "&dateFrom=" + dateFrom + "&dateTo=" + dateFrom + "&returnFrom=" + dateTo + "&returnTo=" + addon + "&passengers=" + $scope.passenger + "&partner=steerawaytravels&partner_market=us&limit=200&sort=price&asc=1")
            .then(function(response){
                vm.searchText   = "Searching";
                vm.flight       = response.data.data;
            });

            $http.get('https://api.skypicker.com/airlines')
            .then(function(item){
                vm.airlines     = item.data;
            })
        }
        else
        {
            vm.error    = "Something wrong..";
        }

        // $http.get('https://api.skypicker.com/flights?flyFrom=CGK&to=LGA&dateFrom=15/01/2018&dateTo=17/01/2018&partner=steerawaytravels&partner_market=us&limit=200&sort=price&asc=1')
        // .then(function(response){
        //     vm.searchText   = "Searching";
        //     vm.flight       = response.data.data;
        // });
    }
}

function dateRange()
{
    return function(conversations, start_date, end_date)
    {
        var result = [];

        // date filters
        var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;

        if( end_date == null )
        {
            var start       = new Date(start_date),
                end_date    = start.setDate( start.getDate() + 2 );
        }
        else
        {
            var end_date    = end_date;
            // var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();
        }

        // if the conversations are loaded
		if (conversations && conversations.length > 0)
		{
			$.each(conversations, function (index, conversation)
			{
                var conversationDate    = new Date(conversation.dTime * 1000);
                var endTrip             = new Date(conversation.aTime * 1000);
                var startDate           = new Date(start_date);
                var endDate             = new Date(end_date);

                //console.log(conversationDate + " - " + start_date + " - " + end_date);

				if (conversationDate >= start_date && endTrip >= end_date)
				{
                    result.push(conversation);
				}
			});

			return result;
		}
    };
}