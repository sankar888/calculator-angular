calc.controller('OperatorKeysController', ['OperatorKeysModel','CalculatorController', function(om, cc){

	this.model = om;

	this.keyedIn = function(key){
		switch (key){

			case '=' : 	cc.submitKeyedIn();
					 	break;
					 	
			case 'C' : 	cc.deleteKeyedIn();
						break;

			default :   cc.operatorKeyedIn(key);
						break;
		}
	}
}]);