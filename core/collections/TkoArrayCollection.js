
/*** 
Tobject 
***/

defineClass("TkoArrayCollection", "panjs.core.collections.TarrayCollection", {
	  
	constructor: function(args) { 
		TkoArrayCollection._super.constructor.call(this,args);
    this._source = ko.observableArray();

  	}
});

