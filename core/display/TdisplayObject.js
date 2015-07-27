
/*
TdisplayObject

	height : Number
	name : String
	visible : Boolean
	width : Number
	x: int
	y: int

added
Dispatched when a display object is added to the display list.	DisplayObject
 	 	
addedToStage
Dispatched when a display object is added to the on stage display list, either directly or through the addition of a sub tree in which the display object is contained.	DisplayObject
 	 	 		 	
removed
Dispatched when a display object is about to be removed from the display list.	DisplayObject
 	 	
removedFromStage
Dispatched when a display object is about to be removed from the display list, either directly or through the removal of a sub tree in which the display object is contained.	DisplayObject
 	 	
render
[broadcast event] Dispatched when the display list is about to be updated and rendered.
 
*/


defineClass("TdisplayObject", "panjs.core.events.TeventDispatcher",
{ 
	/* PROPRIETES */

	container:null,
	id:null,
	parent:null,
	_parent:null,
	visible:true,	//Etat de départ
	autoload: true,
	loaded: false,
	baseElement:null,
	
	_realVisible: false,
	args: null,
	
	load:function(){
		/* Si on ne sait pas si l'objet est un proxy ou pas, on appelle load 
		ça ne génèrera pas d'erreur, bien que le composant soit déjà chargé
		*/
		return this;
	},
	free: function(){
		TdisplayObject._super.free.call(this);
		this.container.remove();
	},

	_onInitialized: function()
	{
	},
	
	constructor: function(args) { 
		TdisplayObject._super.constructor.call(this,args);
		this.args = args;

		if (this.baseElement == null)
			throw "La propriété \"baseElement\" n'est pas défini sur "+this.className;

		/* Création du conteneur */

		this.container = $('<'+this.baseElement+"/>");
		//this.container.css("display", "none");	

		window[this.className].lastId ++;

		this.container[0].owner = this;
		
  		//logger.debug("init TdisplayObject: ",this.className,", id=",this.id);
  	},
  	addClass: function(v){
  		this.container.addClass(v);
  	},
  	removeClass: function(v){
  		this.container.removeClass(v);
  	},
  	createComponent: function(classPath, args){
  		var compo = panjs.createComponent(classPath,args);
  		return compo;
  	},
  	
  	appendTo: function(elem){		
  		elem.append(this.container);		
	},
	prependTo: function(elem){ 		
  		this.container.prependTo(elem);		
	},

  	hide: function(args){	 
 
  		this.container.hide(args);
  		this.visible = false;
  		this._realVisible = this.visible;
  	
  		if (typeof this._onHide != "undefined")
  		this._onHide();
  	},
  	show: function(args){

  		if (this._realVisible)
  			return;

		this.container.show(args);

  		this.visible = true;
  		this._realVisible = this.visible;

  		if (typeof this._onShow != "undefined")
  		this._onShow();

  	},
  	toggle: function(args){
  		this.container.toggle('fast');
  		this.visible = !this._visible;
  	}
});

/*  STATIC */


