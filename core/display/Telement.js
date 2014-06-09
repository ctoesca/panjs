/*
Classe basée sur un template.
Cette classe peut être dérivée mais n'est pas instanciable telle quelle.
*/

defineClass("Telement", "core.display.TdisplayObjectContainer",
{ 
	/* PROPRIETES */
	html:null,
	content: null,	
	sourceElement:  null, 
	inheritsStyle: true,
	enableHashManager: false,
	hashKey: null,
	sourceElementStyle: null,

	/* METHODES */	
	constructor: function(args) { 
		
		Telement._super.constructor.call(this,args);

		
		if (this.enableHashManager == true){
			uses("core.managers.Trouter");
			if (this.hashKey == null)
				this.hashKey = this.id;
			panjs.router.registerComponent(this, this._onHashChange, this.hashKey);
		}

		var styleClass;
		if (this.inheritsStyle)
			styleClass = this.classHierarchy.droite("Telement");
		else
			styleClass = this.className;

		this.container.addClass(styleClass);

		if (typeof args != "undefined")
		{
			if (defined(args, "elem"))
			{
				/* On injecte les attributs de l'élément dans args */
				var el = args.elem;
				
				for ( var i =0; i< el.attributes.length; i++)
	        	{
	            	var attr =  el.attributes.item(i);


	            	var name = attr.nodeName.toLowerCase();

	            	if ((name != "id")&&(name != "data-compo"))
	            	{
	            		if (name.startsWith("data-"))
	            			name = name.droite("-");
	            		var value = attr.value;

	            		if (value == "true")
	            			value = true;
	            		if (value == "false")
	            			value = false;

	            		args[name] = value;
	            			
	            		//ATTENTION: attr.nodeName est toujours en lowerCase
	            		//logger.info("Attribut "+this.id+" , "+name+"="+attr.value);
	            	}
	            	if (name == "includeinstate"){
	            		this.includeInState = value; 
	            		//Ajout de l'attribut includeinstate pour qu'il soit parsé dans processStates
	            		this.container.attr("includeInState", this.includeInState);
	            	}

	        	}
		
				/* On injecte le contenu de l'élément source dans l'élément <CONTENT> */	
				this.sourceElement = args.elem;	

				if (this.content != null)
				{
					if (this.sourceElement.innerHTML.trim() != ""){
					
						this.content[0].innerHTML = this.sourceElement.innerHTML;
						if (typeof args.parent != "undefined"){

							args.parent._populateElements(this.content[0], true,[]);
						}
					}
				}

				/* On vide l'élément source */
				//this.sourceElement.innerHTML = "";
				

			}
	  			
			if (args.elem)
			{
					var tmpStyle = args.elem.getAttribute("data-inline-style");
					if (tmpStyle != null){
						this.sourceElementStyle =  tmpStyle;	
						this.setStyle(tmpStyle);
					}
			}
		}
		

		
  	},
  	
	setStyle: function(css)
   	{
		this.container.attr("style", css);  
  	},

  	_onHashChange: function(hash)
  	{
		var r = false;
		
  		if (this.enableHashManager) 
  		if (typeof this.onHashChange === "function"){
  			logger.debug("Telement._onHashChange => "+hash);
  			r = this.onHashChange(hash);
  		}
  		return r;
  	},
	free: function(){
	},

  	_onShow: function(){
  	 	this._onHashChange( panjs.router.getHash(this));
  	},
  	setHash:function(hash)
  	{
  		if (this.enableHashManager) 
  		 panjs.router.setHash(this, hash);
  	},
	getHash:function()
  	{
  		if (this.enableHashManager) 
  		 	return panjs.router.getHash(this);
  		else
  			return null;
  	}
});




