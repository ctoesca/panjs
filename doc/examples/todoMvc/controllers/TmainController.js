uses("controllers.TlocalService");

defineClass("TmainController", "core.events.TeventDispatcher", { 

	model: null,
	service: null,

	constructor: function(args){
		
		this._super.constructor.call(this,args);				
		this.service = new TlocalService();
	},

	init: function()
	{
		this.service.get(function(data){
			this.model.liste.setSource(data);		
		}.bind(this));
	},
		
	saveOrUpdate: function(item, success, failure)
	{
		var modelItem = this.model.liste.getByProp("id", item.id);
	
		if (modelItem == null)
		{
			//Ajout
			var newId = this.model.getNewId();
			item.id = newId;
			this.model.liste.addItemAt(item, 0);	
			modelItem = item;			
		}
		else
		{
			//modif		
			modelItem.texte = item.texte;
			modelItem.completed = item.completed;	
		}
	
		this.service.put( this.model.liste.getSource() , function(data){
			this.model.liste.refresh();
			if (defined(success))
			success(data);
		}.bind(this) );

	},
	
	setItemCompleted: function(id, value, success, failure)
	{
		var modelItem = this.model.liste.getByProp("id", id);
		modelItem.completed = value;
		
		this.service.put( this.model.liste.getSource() , function(data){
			this.model.liste.refresh();

			if (defined(success))
			success(data);
		}.bind(this) );
		
	},
	
	remove: function(idList, success, failure)
	{
		
		for (var i=0; i<idList.length; i++)
		{
			var item = this.model.liste.getByProp("id", idList[i]);
			if (item != null)
				this.model.liste.removeItem(item);	
		}

		this.service.put( this.model.liste.getSource() , function(data){
			if (defined(success))
			success(data);
		}.bind(this) );
	}

});
