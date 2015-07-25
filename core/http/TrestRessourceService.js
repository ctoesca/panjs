uses("panjs.core.http.TrestClient");
uses("panjs.core.collections.TarrayCollection");

defineClass("TrestRessourceService", "panjs.core.events.TeventDispatcher", { 
	apiUrl: null, //Url de base de l'api
	urlRessource: null, // Url de la ressource. ex: /machines
	extraUrlParams: null,
	
	constructor: function(args){
		this._super.constructor.call(this,args);	

		this.injectParam("url", args.apiUrl, true);
		this.injectParam("urlRessource", args.urlRessource, true);
		this.injectParam("extraUrlParams", args.extraUrlParams, true);

		this.restClient = new TrestClient({extraUrlParams: this.extraUrlParams, urlRessource: this.urlRessource, baseUrl: this.apiUrl, dataType:"json"});
	},

	/*******************************
		getById 
	********************************/
	getById: function(id, success, failure, opt)
	{
		var updateModel = true;
		var data = null;
		if (arguments.length >= 4) 
			data = opt;
			
		var token = {extSuccess:success, extFailure:failure, updateModel: updateModel, searchId: id};
		this.restClient.get(this.url+"/"+id, "" , data, this._ongetById.bind(this), failure||this.defaultErrorHandler, token);	
	},

	_ongetById: function(evt, token)
	{
		this._ongetByIdDefault(evt, token);	
	},



	/*******************************
		remove 
	********************************/
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

	/*******************************
		get 
	********************************/
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
		
		if (searchOptions.startsWith("&"))
			searchOptions = searchOptions.substring(1);
	
		if (nomModel == null){
			nomModel = searchOptions;
		}

		var model = this.getModel(nomModel, false);

		var token = {startSearch: new Date(), url: this.url, extSuccess:success, extFailure:failure, searchOptions: searchOptions, updateModel:updateModel, nomModel:nomModel};
		var data = null;

		if ((useCache == false) || (model == null) )
		{
			this.restClient.get(this.url, searchOptions , data, this._onsearch.bind(this), failure||this.defaultErrorHandler, token);		
		}
		else
		{
			logger.debug("UTILISATION DU CACHE SUR "+this.className);
			var data = {total: model.total, data: model};
			model.refresh();
			var randomWait = randomBetween(10, 100);
			delay(token.extSuccess, randomWait, data);  
			//token.extSuccess(data);
		}	
	},

	_onsearch: function(evt, token)
	{
		var debut = new Date();
		var tempsAppel = (debut - token.startSearch);
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
 		logger.debug("Temps maj model = "+ (fin - debut)+" ms") ;
 			
	}


























	defaultErrorHandler: function(e, token)
	{  
		logger.error(e.data.url+" => "+e.data.responseText);	
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
		var token = {extSuccess:success, extFailure:failure};		
		var data = null;
		this.restClient.get(this.url+"/"+id+"/listFiles", "" , data, this.onListFilesSuccess.bind(this), failure||this.defaultErrorHandler, token);
	},
	onListFilesSuccess: function(evt, token)
	{
		if (defined(token.extSuccess))
           token.extSuccess(evt.data, token);  
	},

	
	deleteFile: function(id,filename, success, failure)
	{
		var token = {extSuccess:success, extFailure:failure};
		var data = null;
		this.restClient.del(this.url+"/"+id+"/files/"+filename, "" , data, this.onDeleteFileSuccess.bind(this), failure||this.defaultErrorHandler, token);
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
					app.getModel().setUser(data.item);

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

	

	update: function(obj, success, failure)
	{
		var token = { extSuccess:success, extFailure:failure};
		this.restClient.post(this.url, "" , obj, this._onupdate.bind(this), failure||this.defaultErrorHandler, token);
	},

	_onupdate: function(evt, token)
	{
		if (typeof evt.data.push == "function"){
			
			for (var i = 0; i < evt.data.length; i++) {
				this.updateModel(evt.data[i]);
			};
		}else{
			this.updateModel(evt.data);
		}
       	//Pour recharger les grilles attachées au modèle
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
	}

	
});
