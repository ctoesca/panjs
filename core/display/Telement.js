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
		this.container.attr("data-compo", this.classPath);
		this.container.attr("data-class-name", this.className);

		if (typeof args != "undefined")
		{
			if (defined(args, "elem"))
			{
				/* On injecte les attributs de l'élément dans args */
				var el = args.elem;
							
				/* On injecte le contenu de l'élément source dans l'élément <CONTENT> */	
				this.sourceElement = args.elem;	

				if (this.content != null)
				{
					if (this.sourceElement.innerHTML.trim() != ""){
					
						this.content[0].innerHTML = this.sourceElement.innerHTML;
						if (typeof args.parent != "undefined"){
							this.parent = args.parent;
							args.parent._populateElements(this.content[0], true,[]);
						}
					}
				}

				/* On vide l'élément source */
				//this.sourceElement.innerHTML = "";
	
				
				var tmpClass = args.elem.getAttribute("class");
				if (tmpClass != null){
					this.container.addClass(tmpClass);
				}
			}	
		}
	
		var tmpStyle = args.inlineStyle || null;
		if (tmpStyle != null){
			
				this.sourceElementStyle =  tmpStyle;	
				this.setStyle(tmpStyle);
		}
		/*if (this.visible == false){
			this.hide();
		}*/
		
  	},

  	

	setStyle: function(css)
   	{
		this.container.attr("style", css);  
  	},

  	_onHashChange: function(hash, oldValue)
  	{
		var r = false;
		
  		if (this.enableHashManager) 
  		if (typeof this.onHashChange === "function"){
  			logger.debug("Telement."+this.id+"._onHashChange: "+oldValue+" --> "+hash);
  			r = this.onHashChange(hash, oldValue);
  		}
  		return r;
  	},
	
  	_onShow: function(){
  	 	//this._onHashChange( panjs.router.getHash(this));
  	},
  	_onHide: function(){

  	},

  	setHash:function(hash, silent)
  	{
  		if (this.enableHashManager){
  			if (arguments.length < 2)
  				var silent = false;
  		 	panjs.router.setHash(this, hash, silent);
  		}
  	},
	getHash:function()
  	{
  		if (this.enableHashManager) 
  		 	return panjs.router.getHash(this);
  		else
  			return null;
  	}
});




