uses("core.http.TrestClient");
uses("core.collections.TarrayCollection");

defineClass("TcrudGenericCalls", "core.events.TeventDispatcher", { 

	apiUrl: null, // Url de base de l'api. ex: http://cid/apis/cmdb/1.0/index.php
	listeSearchOptions: null,
	lastIdSearch: null,
	className: null,
	cached: false,
	listeIsSet: false,
	extraUrlParams: null,
	data: null,
	url: null, // ex: /machines

	constructor: function(args){
		this._super.constructor.call(this,args);	
		this.injectParam("apiUrl", args.apiUrl, true);
		this.injectParam("extraUrlParams", args.extraUrlParams, true);

		this.data = {Default: new TarrayCollection()};

		this.restClient = new TrestClient({extraUrlParams: this.extraUrlParams, baseUrl: this.apiUrl, dataType:"json"});
	},
	defaultErrorHandler: function(e, token)
	{  
		logger.error(e.data.url+" => "+e.data.responseText);
		
	},
	/********************  GESTION MULTI MODELS **********************************/
	getModels: function(nom){
		var r = [];
		for (var nomModel in this.data){
			r.push({nom:nomModel, data: this.data[nomModel]});
		}
		return r;
	},
	getModel: function(nom){

		var r = this.data.Default;
		
		if ((arguments.length > 0) && (nom != null) ){
			if (typeof this.data[nom] != "undefined"){
				return this.data[nom];
			}else
			{
				logger.debug("Affectation model "+nom);
				this.data[nom] = new TarrayCollection();
				r = this.data[nom];
			}
		}
		return r;
	},

	getItemsById: function(id){
		//Recherche par propriété, dans tous les models 
		var r = [];
		for (var nomModel in this.data){
			var model = this.data[nomModel];

			var item = model.getByProp("id", id);

			if (item != null)
				r.push({item: item, model: model});
		}
		return r;
	},
	
	addItemInModels: function(item){
		for (var nomModel in this.data){
			var model = this.data[nomModel];
			model.addItemAt(item,0);
		}
	},

	removeItemFromModels: function(itemId){
		var items = this.getItemsById(itemId);
		for (var i=0; i<items.length; i++)
			items[i].model.removeItem(items[i].item);
	},

	replaceItemInModels: function(item){
		
		var items = this.getItemsById(item.id);
		for (var i=0; i<items.length; i++)
			items[i].model.replaceItem(items[i].item, item);		
	},

	

	/******************************************************************************/
	_onupdateDefault: function(evt, token)
	{
		//evt.data => objtet Vip
		if (defined(token.extSuccess))
			token.extSuccess(evt.data, token);
		
	},
	_onsearchDefault: function(evt, token)
	{
		if (defined(token.extSuccess))
			token.extSuccess(evt.data, token);
		
	},
	_onremoveDefault: function(evt, token)
	{
		if (defined(token.extSuccess))
			token.extSuccess(evt.data, token);
		this.onRemove(this, evt.data);
	},

	_ongetByIdDefault: function(evt, token)
    {
    
        var item = evt.data;
        if (token.updateModel)
        {
            if (item != null)
                this.replaceItemInModels(item);
        }

         if (defined(token.extSuccess))
            token.extSuccess(item, token);    
    },

	onUpdate: function(className, data)
	{

	},
	onRemove: function(className, data)
	{

	},
	//*********************************************************************************************************
	//********************************************  CRUD  *****************************************************
	//*********************************************************************************************************

	getById: function(id, success, failure, opt)
	{
		var updateModel = true;
		var data = null;
		if (arguments.length >= 4) {
			if (typeof opt.updateModel != "")
			updateModel = opt.updateModel;
			data = opt;
		}
			
		var token = {extSuccess:success, extFailure:failure, updateModel: updateModel, searchId: id};
		
		if ((this.cached == false) || (this.listeIsSet == false)|| (this.lastIdSearch!= id))
		{
			this.restClient.get(this.url+"/"+id, "" , data, this._ongetById.bind(this), failure||this.defaultErrorHandler, token);	
		}
		else
		{
			this.lastIdSearch = id;
			var itemsModel = this.getItemsById(id);
			if (itemsModel.length == 0)
				item = null;
			else
				item = itemsModel[0].item;

			token.extSuccess(item);	
		}
	},

	_ongetById: function(evt, token)
	{
		this.lastIdSearch = token.searchId;
		this._ongetByIdDefault(evt, token);	
	},

	update: function(obj, success, failure)
	{
		var token = { extSuccess:success, extFailure:failure};
		var data = {data: JSON.stringify(obj)};

		this.restClient.post(this.url, "" , data, this._onupdate.bind(this), failure||this.defaultErrorHandler, token);
	},

	_onupdate: function(evt, token)
	{
		this.updateModel(evt.data)
       	//Pour recharger les grilles attachées au modèle
        //this.search(this.listeSearchOptions); 
        this._onupdateDefault(evt, token);
	},

	updateModel: function(item)
	{
		if (item == null)
		{
			logger.warn("TgenericCall.updateModel => item=null");
			return;
		}
		else
		{
			var itemModels= this.getItemsById(item.id);


			if (itemModels.length > 0)
			{
				for (var i=0; i< itemModels.length; i++)
				{
					var itemModel = itemModels[i].item;
					if (item.date_modif < itemModel.date_modif)
					{
						logger.warn("ATTENTION: l'objet reçu "+this.className+" est obsolète ! Il ne sera pas mis à jour dans le model");
						logger.warn("item.date_modif = "+item.date_modif+" itemModel.date_modif="+itemModel.date_modif);
					}
					else
					{
						//if (item.date_modif != itemModel.date_modif){
							//L'item existe
							logger.info("Item Modifiée");
							itemModels[i].model.replaceItem(itemModel, item);
						/*}else
						{
							logger.debug("La date de modification de l'objet n'a pas changé: item.date_modif ="+item.date_modif+", itemModel.date_modif="+itemModel.date_modif);
						}
							*/	
					}
				}
			}
	       	else
	       	{
	       		//création ou pas dans le model
	       		if (item._isNew == true){
					logger.info("Création item");
					this.addItemInModels(item);
	       			
	       		}
	       	}	
		}
		 	
       	this.onUpdate(this, itemModel, item);
	
       	return itemModel;
	},

	remove: function(id, success, failure)
	{
		var token = {extSuccess:success, extFailure:failure};
		var data = null;

		this.restClient.del(this.url+"/"+id, "" , data, this._onremove.bind(this), failure||this.defaultErrorHandler, token);
	},

	_onremove: function(evt, token)
	{
		this.removeItemFromModels(evt.data);
		this._onremoveDefault(evt, token);
	},	
	
	search: function(searchOptions, success, failure, opt)
	{
		this.startSearch = new Date();
		var _updateModel = true;
		var nomModel = 'Default';
		var fields = null;

		if (arguments.length > 3){
			if (typeof opt.updateModel != "undefined")
				_updateModel = opt.updateModel;
			if (typeof opt.nomModel != "undefined")
				nomModel = opt.nomModel;
			if (typeof opt.fields != "undefined")
				fields = opt.fields;
		}
		
		if (searchOptions == null)
			searchOptions = "";
		
		if (searchOptions.startsWith("&"))
			searchOptions = searchOptions.substring(1);
	
		if (fields != null)
			searchOptions +="&fields="+fields;

		var token = {url: this.url, extSuccess:success, extFailure:failure, searchOptions: searchOptions, updateModel:_updateModel, nomModel:nomModel};
		var data = null;
		
		if ((this.cached == false) || (this.listeIsSet == false) || (this.listeSearchOptions != searchOptions))
		{
			this.restClient.get(this.url, searchOptions , data, this._onsearch.bind(this), failure||this.defaultErrorHandler, token);		
		}
		else
		{
			logger.debug("UTILISATION DU CACHE SUR "+this.className);
			var model = this.getModel(nomModel);
			var data = {total: model.length, data: model, processTime:0};
			model.refresh();
			token.extSuccess(data);
		}
		
	},

	_onsearch: function(evt, token)
	{
		var debut = new Date();
		var tempsAppel = (debut - this.startSearch);
		var tempsCpuServeur =  Math.round(evt.data.processTime*1000);
	
		logger.debug("Temps traitement ("+tempsAppel +"ms) = Temps serveur ("+tempsCpuServeur+"ms) + encodage/decodage Json ("+ (tempsAppel - tempsCpuServeur)+" ms) token.updateModel="+token.updateModel) ;
		
		if (token.updateModel)
		{
			model = this.getModel(token.nomModel);
		
			model.setSource(evt.data.data);
			model.total = evt.data.total;
			evt.data.data = model;
			this._onsearchDefault(evt, token);	
			this.listeIsSet = true;
			this.listeSearchOptions = token.searchOptions;
		}
		else
		{
			var l = new TarrayCollection();
			l.setSource(evt.data.data);
			l.total = evt.data.total;
			evt.data.data = l;	
			this._onsearchDefault(evt, token);	
		}
		
		var fin = new Date();
 		logger.debug("Temps maj model = "+ (fin - debut)+" ms") ;
 			
	}
});
