calc.controller('DisplayController',['$scope','DisplayModel', function($scope, dm){

	this.model = dm;

	var show = function(event,key){
		this.model.value = key;
	}.bind(this);
	$scope.$on('display',show);

}]);