uses("core.collections.TarrayCollection");
uses("services.TlocalService");

defineClass("Tmodel", "core.events.TeventDispatcher", { 
	
	todos: null,
	$filter: null,

	__OnPropChanged: function(propName, oldValue, newValue, object){
		this.todos.refresh();
	},
	
	constructor: function(args){		
		this._super.constructor.call(this,args);
		this.service = new TlocalService();
		this.todos = this.service._load();		
	},

	save: function(success, failure){
		this.service._save(this.todos._items)		
		if (defined(success))
			success(this.todos);
	},

	getAll: function (success, failure, opt) 
	{
		if (this.todos == null) 
			this.todos = this.service._load();		
				
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
		this.todos.forEach( function(item){
			this.toggleItem(item, completed);
		}.bind(this));
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
				this.todos.dispatchUpdateEvent(todo);
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

	getCompletedCount: function(){
		var r = this.todos.find({
				filterFunction: function(item){
					return item.completed;
				}
		});
		return r.length;
	},
	getNotCompletedCount: function(){
		var r =  this.todos.length - this.getCompletedCount();
		return r;
	}

});
