function calculator(config){
	
	for(var key in config){
		this[key] = config[key];
	}
	var expression = []; //to hold keyed in values
	var lastToken = ''; //last keyed in value , last token in expression Array
	var initiallyExpected = ['0','1','2','3','4','5','6','7','8','9','.','(','-'];
	var expected = initiallyExpected; //excepted array at any given instance
	var expectedArr = {
			'+' : ['0','1','2','3','4','5','6','7','8','9','(','.','*','/','%'],
			'-' : ['0','1','2','3','4','5','6','7','8','9','(','.','*','/','%'],
			'*' : ['0','1','2','3','4','5','6','7','8','9','(','.','-','%','/'],
			'/' : ['0','1','2','3','4','5','6','7','8','9','(','.','-','%','*'],
			'%' : ['0','1','2','3','4','5','6','7','8','9','(','.','-','*','/'],
			'.' : ['0','1','2','3','4','5','6','7','8','9'],
			'(' : ['0','1','2','3','4','5','6','7','8','9','.','-','('],
			')' : ['+','-','/','*','%',')'],
			'N' : ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%',')'],
			'R' : ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','%','(']
		};
	var isResult = false; //to capture result state
	var keys = document.getElementsByClassName(this.key); //elements reference
	var display = document.getElementById(this.display);
	var delKey = document.getElementById(this.del);
	var submit = document.getElementById(this.submit);

	var valid = ['0','1','2','3','4','5','6','7','8','9','+','-','/','*','%','.','(',')'];
	var plusMinus = ['+','-'];
	var other = ['*','/','%'];
	var operator = ['+','-','*','/','%'];

	//to handle key click for inputs
	var keyedIn = function(e){
		processInput(e.target.getAttribute('name'));
	};

	//functions for display starts
	var clear = function(){
		this.value = '';
	};
	var append = function(key){
		this.value += key;
	};
	var show = function(key){
		this.clear();
		this.value = key;
	};
	var clearLast = function(){
		if(this.value){
			this.value = this.value.substring(0,this.value.length-1);
		}	
	};
	//display functions ends 

	//to handle delete key
	var del = function(e){
		if(isResult){
			display.clear();
			expected = initiallyExpected;
		}
		else{
			display.clearLast();
			expression.pop();
			setExpected(expression[expression.length-1]);
		}
	};

	//to handle '=' key
	var calculate = function(e){
		processExpression();
	};

	//sets the expected array after each successful key in
	function setExpected(key){
		if(!key){
			expected = initiallyExpected;
			return 0;
		}
		if(!window.isNaN(key)){
			expected = expectedArr['N']
		}
		else{
			expected = expectedArr[key];
		}
		//console.log('expected '+expected)
	}
	
	//validate the incoming keys
	function validateInput(key){
		return (valid.indexOf(key) > -1) && (expected.indexOf(key) > -1);
	}

	function continousDotCheck(){
		var lastposition = expression.lastIndexOf('.');
		if(expression.length > 0 && lastposition > -1){
			var sub = expression.slice(lastposition+1);
			return !window.isNaN(sub.toString().replace(/[\,]/g,''));
		}
		else{
			return false;
		}
	}

	//format the error msgs
	function format(res){
		if(window.isNaN(res)){
			res = "Operation Not Possible";
		}
		return res;
	}

	function processInput(key){
		
		//console.log("key is" + key);
		if (!validateInput(key)){
			//console.log("invalid");
			return 0;
		}

		if((plusMinus.indexOf(lastToken) == 1) && (other.indexOf(key) > -1) 
			&& window.isNaN(expression[expression.length - 2])){
			//console.log("minus change bug so not entertained");
			return 0;
		}

		if(key === '.' && continousDotCheck()){
			//console.log("continous dot");
			return 0;
		}

		if((isResult && (operator.indexOf(key) < 0)) || (isResult && (window.isNaN(lastToken) 
			|| !window.isFinite(lastToken))) ){
			//console.log("clearing result");
			expression.pop();
			display.clear();
		}
		if((other.indexOf(key) > -1) && ((operator.indexOf(lastToken) > -1))){
			//change operator
			//console.log("changing operator");
			expression.pop();
			display.clearLast();
		}

		expression.push(key);
		display.value = display.value+key;
		lastToken = key;
		setExpected(key);
		isResult = false;
	}

	function processExpression(){

		if(expression.length === 0){
			return 0;
		}
		var result = '';
		var expressionStr = expression.toString().replace(/[\,]/g,'');
		try{
			result = window.eval(expressionStr);
			result = format(result);
		}
		catch(e){
			console.log("error while evaluating"+e.message);
			result = "Invalid Expression";
		}
			
		display.show(result);
		lastToken = result;
		isResult = true;

		if(!window.isNaN(result) && window.isFinite(result)){
			expression = [result];
			setExpected('R');
		}
		else{
			expression = [];
			setExpected();
		}
	}

	//self executing function which hooks the handlers to the elements
	(function hookFunctions(){
		for(var i = 0; i < keys.length; i++){
		keys[i].onclick = keyedIn;
	}

	display.clear = clear.bind(display);
	display.append = append.bind(display);
	display.show = show.bind(display);
	display.clearLast = clearLast.bind(display);

	delKey.onclick = del;
	submit.onclick = calculate;
	})();
}