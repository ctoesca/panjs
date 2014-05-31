
defineClass("TproxyDisplayObject", "core.events.TeventDispatcher",
{ 
	autoload: false,
	loaded: false,
	sourceElement:null,
	parent: null,

	/* METHODES */
	constructor: function(args) { 
		TproxyDisplayObject._super.constructor.call(this,args);
		this.className = "TproxyDisplayObject"; //!! pas valorisé si chargé dans panjs.min.js car on appelle pas uses

		this.injectParam("sourceElement", args.sourceElement,true);
		this.sourceElement.style.display = "none";

  		//logger.debug("init TproxyDisplayObject: ",this.className,", id=",this.id);
  	},
  	load: function(args)
  	{
		var h = this.sourceElement;

		if ((h != null) && (this.loaded == false))
		{		
			var dataType = h.getAttribute("data-compo");	
		
			var origId = h.originalId;
		

			if (arguments.length == 0)
			{
				var args = {elem:h, parent: this.parent};
			}
			else{
				args.elem = h;
				args.parent = this.parent;
			}


			var compo = panjs.createComponent(dataType,args);	
		
			compo.parent = this.parent;
			h.owner[origId] = compo;
	
			$(h).replaceWith(compo.container);
			compo.loaded = true;		

			if (compo.visible)
			compo.show();

			
			h.setAttribute("id", h.owner.id+"_"+origId);

			this.dispatchEvent( new Tevent( Tevent.LOADED, compo));
			return compo;
		}
  	},
  	hide: function()
  	{

  	},
  	show: function()
  	{
  		
  	}
});



