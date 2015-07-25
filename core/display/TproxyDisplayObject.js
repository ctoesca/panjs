
defineClass("TproxyDisplayObject", "panjs.core.events.TeventDispatcher",
{ 
	autoload: false,
	loaded: false,
	sourceElement:null,
	parent: null,
	args: null,
	dataType: null,

	/* METHODES */
	constructor: function(args) { 
		TproxyDisplayObject._super.constructor.call(this,args);
		this.className = "TproxyDisplayObject"; //!! pas valorisé si chargé dans panjs.min.js car on appelle pas uses

		this.injectParam("sourceElement", args.sourceElement,true);
		this.sourceElement.style.display = "none";
		this.sourceElement.setAttribute("data-loaded", "false");
		this.dataType = this.sourceElement.getAttribute("data-compo");	

		this.args = args;

		if (this.args == null)
				this.args = {};
		
  		//logger.debug("init TproxyDisplayObject: ",this.dataType,", id="+this.id+", args="+args);
  	},
  	load: function(args)
  	{
		var h = this.sourceElement;

		//panjs.setElementArgs(this.sourceElement, this.args);

		

		if ((h != null) && (this.loaded == false))
		{	
			var origId = h.originalId;
			logger.debug("LOADING "+this.dataType+"."+origId);

			this.args.elem = h;
			this.args.parent = this.parent;

			if (arguments.length > 0)
			{
				for (var k in args){
					this.args[k] = args[k];

				}
			}

			this.dispatchEvent( new Tevent( Tevent.BEFORE_LOAD, {args:this.args, dataType:this.dataType}));
			var compo = this.parent.createComponent(this.dataType,this.args);	
	
	
			this.args.elem.compo = compo;
			compo.parent = this.parent;
			h.owner[origId] = compo;
		
			$(h).replaceWith(compo.container);
			compo.container[0].originalId = origId;
			compo.container[0].loaded = true;
			compo.container.attr("data-loaded", "true");
			
			compo.loaded = true;		

			if (compo.visible)
			compo.show();
	
			h.setAttribute("id", h.owner.id+"_"+origId);

			var evt = new Tevent( Tevent.LOADED, compo);
			this.dispatchEvent( evt);
			return compo;
		}
  	},
  	hide: function()
  	{

  	},
  	show: function()
  	{
  		this.load( this.args );
  	}
});



