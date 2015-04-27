uses("model.Model3");
defineClass("Model2", "core.model.Model",
{ 
    $prop1: null,
    $prop2: null,
  	$model3: null,

	constructor: function(args) { 

	  	Model2._super.constructor.call(this,args);	
	  	this.model3 = new Model3({owner:this});
    },
   

    getData: function(){
    	return this._super.getData.call(this);
    }


});
