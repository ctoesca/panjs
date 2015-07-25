/*** 
TrestClient 
***/

defineClass("TrestClient", "panjs.core.events.TeventDispatcher",
{  	
	dataType: "json",
	/*
	En jsonP, si le serveur renvoie 404 ou 500, on n'a pas le détail:
	exemple: login => 500 => "Mauvais mot de passe" => pas récupéré
	Si le serveur veut renvoyer une erreur, il peut renvoyer un status 200, mais en précisant les champs "status" et "responseTextFieldName".
	*/
	exitCodeFieldName: null, 
	errorTextFieldName: null, 
	
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
		this._call("POST", url, params, data, success||null, failure||null,token||null);
	},
	get: function(url, params, data, success, failure, token)
	{
		//data est un objet qui est transformé en URL par jquery
		//params sont des paramètres de l'url. Exemple: orderBy=nom&search=toto
		this._call("GET", url, params, data, success||null, failure||null,token||null);
	},
	getText: function(url, params, data, success, failure, token)
	{
		this._call("GET", url, params, data, success||null, failure||null,token||null, "text");
	},
	put: function(url, params, data, success, failure, token)
	{
		this._call("PUT", url, params, data, success||null, failure||null,token||null);
	},
	del: function(url, params, data, success, failure, token)
	{
		this._call("DELETE", url, params, data, success||null, failure||null,token||null);
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

		if (token == null)
			token = {};

		token.id = this.getNewTokenId();
		if (!token.requestId)
			token.requestId = token.id;

		var urlParams = "";
		if (url.lastIndexOf("?") != -1){
			urlParams = url.droite("?");
			url = url. gauche("?");
		}
		
		urlParams += "&"+this.extraUrlParams;
		
		if (defined(params))
		{
			if (typeof params == "object")
			{
				for (p in params){
					urlParams += "&"+ p +"="+params[p];
				}
			}
			else
			{
				urlParams += "&"+params;
			}
		}

		//
		urlParams = encodeURI(urlParams);
		urlParams = urlParams.replace(/#/g, '%23');

		var path = this.baseUrl+url+"?"+urlParams;

		logger.debug("TrestClient._call requestId:"+token.requestId,", method:", method,", path: ",path,", dataType="+dataType);

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
				
					if (token.aborted){
						logger.debug("Requête AJAX "+token.requestId+" ANNULEE sur ",url);
						return;
					}else{
						logger.debug("Requête AJAX "+token.requestId+" terminée avec succès sur ",url);
						if (logger.debug)
							logger.debug("data size = "+req.responseText.length+" bytes");
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
					
					if (token.aborted){
						logger.debug("Requête "+token.requestId+" ANNULEE sur ",url);
						return;
					}

					if (jqXHR.status == 200)
					{
						var isOk = false;
						//PB Jquery...
						try{
							var data = JSON.parse(jqXHR.responseText);
							var e = this._getSuccessEvent(data,jqXHR, token);
							this.dispatchEvent(e);
							var isOk = true;
						}catch(err){

						}
						if (isOk)
						{
							if (defined(success))
								success(e, token);
							return;
						}
						
					}

					logger.error("TrestClient._call.error: Echec requête "+token.requestId+": "+errorThrown+" sur ",url);

					var readyState = "?";
					if (jqXHR.readyState == 0) readyState = "request not initialized";
					if (jqXHR.readyState == 1) readyState = "server connection established";
					if (jqXHR.readyState == 2) readyState = "request received ";
					if (jqXHR.readyState == 3) readyState = "processing request";
					if (jqXHR.readyState == 4) readyState = "request finished and response is ready";

					var headers = (jqXHR.getAllResponseHeaders());

					var responseText = jqXHR.responseText;
					if ((typeof jqXHR.responseText == "string")&&(jqXHR.responseText.length > 1000))
						responseText = responseText.substring(0, 1000)+" ...";
					
					var responseXml = jqXHR.responseXml;
					if ((typeof jqXHR.responseXml == "string")&&(jqXHR.responseXml.length > 1000))
						responseXml = responseXml.substring(0, 1000)+" ...";

					logger.debug("responseHeaders="+headers);
					logger.debug("readyState="+readyState);
					logger.debug("responseText = "+responseText);
					logger.debug("responseXml = "+responseXml);
					logger.debug("textStatus="+textStatus);
					logger.debug("errorThrown = "+errorThrown);

					var e = this._getErrorEvent(jqXHR, method, errorThrown,path, token);

					if (e.data.status == 401){
						e.data.responseText = "Vous n'êtes pas connecté.";
					}
					this.dispatchEvent(e);

					if (defined(failure))
						failure(e, token)
				}
			});

			return req;	
	}
});

TrestClient.lastTokenId = 0;