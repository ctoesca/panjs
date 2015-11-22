
defineClass("TlocalService", "panjs.core.events.TeventDispatcher", { 

	STORAGE_ID: "panjs_todos",

	constructor: function(args){
		this._super.constructor.call(this,args);				
	},
	_load: function(success, failure){
		var data = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
		return new TarrayCollection( {key: "id", data:data } );
	},
	_save: function(data, success, failure){
		localStorage.setItem(this.STORAGE_ID, JSON.stringify(data));
		return data;
	}

});
