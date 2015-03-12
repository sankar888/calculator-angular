calc.controller('CalculatorController', function(validator){
		console.log("validator"+this.validator);
		this.validator = validator;
		this.expression = []; //to hold keyed in values
		this.lastToken = ''; //last keyed in value , last token in expression Array
		this.isResult = false; //to capture result state

		var initiallyExpected = ['0','1','2','3','4','5','6','7','8','9','.','(','-'];
		this.valid = ['0','1','2','3','4','5','6','7','8','9','+','-','/','*','^','.','(',')'];
		this.expected = initiallyExpected; //excepted array at any given instance
		
		var operator = ['+','-','*','/','^'];
		var numberArr = ['0','1','2','3','4','5','6','7','8','9'];
		var expectedArr = {
			'O' : numberArr.concat(operator).concat(['(','.']),
			'.' : numberArr,
			'(' : numberArr.concat(['.','-','(']),
			')' : ['+','-','/','*','^',')'],
			'N' : numberArr.concat(operator).concat([')','.']),
			'R' : numberArr.concat(operator).concat(['(','.'])
		};

		this.del = function(e){
			if(this.isResult){
				//this.display.clear();
				this.expression.length = 0;
				this.expected = initiallyExpected;
			}
			else{
				//this.display.clearLast();
				this.expression.pop();
				this.setExpected(this.expression[this.expression.length-1]);
			}
		};

		//sets the expected array after each successful key in
		this.setExpected = function(key){
			if(!key){
				this.expected = initiallyExpected;
				return 0;
			}
			if(this.validator.isNumber(key)){
				key = 'N';
			}
			else if (this.validator.isOperator(key)){
				key = 'O';
			}
			this.expected = expectedArr[key];
			//console.log('expected '+expected)
		};

			/**converts the given expression to rpn format*/
		var convertToRPN = function(expression){
			var precedenceMap = {
				'^' : 4, 
				'/' : 3,
				'*'	: 3,
				'+' : 2,
				'-' : 2,
				'(' : 1
			};
			var operands = ['+','-','/','*','^'];
			var associativeArr = ['/','-','*','+','^'];
			var output = [];
			var opArray = [];
			var token, lastOpIndex, lastOpPrecedence, incomingOpPrecedence;
			
			for(var i = 0; i < expression.length; i++)
			{
				token = expression[i];
				lastOpIndex = opArray.length-1;
				lastOpPrecedence = precedenceMap[opArray[lastOpIndex]];
				incomingOpPrecedence = precedenceMap[token];
						
				if(token && !window.isNaN(token))
				{
					output.push(token);
				}
				else if(token && opArray.length > 0 && token === ')')
				{
					while(opArray[opArray.length-1] != '(')
					{
						output.push(opArray.pop());
					}
					opArray.pop();
				}
				else if(token && opArray.length > 0 && operands.indexOf(token) > -1 && ((incomingOpPrecedence < lastOpPrecedence) ||
						 (lastOpPrecedence === incomingOpPrecedence && associativeArr.indexOf(token) > -1)))
				{
					output.push(opArray.pop());
					opArray.push(token);
				}
				else
				{
					opArray.push(token);
				}
				//console.log("token is "+token+" output"+ output.toString()+" oparr "+opArray.toString());
			}
			//joins the two arr
			output = output.concat(opArray.reverse());
			console.log("output is "+output);
			return output;
		};

		/**
			pop up operands for evaluating rpn
		*/
		var popOperands = function(output){
			var op = {};
			op.second = Number(output.pop());
			op.first = Number(output.pop());
			return op;
		}
		/**
			evaluates the rpn expression
		*/
		var evaluateRPN = function(rpnExpression){

			var output = [];
			var first, second, result, op;
			for(var i = 0; i < rpnExpression.length; i++){
				result = rpnExpression[i];
				switch (result) {

					case '+' :  op = popOperands(output);
								result = op.first + op.second;
								output.push(result);
								break;

					case '-' :  op = popOperands(output);
								result = op.first - op.second;
								output.push(result);
								break;

					case '*' :  op = popOperands(output);
								result = op.first * op.second;
								output.push(result);
								break;

					case '/' :  op = popOperands(output);
								console.log(op.first +'---'+ op.second);
								result = op.first / op.second;
								output.push(result);
								break;

					case '^' :  op = popOperands(output);
								result = Math.pow(op.first,op.second);
								output.push(result);
								break;

					default :  output.push(result);
							   break;
				}
			}
			if(output.length > 1){
				throw new EvalError('Error while evaluating expression', 'calculator.js');
			}
			return output.pop();
		};

		this.evaluate = function(expression){
			var rpn = convertToRPN(expression);
			return evaluateRPN(rpn);
		};

		this.processInput = function(key){
		
		this.validator.key = key;
		this.validator.expected = this.expected;
		this.validator.expression = this.expression;
		this.validator.lastToken = this.lastToken;

		if(!this.validator.validForProcessing()){
			return 0;
		}

		if(this.isResult && this.validator.clearResult()){
			this.expression.pop();
			//this.display.clear();
		}
		else if(this.validator.isContinousOperator()){
			this.expression.pop();
			//this.display.clearLast();
		}

		this.expression.push(key);
		//this.display.append(key);
		this.lastToken = key;
		this.setExpected(key);
		this.isResult = false;
	};

	this.processExpression = function(){
		if(this.expression.length === 0 || this.validator.isBracesMisMatch(this.expression)){
			console.log('braces mismatch');
			return 0;
		}
		this.expression = this.validator.formExpression(this.expression);
		var result = '';
		//var expressionStr = this.validator.arrToString(this.expression);
		try{
			//result = window.eval(expressionStr);
			result = this.evaluate(this.expression);
			result = this.validator.format(result);
		}
		catch(e){
			console.log("error while evaluating"+e.message);
			result = "Invalid Expression";
		}
			
		//this.display.show(result);
		this.lastToken = result;
		this.isResult = true;

		if(this.validator.isNumber(result)){
			this.expression.length = 0;
			this.expression.push(result);
			this.setExpected('R');
		}
		else{
			this.expression.length =0;
			this.expression.push(result);
			this.setExpected();
		}
	};
});