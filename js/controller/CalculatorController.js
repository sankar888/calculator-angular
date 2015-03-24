calc.controller('CalculatorController', ['CalculatorModel','DisplayController', function(CalculatorModel, DisplayController){
	this.name  = 'hai',
	this.model = CalculatorModel;
	this.numberKeyedIn = function(key){
		console.log(key);
	};

	this.deleteKeyedIn = function(){

	};

	this.submitKeyedIn = function(){

	};

	this.operatorKeyedIn = function(key){
		console.log(key);
	}
}]);