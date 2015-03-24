calc.controller('OperatorKeysController', ['$scope','OperatorKeysModel', function($scope, om){

	this.model = om;

	this.keyedIn = function(key){
		switch (key){

			case '=' : 	$scope.$emit('submitKeyedIn');
					 	break;
					 	
			case 'C' : 	$scope.$emit('deleteKeyedIn');
						break;

			default :   $scope.$emit('operatorKeyedIn', key);
						break;
		}
	}
}]);