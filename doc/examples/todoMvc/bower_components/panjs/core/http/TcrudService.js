uses("core.http.TrestClient");
uses("core.http.TcrudGenericCalls");

defineClass("TcrudService", "core.events.TeventDispatcher", { 

	objectClasses: [],
	apiUrl:null,
	localStorageId: null,
	extraUrlParams: null,
	foreignBindings: null,

	constructor: function(args){
		this.foreignBindings = [];

		this._super.constructor.call(this,args);				

		/* Le serveur ne renvoie que des 200, avec champs "exitCode" et "errorText".
			avec jsonp (l'api est sur un autre domaine), ça permet de récupérer les erreurs.
		*/

		this.injectParam("apiUrl", args.apiUrl, true);
		this.injectParam("extraUrlParams", args.extraUrlParams);

		if (this.localStorageId == null)
		this.localStorageId = "localStorage_"+panjs.env;
		
		this.restClient = new TrestClient({extraUrlParams: this.extraUrlParams, baseUrl: this.apiUrl, dataType:"json"});
	
		for (var i =0; i< this.objectClasses.length; i++)		
		{
			var classe = this.objectClasses[i];
			if (typeof classe != "undefined"){
				var caller = new TcrudGenericCalls({extraUrlParams: this.extraUrlParams, apiUrl: this.apiUrl});
				caller.url = classe.url;
				caller.className = classe.nom;
				caller.cached =  classe.cached || false;
				caller.IDField =  classe.IDField || "id";
				
				this["caller"+classe.nom] = caller;
				this["get"+classe.nom+"ById"] = caller.getById.bind(caller);
				this["update"+classe.nom] = caller.update.bind(caller);
				this["delete"+classe.nom] = caller.remove.bind(caller);
				this["search"+classe.nom] = caller.search.bind(caller);
				this["uploadFiles"+classe.nom] = caller.uploadFiles.bind(caller);
				this["deleteFile"+classe.nom] = caller.deleteFile.bind(caller);

				if (classe.hasFiles == true){

					this["listFiles"+classe.nom] = caller.listFiles.bind(caller);
					this["deleteFile"+classe.nom] = caller.deleteFile.bind(caller);
					this["uploadFiles"+classe.nom] = caller.uploadFiles.bind(caller);
				}
				caller.onUpdate = this.onCallerUpdate.bind(this);
				caller.onRemove = this.onCallerRemove.bind(this);
			}

		}
	},
	getObjectClass: function(name){

		for (var i=0; i< this.objectClasses.length; i++){
 			if (this.objectClasses[i].nom == name)
 				return this.objectClasses[i];
 		}
 		return null;
	},
	
	bindForeignKeys: function( sourceClass, sourceFieldName, destClass, destFieldName, foreighKeyField)
	{
		/* Exemples:
			Machines.nom =>> Jboss->machine. La clef étrangère est id_machine
		*/
		this.foreignBindings.push( { sourceClass: sourceClass, sourceFieldName: sourceFieldName, destClass:destClass, destFieldName:destFieldName, foreighKeyField:foreighKeyField} );
	},

	
	getAllCallers: function(){
		var r = [];
		for (var i =0; i< this.objectClasses.length; i++)		
		{
			var classe = this.objectClasses[i];
			r.push(this["caller"+classe.nom]);
		}
		return r;
	},
	onCallerUpdate: function(sender, oldData, newData){
		
		for (var i=0; i<this.foreignBindings.length; i++)
		{
			var bind = this.foreignBindings[i];

			if (sender.className == bind.sourceClass)
			{
				if ((oldData == null)||(oldData[bind.sourceFieldName] != newData[bind.sourceFieldName]))
				{							
						var caller =  this["caller"+bind.destClass];
						
						for (var nomModel in caller.data){
							var model = caller.getModel(nomModel);
							var liste = model.getByProp(bind.foreighKeyField, newData.id, true);
							for (var j =0; j< liste.length; j++)
							{
								var oldValue = liste[j][bind.destFieldName] ;
								var newValue = newData[bind.sourceFieldName];
								if (oldValue != newValue){
									liste[j][bind.destFieldName] = newValue;
									logger.debug("FOREIGN KEY MODIFIEE => "+bind.sourceClass+":"+bind.sourceFieldName+" = "+newValue+" ==> "+bind.destClass+":"+bind.destFieldName );
									model.dispatchUpdateEvent(liste[j], liste[j]);
								}
							}
						}
				}
			}
		}

		var evt =  new Tevent(sender.className+"Update", {newData:newData, oldData: oldData});
		this.dispatchEvent(evt);
		
	},

	onCallerRemove: function(sender, id){
		this.dispatchEvent( new Tevent(sender.className+"Delete", id));
	},

	defaultErrorHandler: function(e)
	{  
		logger.error(e.data.url+" => "+e.data.statusText);
		logger.error(e.data.url+" => "+e.data.responseText);
	},
	
	_onRequestSuccesDefault: function(evt, token)
	{
		//evt.data => objtet Vip
		
		if (defined(token.extSuccess))
			token.extSuccess(evt.data);
	},

	/* LocalStorage */
	getValue: function (name, success, failure) {

		var key = this.localStorageId+"."+name;
		var result = null;

		try{
			var item = localStorage.getItem(key);
		}catch(err){
			item = null;
			logger.error("Erreur localstorage.getItem("+key+") => "+err);
		}

		if (item != null){
			try{
				result = JSON.parse(item);
			}catch(e)
			{
				logger.error("Erreur TcrudService.getValue: "+e);
				if (defined(failure))
					failure(e);
				return result;
			}
		}

		if (defined(success))
			success(result);

		return result;
	},

	setValue: function (name, value, success, failure) {
		var key = this.localStorageId+"."+name;
		try{
			localStorage.setItem(key, JSON.stringify(value));
		}catch(e)
		{
			logger.error("Erreur TcrudService.setValue: "+e);
			/*if (defined(failure))
			failure(e);

			return false;*/
		}
		if (defined(success))
			success(value);
		return true;
	}

	
});
