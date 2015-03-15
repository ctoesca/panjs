
defineClass("Trouter", "core.events.TeventDispatcher", {
	
	hash: "",
    sendEvents: true,
    keys: {},
    listeners: {},
    base64encode: false,

	constructor: function(args) {
		Trouter._super.constructor.call(this,args);

  		if ("onhashchange" in window) 
	    {
	      window.onhashchange = this.onhashchange.bind(this);
	    }
	    else    
	    {
	      logger.error("Trouter.constructor: Event window.hashchanging not supported!")
	    }
  	},
  	refreshkeys: function()
  	{
		var hash = window.location.hash.droite('#');
		this.keys = this.decode(hash);
		//logger.debug("Trouter.refreshkeys: this.keys = "+JSON.stringify(this.keys));
  	},
  	registerComponent: function(c, onhashchange)
  	{
  		this.refreshkeys();
  		this.listeners[c.hashKey] = {owner: c, onhashchange: onhashchange.bind(c)};
  	},

  	getHash: function(owner)
  	{
  		var r = this.keys[owner.hashKey] ||null;
  		return r;
  	},
	setHash: function(owner, value)
  	{
  		//if (typeof value == "undefined")
  		//	value = null;

  		if (this.keys[owner.hashKey] != value)
  		{
  			var oldValue = this.keys[owner.hashKey];

  			this.keys[owner.hashKey] = value||null;
  			var encoded = this.encode(this.keys);
  			sendEvents = false;
			window.location.hash = encoded;
			/*Le fait d'avoir déjà modifié this.keys fait que onhashchange ne détectera pas qeul objet a modifié son hash (pas de différence)
			et n'enverra pas d'evenement donc on envoie l'évènement ici.
			De plus, c'est plus optimisé.
			*/

			var r = this._dispatchOnhashchange(owner.hashKey, value);
			//logger.debug("Trouter.setHash: RETOUR Onhashchange="+r);
			sendEvents = true;	
		}
		else
		{
			logger.debug("Trouter.setHash: "+value+" => inchangé sur "+owner.id);
			//this._dispatchOnhashchange(owner.hashKey, value);
		}

  	},
  	_dispatchOnhashchange: function( hashKey, hash)
  	{
  		if (typeof hash == "undefined")
			hash = null;
		if (hashKey != null)
		{
			var l = this.listeners[hashKey];	
			return l.onhashchange(hash);
		}else{

			for (var hashkey in this.listeners)
			{			
				if (hashkey != null){
					var l = this.listeners[hashkey];
					l.onhashchange(hash);	
				}
			}
		}
  	},
  	decode: function(str)
  	{
  		var r = {};
  		if ((str != ""))
  		{
  			try{

  				if (this.base64encode)	
	    		str = base64decode(str);   

	    		//r = JSON.parse(r);
	    		str = str.split("&");

	    		for (var i=0; i<str.length; i++)
	    		{
	    			if (str[i].trim() != "")
	    			{
	    				var arr = str[i].split("=");
	    				k = arr[0];
	    				v = arr[1];
	    				//if (v.trim() != "")
	    				r[k] = v;
	    			}
	    		}
			}catch(err)
			{
				logger.error("Trouter.decode: Echec decodage de "+str+" en objet: "+err);
			}
		}
		/*else
		{
			logger.error("Trouter.decode: Echec decodage  de "+str+" en objet: chaine vide");
		}*/
		return r;
  	},

  	encode: function(obj)
  	{
  		var r = "";

  		try{
  				
	    		//r = JSON.stringify(object);
	    		for (k in obj)
	    		{
	    			if (typeof obj[k] == 'string')
	    			//if ((obj[k].trim() != "")&&(obj[k].trim() != ""))
	    			r = r+k+"="+obj[k]+"&";
	    		}
	    		
	    		if (this.base64encode)	
	    		r = base64encode(r);  

		}catch(err)
		{
			logger.error("Trouter.encode: Echec encodage de "+obj+" en string: "+err);
			logger.debug("Trouter.encode: obj = "+JSON.encode(obj));
		}
		return r;
  	},

  	onhashchange: function(e)
  	{
  		//*Le hash n'est pas codé (il provient de liens):
  		/* Cette fonction est déclenchée uniquement quand on modifie l'Url manuellement ou que l'on avance ou recule dans l'historique */
  		if (!this.sendEvents)
  			return false;

	    this.hash = window.location.hash.droite('#');
	    this.keysTmp = this.decode(this.hash);

	    /*
		
	    */
		//logger.debug("Trouter.onhashchange: PHASE 1 :");	    
		//logger.debug("Trouter.onhashchange: this.keysTmp = "+JSON.stringify(this.keysTmp));
		//logger.debug("Trouter.onhashchange: this.keys = "+JSON.stringify(this.keys));

  		for (k in this.keysTmp)
	    {
	  		//logger.debug("Trouter.onhashchange: k="+k+" , this.keys[k]="+this.keys[k]+", this.keysTmp[k]="+this.keysTmp[k]);
	    	if ((typeof this.keys[k] == "undefined")||(this.keys[k] == null))
	    	{
	    		//la clef est valorisée alors qu'elle ne l'était pas
	    		this.keys[k] = this.keysTmp[k];
	    		//logger.debug("Trouter.onhashchange: VALORISATION this.keys["+k+"] = "+this.keysTmp[k]);
	    		logger.debug("Trouter.onhashchange: [1] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    		this._dispatchOnhashchange(k, this.keys[k]);   
	    	}else{
				//la clef est valorisée, elle l'était déjà
	    		if (this.keysTmp[k] != this.keys[k])
	    		{
	    			//logger.debug("Trouter.onhashchange: VALORISATION this.keys["+k+"] = "+this.keysTmp[k]);
	    			this.keys[k] = this.keysTmp[k];
	    			logger.debug("Trouter.onhashchange: [2] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    			this._dispatchOnhashchange(k, this.keys[k]);  
	    		}
	    	}
	    	    	
	    }

	    //logger.debug("Trouter.onhashchange: PHASE 2 :");
	    //logger.debug("Trouter.onhashchange: this.keysTmp = "+JSON.stringify(this.keysTmp));
		//logger.debug("Trouter.onhashchange: this.keys = "+JSON.stringify(this.keys));
	    //Mise à null des clefs qui n'existent plus

  		for (k in this.keys){

  			found = true;
  			//logger.debug("Trouter.onhashchange: k="+k+" , this.keys[k]="+this.keys[k]+", this.keysTmp[k]="+this.keysTmp[k]);

  			if (typeof this.keysTmp[k] == "undefined")
	    	{	    			
	    		this.keys[k] = null;
	    		//logger.debug("Trouter.onhashchange: VALORISATION this.keys["+k+"] = null");
	    		logger.debug("Trouter.onhashchange: [3] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    		if (typeof this.listeners[k] != "undefined"){
	    			
	    			this._dispatchOnhashchange(k, this.keys[k]);   
	    		}
	    	}
  		} 
	    
		var evt = new Tevent(Trouter.HASH_CHANGE,  this.keys);
	    this.dispatchEvent(evt);

		
		return false;
  	}

});

Trouter.HASH_CHANGE = "HASH_CHANGE" ;

panjs.router = new Trouter();