
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
	      logger.error("Event window.hashchanging not supported!")
	    }
  	},
  	refreshkeys: function()
  	{
		var hash = window.location.hash.droite('#');
		this.keys = this.decode(hash);
  	},
  	registerComponent: function(c, onhashchange)
  	{
  		this.refreshkeys();
  		this.listeners[c.hashKey] = {owner: c, onhashchange: onhashchange.bind(c)};
  	},

  	getHash: function(owner)
  	{
  		this.refreshkeys();
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
			//logger.debug("RETOUR Onhashchange="+r);
			sendEvents = true;	
		}
		else
		{
			logger.debug("setHash "+value+" => inchangé sur "+owner.id);
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
				logger.error("Echec decodage de "+str+" en objet: "+err);
			}
		}
		/*else
		{
			logger.error("Echec decodage  de "+str+" en objet: chaine vide");
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
	    			if (obj[k].trim() != "")
	    			r = r+k+"="+obj[k]+"&";
	    		}
	    		
	    		if (this.base64encode)	
	    		r = base64encode(r);  

		}catch(err)
		{
			logger.error("Echec encodage de "+obj+" en string: "+err);
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

  		var found = false;
  		for (k in this.keys){
  			found = true;
  			logger.debug("keys."+k+" = "+this.keys[k]+", hash."+k+" = "+this.keysTmp[k]);
  			if (this.keysTmp[k] != this.keys[k])
	    	{
	    		this.keys[k] = this.keysTmp[k] ||null;
	    		if (typeof this.listeners[k] != "undefined"){
	    			logger.debug("Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    			this._dispatchOnhashchange(k, this.keys[k]);   

	    		}
	    	}
  		}
  		if (found == false)
  		{
  			for (k in this.keysTmp){
  				found = true;
  				if (typeof this.listeners[k] != "undefined")
  					this._dispatchOnhashchange(k, this.keysTmp[k]);   
  			}
  		}
  		if (found == false){
  			if (typeof this.listeners[k] != "undefined")
  					this._dispatchOnhashchange(null, null);   
  		}
	   /* for (k in this.keysTmp)
	    {

	    	//logger.debug("keys["+k+"] = "+this.keys[k]+" this.keysTmp[k] = "+this.keysTmp[k]);
	    	if (this.keysTmp[k] != this.keys[k])
	    	{
	    		this.keys[k] = this.keysTmp[k];
	    		if (typeof this.listeners[k] != "undefined"){
	    			logger.debug("Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    			this._dispatchOnhashchange(k, this.keys[k]);   

	    		}
	    	}
	    	
	    }*/
	    
		var evt = new Tevent(Trouter.HASH_CHANGE,  this.keys);
	    this.dispatchEvent(evt);

		
		return false;
  	}

});

Trouter.HASH_CHANGE = "HASH_CHANGE" ;

panjs.router = new Trouter();