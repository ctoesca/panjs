defineClass("Ttodo", "core.events.TeventDispatcher", { 
	
	id: 0,
	completed: false,
	texte: "",

	constructor: function(args){	
		this._super.constructor.call(this,args);				
	},
	
	clone: function()
	{
		var r = new Ttodo();
		r.id = this.id;
		r.completed = this.completed;
		r.texte = this.texte;
		return r;
	}

});
