calc.controller('NumberKeysController', ['$scope', 'NumberKeysModel', function($scope, nm){

	this.model = nm;

	this.numberKeyedIn = function(key){
		$scope.$emit('numberKeyedIn',key);
	}
}]);