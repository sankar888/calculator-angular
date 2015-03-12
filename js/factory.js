calc.service('validator', function(){

	this.valid = ['0','1','2','3','4','5','6','7','8','9','+','-','/','*','^','.','(',')'];
	this.operator = ['+','-','*','/','^'];
	this.key = '';
	this.expression = [];
	this.lastToken = '';
	this.expected = '';

	this.isValidInput  = function(key){
		return this.valid.indexOf(key) > -1;
	};

	this.isOperator = function(key){
		return this.operator.indexOf(key) > -1;
	};

	this.isNumber = function(key){
		return key && window.isFinite(key);
	};

	this.isContinousOperator = function(){
		return this.isOperator(this.key) && this.isOperator(this.lastToken);
	};

	this.isDot = function(key){
		return '.' === key;
	};

	this.canPass = function(key){
		return this.isValidInput(key) && this.expected && (this.expected.indexOf(key) > -1);
	};
	
	this.arrToString = function(arr){
		return arr.toString().replace(/[\,]/g,'');
	};

	this.illegalDot = function(){
		var lastposition = this.expression.lastIndexOf('.');
		if(this.expression && this.expression.length && lastposition > -1){
			var sub = this.expression.slice(lastposition+1);
			return this.isNumber(this.arrToString(sub));
		}
		else
		{
			return false;
		}
	};

	this.validForProcessing = function(){
		return this.canPass(this.key) && !(this.isDot(this.key) && this.illegalDot()); 
	};

	this.clearResult = function(){
		return this.isNumber(this.key) || !this.isNumber(this.lastToken);
	};

	this.format = function(res){
		if(window.isNaN(res)){
			res = 'Operation Not Possible';
		}
		return res;
	};

	this.isBracesMisMatch = function(expression){
		var openCount = 0, 
			closeCount =0;
		if(expression && expression instanceof Array){
			var token;
			for(var i = 0; i < expression.length; i++){
				token = expression[i];
				if('(' === token ){
					openCount++;
				}else if( ')' === token){
					closeCount++;
				}
			}	
		}
		return (openCount !== closeCount);
	};

	this.formExpression = function(expression){
		var temp = [],
			op = [],
			key;
		for(var i=0; i<expression.length; i++){
			key = expression[i];
			if(key === '-' || key==='.' || window.isFinite(key)){
				temp.push(key);
			}else{
				if(temp.length > 0){
					op.push(this.arrToString(temp));
					temp.length = 0;
				}
				op.push(key);
			}
		}
		if(temp.length > 0){
			op.push(this.arrToString(temp));
		}
		return op;
	};
});