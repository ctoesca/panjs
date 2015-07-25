uses("panjs.core.http.TrestClient");
uses("panjs.core.collections.TarrayCollection");

defineClass("TcrudGenericCalls", "panjs.core.events.TeventDispatcher", { 

	apiUrl: null, // Url de base de l'api. ex: http://cid/apis/cmdb/1.0/index.php
	
	className: null,
	cached: false,
	extraUrlParams: null,
	data: null,
	url: null, // ex: /machines
	IDField: "id",

	runningRequests: null,
	lastRequestId : 0,

	constructor: function(args){
		this._super.constructor.call(this,args);	
		this.runningRequests = {};

		this.injectParam("apiUrl", args.apiUrl, true);
		this.injectParam("extraUrlParams", args.extraUrlParams, true);

		this.data = {};

		this.restClient = new TrestClient({extraUrlParams: this.extraUrlParams, baseUrl: this.apiUrl, dataType:"json"});
	},
	createNewToken: function(success,failure){
		this.lastRequestId ++;
		var token = {start: new Date(), requestId: this.lastRequestId, extSuccess:success, extFailure:failure,aborted: false};
		this.runningRequests[token.requestId] = token;
		return token;
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
	getModel: function(nom, create){

		var r = null;
		
		if ((arguments.length > 0) && (nom != null) ){
			if (typeof this.data[nom] != "undefined"){
				r = this.data[nom];
			}else
			{
				if ((arguments.length == 2) && (create == true)){
					logger.debug("Affectation model "+nom);
					this.data[nom] = new TarrayCollection();
					r = this.data[nom];	
				}
			}
		}
		return r;
	},

	getItemsById: function(id){
		//Recherche par propriété, dans tous les models 
		var r = [];
		for (var nomModel in this.data){
			var model = this.data[nomModel];

			var item = model.getByProp(this.IDField, id);

			if (item != null)
				r.push({item: item, model: model});
		}
		
		return r;
	},

	getItemsByProp: function(propName, value){
		//Recherche par propriété, dans tous les models 
		var r = [];
		for (var nomModel in this.data){
			var model = this.data[nomModel];

			var items = model.getByProp(propName, value, true);
			for (var i=0; i< items.length; i++){
				if (items[i] != null)
				r.push({item: items[i], model: model});
			}
		}
		
		return r;
	},	

	addItemInModels: function(item){
		var r = 0;
		for (var nomModel in this.data){
			var model = this.data[nomModel];
			model.addItemAt(item,0);
			r++;
		}
		return r;
	},

	removeItemFromModels: function(itemId){
		var items = this.getItemsById(itemId);
		for (var i=0; i<items.length; i++){
			items[i].model.removeItem(items[i].item);
		}
	},

	replaceItemInModels: function(item){
		
		var items = this.getItemsById(item[this.IDField]);
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

	/************************************************************/
	/*********************   GESTION FICHIERS DES RESSOURCES  ****/
	/************************************************************/
	
	listFiles: function(id, success, failure)
	{
		var url = this.url+"/"+id+"/listFiles";
		var token = this.createNewToken(success, failure);		
		var data = null;
		this.restClient.get(url, "" , data, this.onListFilesSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	onListFilesSuccess: function(evt, token)
	{		
		if (defined(token.extSuccess))
           token.extSuccess(evt.data, token);  
	},

	
	deleteFile: function(id,filename, success, failure)
	{
		var url = this.url+"/"+id+"/files/"+filename;
		var token = this.createNewToken(success, failure);
		var data = null;
		this.restClient.del(url, "" , data, this.onDeleteFileSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	onDeleteFileSuccess: function(evt, token){
		
		if (defined(token.extSuccess))
           token.extSuccess(evt.data, token);
	},

	uploadFiles: function(id, formData, progressHandler, success, failure)
	{
		var url = this.apiUrl+this.url+'/'+id+'/files/upload?'+this.extraUrlParams;

 		$.ajax({
		        url: url,  //Server script to process data
		        type: 'POST',
		        xhr: function() {  // Custom XMLHttpRequest
		            var myXhr = $.ajaxSettings.xhr();
		            if(myXhr.upload){ // Check if upload property exists
		                myXhr.upload.addEventListener('progress',progressHandler, false); // For handling the progress of the upload
		            }
		            return myXhr;
		        }.bind(this),

		        //beforeSend: this.beforeSendHandler.bind(this),
		        //success: this.completeHandler.bind(this),
		        //error: this.errorHandler.bind(this),	   
		        data: formData,
		        cache: false,
		        contentType: false,
		        processData: false,

		        success: function(data, textStatus, req) {
					logger.info("Upload terminé avec succès: "+data);
					if (typeof data != "object")
					{
						logger.error("ECHEC UPLOAD =>"+data);
						if (defined(failure)){
							failure(data);
						}
						return;
					}
					
					this.updateModel(data.item);
					
					if (defined(success)){
						success(data);
					}

				}.bind(this),
				error: function(req, settings, exception) { 
					
					logger.error(req.responseText);

					var data={
						uploaded: [],
						errors:1,
						message: ""
					};

					try{
					data = JSON.parse(req.responseText);
					}catch(err)
					{
						data.message = req.responseText;																	
					}

					if (defined(failure)){
						failure(data);
					}
					
				}.bind(this)
		});  
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
		var token = this.createNewToken(success, failure);		
		token.updateModel = updateModel
		token.searchId = id;
		
		//if ((this.cached == false) || (this.listeIsSet == false)|| (this.lastIdSearch!= id))
		//{
			this.restClient.get(this.url+"/"+id, "" , data, this._ongetById.bind(this), failure||this.defaultErrorHandler, token);	
		/*}
		else
		{
			this.lastIdSearch = id;
			var itemsModel = this.getItemsById(id);
			if (itemsModel.length == 0)
				item = null;
			else
				item = itemsModel[0].item;

			token.extSuccess(item);	
		}*/
	},

	_ongetById: function(evt, token)
	{		
		this._ongetByIdDefault(evt, token);	
	},

	update: function(obj, success, failure)
	{
		var token = this.createNewToken(success, failure);		
		var idType = typeof obj[this.IDField];
		var hasId = false;

		if (idType == "string")
		{
			if (obj[this.IDField].trim() != "")
				hasId = true;
		}
		else{
			if ((idType == "number")&&(obj[this.IDField] != 0))
				hasId = true;
		}
		
		//POST=> Creation, le serveur définit le ID, PUT=> Update ou Creation avec un Id définit par le client
		if (hasId == false)
			this.restClient.post(this.url, "" , obj, this._onupdate.bind(this), failure||this.defaultErrorHandler, token);
		else
			this.restClient.put(this.url+"/"+obj[this.IDField], "" , obj, this._onupdate.bind(this), failure||this.defaultErrorHandler, token);
	},

	_onupdate: function(evt, token)
	{
		if (evt.data == null){
			logger.error("TcrudGenericCalls._onupdate: evt.data est null");
		}else{
			if (typeof evt.data.push == "function"){
				for (var i = 0; i < evt.data.length; i++) {
					this.updateModel(evt.data[i]);
				};
			}else{
				this.updateModel(evt.data);
			}
		}	

       	//Pour recharger les grilles attachées au modèle
        this._onupdateDefault(evt, token);
	},
	updateModels: function(items)
	{
		for (var i=0; i< items.length; i++)
			this.updateModel(items[i]);
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
			var itemModels= this.getItemsById(item[this.IDField]);
		
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
							
							
							itemModels[i].model.replaceItem(itemModel, item);
							//logger.debug("updateModel: Objet "+this.className+" modifié");

						/*}else
						{
							logger.debug("La date de modification de l'objet n'a pas changé: item.date_modif ="+item.date_modif+", itemModel.date_modif="+itemModel.date_modif);
						}
							*/	
					}
				}
				logger.info("updateModel: "+itemModels.length+" objet(s) "+this.className+" modifié(s)");
			}
	       	else
	       	{
	       		//création ou pas dans le model
	       		if (item._isNew == true){
					var count = this.addItemInModels(item);
					logger.info("updateModel: "+count+" objet(s) "+this.className+" ajouté(s)");
	       		}
	       		
	       	}	
		}
		 	
       	this.onUpdate(this, itemModel, item);
	
       	return itemModel;
	},

	remove: function(id, success, failure)
	{
		var token = this.createNewToken(success, failure);		
		var data = null;

		this.restClient.del(this.url+"/"+id, "" , data, this._onremove.bind(this), failure||this.defaultErrorHandler, token);
	},

	_onremove: function(evt, token)
	{		
		this.removeItemFromModels(evt.data);
		this._onremoveDefault(evt, token);
	},	


	getHisto: function(id, success, failure)
	{
		var data = null;				
		var token = this.createNewToken(success, failure);		
		this.restClient.get(this.url+"/"+id+"/histo", "" , data, this._ongetHistoSuccess.bind(this), failure||this.defaultErrorHandler, token);	
	},
	_ongetHistoSuccess: function(evt, token){
		
		var l = new TarrayCollection();
		l.setSource(evt.data.data);
		l.total = evt.data.total;
		evt.data.data = l;
		
		this._onsearchDefault(evt, token);
	},

	search: function(searchOptions, success, failure, opt)
	{
		var updateModel = true;
		var nomModel = null;
		var useCache = this.cached;

		if (arguments.length > 3){
			if (typeof opt.updateModel != "undefined")
				updateModel = opt.updateModel;
			if (typeof opt.nomModel != "undefined")
				nomModel = opt.nomModel;
			if (typeof opt.useCache != "undefined")
				useCache = opt.useCache;
		}
		
		if (searchOptions == null)
			searchOptions = "";
		
		var q = "";
		if (typeof searchOptions == "object"){
			for (var k in searchOptions)
				q += k+"="+searchOptions[k]+"&";
			q = q.removeEnd("&");
		}else{
			q = searchOptions;
		}
			
		if (nomModel == null){
			nomModel = q;
		}

		var model = this.getModel(nomModel, false);

		var token = this.createNewToken(success, failure);		
		token.updateModel = updateModel;
		token.nomModel = nomModel;
		var data = null;
		
		if ((useCache == false) || (model == null) )
		{			
			this.restClient.get(this.url, q , data, this._onsearch.bind(this), failure||this.defaultErrorHandler, token);		
		}
		else
		{
			logger.debug("UTILISATION DU CACHE SUR "+this.className);
			var data = {total: model.total, data: model};
			model.refresh();
			var randomWait = randomBetween(10, 100);
			delay(
				function(){
					delete this.runningRequests[token.requestId];
					token.extSuccess(data, token);
				}.bind(this), 
				randomWait, 
				data
			);  
			//token.extSuccess(data);
		}	
		return token;
	},
	

	_onsearch: function(evt, token)
	{		
			var debut = new Date();
			var tempsAppel = (debut - token.start);
			var tempsCpuServeur =  Math.round(evt.xTime);
		
			logger.debug("Temps total ("+tempsAppel +"ms) = Traitement serveur ("+tempsCpuServeur+"ms) + encodage/decodage Json etc ("+ (tempsAppel - tempsCpuServeur)+" ms) token.updateModel="+token.updateModel) ;
			
			if (evt.data == null){	
				evt.data = {status: 200, responseText: "Résultat non conforme: La requête a réussi (status="+evt.req.status+") mais a renvoyé null."};
				if (defined(token.extFailure)){
					token.extFailure(evt, token);
				}
				return;
			}
			

			if (token.updateModel)
			{
				//On met à jour le model
				model = this.getModel(token.nomModel, true);			
				model.total = evt.data.total;
				model.setSource(evt.data.data);
				evt.data.data = model;
				
			}
			else
			{	
				//On renvoie une nouvelle collection
				var l = new TarrayCollection();
				l.setSource(evt.data.data);
				l.total = evt.data.total;
				evt.data.data = l;
				
			}
			
			this._onsearchDefault(evt, token);
			var fin = new Date(); 			
			logger.debug("Temps maj model (updateModel="+token.updateModel+") = "+ (fin - debut)+" ms") ;
	}
});
