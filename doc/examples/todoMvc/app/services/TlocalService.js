
defineClass("TlocalService", "core.events.TeventDispatcher", { 

	STORAGE_ID: "panjs_todos",

	constructor: function(args){
		this._super.constructor.call(this,args);				
	},
	_load: function(){
		this.todos = new TarrayCollection( JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]') );
	},
	_save: function(){
		localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.todos._source));
	}

});
