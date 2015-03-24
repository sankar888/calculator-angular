calc.controller('NumberKeysController', ['NumberKeysModel','CalculatorController', function(nm, cc){

	this.model = nm;

	this.numberKeyedIn = function(key){
		cc.numberKeyedIn(key);
	}
}]);