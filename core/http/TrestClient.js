/*** 
TrestClient 
***/

defineClass("TrestClient", "core.events.TeventDispatcher",
{  	
	dataType: "json",
	/*
	En jsonP, si le serveur renvoie 404 ou 500, on n'a pas le détail:
	exemple: login => 500 => "Mauvais mot de passe" => pas récupéré
	Si le serveur veut renvoyer une erreur, il peut renvoyer un status 200, mais en précisant les champs "status" et "responseTextFieldName".
	*/
	exitCodeFieldName: null, 
	errorTextFieldName: null, 
	lastTokenId: 0,
	extraUrlParams: null,
	
	constructor: function(args){	
		TrestClient._super.constructor.call(this,args);
		this.injectParam("dataType",args.dataType, false);
		this.injectParam("exitCodeFieldName",args.exitCodeFieldName, false);
		this.injectParam("errorTextFieldName",args.errorTextFieldName, false);
		this.injectParam("baseUrl",args.baseUrl);
		this.injectParam("extraUrlParams",args.extraUrlParams);

	
	},

	getNewTokenId: function()
	{
		TrestClient.lastTokenId ++;
		return TrestClient.lastTokenId;
	},
	_getSuccessEvent: function(data, req, token)
	{
		var r = new Tevent(Tevent.SUCCESS, data);
		return r;
	},
	_getErrorEvent: function(req, method, exception,url, token)
	{
		var evtData = {"method":method, responseText:"", statusText:"Erreur inconnue", status:0, url:"url=?"};

		
		/* 
			statusText 
		*/
		if (defined(req, "statusText"))
			evtData.statusText = req.statusText;
		else
			evtData.statusText = "";

		if (defined(exception))
			evtData.statusText = exception;

		if (defined(url))
			evtData.url = url;

		/* 
			ResponseText 
		*/
		if (defined(req , "responseText"))
		evtData.responseText = req.responseText;	
		if (evtData.responseText == "")
		evtData.responseText = evtData.statusText;


		/* 
			status 
		*/
		if (defined(req , "status"))
		evtData.status = req.status;
		
		if (evtData.status == 0)
		evtData.status = 1;

		evtData.token = token;

		try{
			evtData.data = JSON.parse(evtData.responseText);
		}catch(err)
		{
			evtData.data = evtData.responseText;
		}
		
		return new Tevent(Tevent.ERROR, evtData);
	},

	post: function(url, params, data, success, failure, token)
	{
		
		this._call("POST", url, params, data, success||null, failure||null,token);
	},
	get: function(url, params, data, success, failure, token)
	{
		this._call("GET", url, params, data, success||null, failure||null,token);
	},
	put: function(url, params, data, success, failure, token)
	{
		this._call("PUT", url, params, data, success||null, failure||null,token);
	},
	del: function(url, params, data, success, failure, token)
	{
		this._call("DELETE", url, params, data, success||null, failure||null,token);
	},
	_call: function(method, url, params, data, success, failure, token)
	{
		/*
			Construction des paramètres de l'url
		*/
		token.id = this.getNewTokenId();
		
		var urlParams = "";
		if (defined(params))
		{
			if (typeof params == "object")
			{
				urlParams = "?";
				for (p in params)
					urlParams = urlParams + p +"="+params[p]+"&";
			
				if (urlParams == "?")
					urlParams = "";
			}
			else
			{
				urlParams = "?"+params;
			}
		}
		if (this.extraUrlParams)
			urlParams += "&"+this.extraUrlParams;

		var path = this.baseUrl+url+urlParams;

		logger.debug("Appel ",method,": ",path,", dataType="+this.dataType);


		var req = $.ajax({ 
				url: path,
				async:true,
				data:data,
				context:this,
				type: method,
				xhrFields: {
   				   withCredentials: true
   				},

				dataType: this.dataType,	//json: fonctionne pas en crossdomain sur IE8
									//nécessité d'utiliser XdomainRequest (CORS pour IE8)
				success: function(data, textStatus, req) {
					logger.debug("Requête AJAX terminée avec succès: ",url);
					logger.debug("X-Time="+req.getResponseHeader("X-Time"));
					
					if (this.exitCodeFieldName != null)
					{
						var status = data[this.exitCodeFieldName];

						if (defined(status))
						{
							if ( status != 200)
							{



								//C'est une erreur:
								var e = this._getErrorEvent(req, method,  data[this.errorTextFieldName],path, token);
								this.dispatchEvent(e);

								if (defined(failure))
									failure(e, token)
								return;
							}
						}

					}


					var e = this._getSuccessEvent(data,req, token);
					this.dispatchEvent(e);

					if (defined(success))
						success(e, token);
				},
				error: function(req, settings, exception) { 

					var e = this._getErrorEvent(req, method, exception,path, token);

					this.dispatchEvent(e);

					if (defined(failure))
						failure(e, token)
				}
			});

			return req;	
	}
});
