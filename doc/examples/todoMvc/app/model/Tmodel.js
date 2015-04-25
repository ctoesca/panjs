uses("core.collections.TarrayCollection");
uses("services.TlocalService");

defineClass("Tmodel", "core.events.TeventDispatcher", { 
	
	todos: null,
	STORAGE_ID: "panjs_todos",

	constructor: function(args){		
		this._super.constructor.call(this,args);
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
	
	addNewItem: function(item){
		item.id = generateUUID();
		item.completed = false;
		this.todos.addItemAt(item, 0);
		this.save();
	},
	removeTodo: function(todo){
		this.todos.removeItem(todo);
		this.save();
	},
	toggleAll: function(completed)
	{
		for (var i=0; i< this.todos.length; i++){
			var item = this.todos._items[i];
			this.toggleItem(item, completed);
		}
	},

	toggleItem: function(item, completed)
	{
		this.updateTodo(item, {completed: completed});
	},

	updateTodo: function(todo, props){
		if (this.todos.contains(todo))
		{
			var changed = false;
			for (var k in props)
			{
				if (todo[k] != props[k])
				{
					todo[k] = props[k];
					changed = true;
				}
			}
			if (changed){
				this.save();
				this.todos.sendUpdateEvent(todo);
			}
		}
	},
	clearCompleted: function(){
		this.todos.removeItems(function(item){
			if (item.completed)
				return true;
		});
		this.save();
	},

	getTodosCompletedCount: function(){
		var r = this.todos.find({
				filterFunction: function(item){
					return item.completed;
				}
		});
		return r.length;
	},
	getTodosNotCompletedCount: function(){
		var r =  this.todos.length - this.getTodosCompletedCount();
		return r;
	}

});
