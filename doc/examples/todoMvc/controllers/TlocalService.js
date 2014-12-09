
defineClass("TlocalService", "core.events.TeventDispatcher", { 

	STORAGE_ID: "panjs_todos",

	constructor: function(args){
		this._super.constructor.call(this,args);				
	},
	
	get: function (success, failure) {
		var result = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
		if (defined(success))
			success(result);
	},

	put: function (data, success, failure) {
		
		localStorage.setItem(this.STORAGE_ID, JSON.stringify(data));
		if (defined(success))
			success(null);
	}
});
