
defineClass("Model3", "core.model.Model",
{ 
	$prop3: 144,

	constructor: function(args) { 

	  	Model3._super.constructor.call(this,args);	

    },

    getData: function(){
    	return this._super.getData.call(this);
    }

});
