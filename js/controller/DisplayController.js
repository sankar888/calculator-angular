calc.controller('DisplayController', function(){

	this.model = {value : 'hai'};

	this.show = function(key){
		this.model.value = key;
	},

	this.clear = function(){
		this.model.value = '';
	},

	this.append = function(key){
		this.model.value += key;
	},

	this.clearLast = function(){
		var val = this.model.value;
		if(val.length > 0){
			val = val.substring(0,val.length-1);
		}
		this.show(val);
	}

});