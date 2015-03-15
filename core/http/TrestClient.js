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
		
		logger.debug("X-Time="+req.getResponseHeader("X-Time"));

		var r = new Tevent(Tevent.SUCCESS, data);	
		r.xTime = req.getResponseHeader("X-Time");
		r.req = req;
		
		return r;
	},
	_getErrorEvent: function(req, method, exception,url, token)
	{
		var evtData = {req:req, "method":method, responseText:"", statusText:"Erreur inconnue", status:0, url:"url=?"};

		
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
		evtData.responseText = "Empty response. status="+evtData.statusText;


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
		//data est un objet qui est transformé en URL par jquery
		//params sont des paramètres de l'url. Exemple: orderBy=nom&search=toto
		this._call("GET", url, params, data, success||null, failure||null,token);
	},
	getText: function(url, params, data, success, failure, token)
	{
		this._call("GET", url, params, data, success||null, failure||null,token, "text");
	},
	put: function(url, params, data, success, failure, token)
	{
		this._call("PUT", url, params, data, success||null, failure||null,token);
	},
	del: function(url, params, data, success, failure, token)
	{
		this._call("DELETE", url, params, data, success||null, failure||null,token);
	},
	_call: function(method, url, params, data, success, failure, token, dataType)
	{
		
		if (arguments.length < 8)
			var dataType = this.dataType;
		
		if ((dataType == "json")&&((method=="POST")||(method=="PUT")))
			data = JSON.stringify(data);

		/*
			Construction des paramètres de l'url
		*/
		token.id = this.getNewTokenId();
		if (url.lastIndexOf("?") == -1)
			url += "?";
		
		url += "&";
			


		var urlParams = this.extraUrlParams;
		if (defined(params))
		{
			if (typeof params == "object")
			{
				for (p in params){
					urlParams += urlParams + "&"+ p +"="+params[p];
				}
			}
			else
			{
				urlParams += "&"+params;
			}
		}
		
		var path = this.baseUrl+url+urlParams;
	
		logger.debug("Appel ",method,": ",path,", dataType="+dataType);

		var req = $.ajax({ 
				url: path,
				async:true,
				data:data,
				context:this,
				type: method,
				xhrFields: {
   				   withCredentials: true
   				},

				dataType: dataType,	//json: fonctionne pas en crossdomain sur IE8
									//nécessité d'utiliser XdomainRequest (CORS pour IE8)
				success: function(data, textStatus, req) {
					logger.debug("Requête AJAX "+token.requestId+" terminée avec succès sur ",url);
					if (token.aborted){
						logger.debug("Requête "+token.requestId+" ANNULEE sur ",url);
						return;
					}
					
					if (this.exitCodeFieldName != null)
					{
						var status = data[this.exitCodeFieldName];

						if (defined(status))
						{
							if ( status >= 400)
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
				error: function( jqXHR, textStatus, errorThrown) {
					logger.debug("ECHEC Requête AJAX "+token.requestId+" "+errorThrown+" sur ",url);
					if (token.aborted){
						logger.debug("Requête "+token.requestId+" ANNULEE sur ",url);
						return;
					}

					var readyState = "?";
					if (jqXHR.readyState == 0) readyState = "request not initialized";
					if (jqXHR.readyState == 1) readyState = "server connection established";
					if (jqXHR.readyState == 2) readyState = "request received ";
					if (jqXHR.readyState == 3) readyState = "processing request";
					if (jqXHR.readyState == 4) readyState = "request finished and response is ready";

					var headers = JSON.stringify(jqXHR.getAllResponseHeaders());

					logger.error("responseHeaders="+headers+", readyState="+readyState+", jqXHR.responseText = "+jqXHR.responseText +", jqXHR.responseXml = "+jqXHR.responseXML +", textStatus="+textStatus+", errorThrown = "+errorThrown);
					var e = this._getErrorEvent(jqXHR, method, errorThrown,path, token);

					this.dispatchEvent(e);

					if (defined(failure))
						failure(e, token)
				}
			});

			return req;	
	}
});
