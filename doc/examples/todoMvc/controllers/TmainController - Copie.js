uses("core.http.TrestClient");
defineClass("TmainController", "core.events.TeventDispatcher", { 

	restClient: null,
	apiUrl:  null,
	lastTokenId: 0,
	model: null,

	constructor: function(args){
		TmainController.lastTokenId = 0;
		this._super.constructor.call(this,args);				
			
		/* Le serveur ne renvoie que des 200, avec champs "exitCode" et "errorText".
			avec jsonp (l'api est sur un autre domaine), ça permet de récupérer les erreurs.
		*/
		this.restClient = new TrestClient({baseUrl: this.apiUrl, dataType:"json", exitCodeFieldName: "exitCode", errorTextFieldName:"errorText"});
		
		if (!defined(localStorage, "liste"))
			localStorage.liste = [];

	},
	init: function()
	{
		this.getIp();

		var l = localStorage.getItem("liste");
		try{
			l = JSON.parse(l);
		}catch(err)
		{
			l = [];
		}

		if (typeof l != "object")
		{
			localStorage.setItem("liste", JSON.stringify([]));
			l = [];
		}
		
		this.model.liste.setSource(l);	
		
	},

	getDefaultData: function()
	{
		return {ip: panjs.ip};
	},

	getIp: function()
	{
		//<script type="application/javascript" src="http://jsonip.appspot.com/?callback=getip"></script>

		var r = new TrestClient({baseUrl: 'http://jsonip.appspot.com', dataType:"jsonp"});
		r.get(		'', 
					null, 
					null, 
					function(evt){
						app.getModel().ip = evt.data.ip;
						logger.info("IP: "+app.getModel().ip);
					},
					this.defaultErrorHandler ,
					null
			);
	},

	defaultErrorHandler: function(e)
	{   
		logger.error(e.data.url+" => "+e.data.statusText);
	},

	getNewTokenId: function()
	{
		TmainController.lastTokenId ++;
		return TmainController.lastTokenId;
	},

	_beforeRequest: function()
	{
		this.restClient.baseUrl = this.apiUrl; 
	},
	
	saveOrUpdate: function(item, success, failure)
	{
		this._beforeRequest();
		var token = {id: this.getNewTokenId(), extSuccess:success, extFailure:failure};
		var data = this.getDefaultData();	
		data.item = item;

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
	
		localStorage.setItem("liste", JSON.stringify( this.model.liste._source )  );
		this._onSaveOrUpdateSuccess({data:modelItem}, token);

		//this.restClient.post("", null , data, this._onSaveOrUpdateSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	_onSaveOrUpdateSuccess: function(evt, token)
	{
		var modelItem = this.model.liste.getByProp("id", evt.data.id);

		if (modelItem != null)
		{
			this.model.liste.replaceItem(modelItem, evt.data);
		}
			
		if (defined(token.extSuccess))
			token.extSuccess(evt.data);
	},


	setItemCompleted: function(id, value, success, failure)
	{
		this._beforeRequest();
		var token = {id: this.getNewTokenId(), extSuccess:success, extFailure:failure};
		var data = this.getDefaultData();	
		data.itemId = id;

		var modelItem = this.model.liste.getByProp("id", id);
		modelItem.completed = value;
			
		localStorage.setItem("liste", JSON.stringify( this.model.liste._source )  );
		this._onSaveOrUpdateSuccess({data:modelItem}, token);

		//this.restClient.post("", null , data, this._onSaveOrUpdateSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	_onSetItemCompletedSuccess: function(evt, token)
	{
		var modelItem = this.model.liste.getByProp("id", evt.data.id);

		if (modelItem != null)
		{
			this.model.liste.replaceItem(modelItem, evt.data);
		}
			
		if (defined(token.extSuccess))
			token.extSuccess(evt.data);
	},



	remove: function(idList, success, failure)
	{
		this._beforeRequest();
		var token = {id: this.getNewTokenId(), extSuccess:success, extFailure:failure};
		var data = this.getDefaultData();
		data.idList = idList;

		for (var i=0; i<idList.length; i++)
		{
			var item = this.model.liste.getByProp("id", idList[i]);
			if (item != null)
				this.model.liste.removeItem(item);	
		}

		localStorage.setItem("liste", JSON.stringify( this.model.liste._source )  );
		this._onRemoveSuccess({data:idList}, token);

		//this.restClient.del("/"+id, null , data, this._onRemoveSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	_onRemoveSuccess: function(evt, token)
	{
		for (var i=0; i<evt.data.length; i++)
		{
			var item = this.model.liste.getByProp("id", evt.data[i]);

			if (item != null)
				this.model.liste.removeItem(item);	
		}
		
		if (defined(token.extSuccess))
			token.extSuccess(evt.data);
	},

});
