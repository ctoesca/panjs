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
	save: function(success, failure){

		localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.todos._items));
		if (defined(success))
			success(this.todos);
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
					var item = this.todos._items[i];
					if (item[k] == obj[k])
						r.push(item);
				}
			}			
		}
		
		this.todos.setSource(r);
	},
	addNewItem: function(item){
		item.id = generateUUID();
		item.completed = false;
		this.todos.addItemAt(item, 0);
		this.save();
	},
	toggleAll: function(completed)
	{
		for (var i=0; i< this.todos.length; i++){
			var item = this.todos._items[i];
			item.completed = completed;
			this.todos.sendUpdateEvent(item);
		}
		this.save();
	},
	toggleItem: function(item, completed)
	{
		item.completed = completed;
		this.todos.sendUpdateEvent(item);
		this.save();
	},

	clearCompleted: function(){
		var completedTodos = this.getTodosCompleted();
		for (var i=0; i< completedTodos.length; i++)
			this.todos.removeItem(completedTodos[i]);
		this.save();
	},

	getTodosCompleted: function(){
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
