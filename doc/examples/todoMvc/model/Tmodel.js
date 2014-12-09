uses("core.collections.TarrayCollection");
uses("services.TlocalService");

defineClass("Tmodel", "core.events.TeventDispatcher", { 
	
	todos: null,
	STORAGE_ID: "panjs_todos",

	constructor: function(args){		
		this._super.constructor.call(this,args);
	},

	onFailure: function(e){
		alert(e.data.responseText);
	},

	_load: function(){
		if (this.todos == null){
			var data = JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
			this.todos = new TarrayCollection( {key: "id", data:data } );
		}
	},
	_save: function(){
		localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.todos._source));
	},

	getAll: function (success, failure, opt) 
	{
		if (this.todos == null) 
			this._load();
				
		if (defined(success))
			success(this.todos);	
		
	},

	getById: function(todoId, success, failure){
		
		if (this.todos == null) 
			this._load();
		var result = this.todos.getByProp("id", todoId);
		if (defined(success))
			success(result);
	},
	setFilter: function(obj){
		
		this._load();

		var r = [];
		
		if (obj != null){

		}else{
			for (var k in obj){
				for (var i=0; i< this.todos.length; i++){
					var item = this.todos._source[i];
					if (item[k] == obj[k])
						r.push(item);
				}
			}			
		}
		
		this.todos.setSource(r);
	},
	save: function(todo, success, failure)
	{
		if (this.todos == null) 
			this._load();

		if (typeof todo.id == "undefined"){
			todo.id = generateUUID();
			this.todos.addItemAt(todo, 0);			
		}else{
			var todoModel = this.todos.getByProp("id", todo.id);
			this.todos.updateItem(todoModel, todo);
		}
		this._save();
		if (defined(success))
			success(todo);
	},
	getTodosCompleted: function(){
		if (this.todos == null) 
			this._load();
		var r = this.todos.find({
				filterFunction: function(item){
					return item.completed;
				}
		});
		return r;
	},
	
	removeById: function(todoId, success, failure)
	{
		if (this.todos == null) 
			this._load();

		var todoModel = this.todos.getByProp("id", todoId);
		if (todoModel != null){
			this.todos.removeItem(todoModel);
		}
		this._save();
		if (defined(success))
			success(todoId);
	}

});
