
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

__CLASSPATH__="panjs.core.display.TdisplayObject";
defineClass("TdisplayObject", "panjs.core.events.TeventDispatcher",
{ 
	/* PROPRIETES */

	container:null,
	id:null,
	owner:null,
	visible:true,	//Etat de départ
	autoload: true,
	baseElement:null,
	_realVisible: false,
	args: null,
	_resizeFunction: null,

	/* Si on ne sait pas si l'objet est un objet jquery ou pas, 
		la fonction isLoaded() et load() doivent pouvoir être appelées.
	*/
	load:function(){
		return this;
	},
	isLoaded:function(){
		return true;
	},
	onWindowResize: function(f){

      if (f != this._resizeFunction){

          if (this._resizeFunction)
               $(window).off("resize", this._resizeFunction);
           
          this._resizeFunction = f
          $(window).on("resize", f);

      }
    },
    
	free: function(){

		TdisplayObject._super.free.call(this);

		if (this._resizeFunction)
            $(window).off("resize", this._resizeFunction);
		this.container.remove();
		/*<ENV:dev>*/
        panjs.capture("free",{classPath: this.classPath, componentId: this.id});
        /*</ENV:dev>*/

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

		panjs._classes[this.classPath].lastId ++;
		this.id = this.classPath+"_"+panjs._classes[this.classPath].lastId;

		
		this.container[0].owner = this;
		this.container[0].compo = this;
		
		
  		//logger.debug("init TdisplayObject: ",this.className,", id=",this.id);
  	},
  	addClass: function(v){
  		this.container.addClass(v);
  	},
  	removeClass: function(v){
  		this.container.removeClass(v);
  	},
  	createComponent: function(classPath, args, sendData){

  		var compo = panjs.createComponent(classPath,args, false);
  		

  		return compo;
  	},
  	_triggerOnAdded: function(){
  		if (this._onAdded){
			if ($.contains( document.body, this.container[0] )){
				this._onAdded();	
			}else{
				setTimeout( function(){
					if ($.contains( document.body, this.container[0] ))
						this._onAdded();	
					}.bind(this), 50);
			}
		}
  	},
  	append: function( mixed){		
  		var source = mixed;
  		var dest = this.container;
  		
  		if (mixed.isCompo())
  		{
  			var source = mixed.container;
  			if (this.content != null)
  				dest = this.content;
  		}
	
		dest.append(source);	

  		if (mixed._onAdded)
  			mixed._onAdded();	
  		
	},
  	appendTo: function(elem){		
  		elem.append(this.container);		
  		if (elem.isCompo())
  			elem[0].owner._children.push(this);
  		
  		this._triggerOnAdded();
	},
	prependTo: function(elem){ 		
  		this.container.prependTo(elem);		
  		if (elem.isCompo())
  			this._children.push(elem[0].owner);
	},

  	hide: function(args){	

 		if (defined(args, "hideFn"))
  			args.hideFn(this.container);
  		else
  			this.container.hide(args);

  		this.visible = false;
  		this._realVisible = this.visible;
  	
  		if (typeof this._onHide != "undefined")
  		this._onHide();
  	},
  	show: function(args){

  		if (this._realVisible)
  			return;
  		if (defined(args, "showFn"))
  			args.showFn(this.container);
  		else
			this.container.show(args);

  		this.visible = true;
  		this._realVisible = this.visible;

  		if (typeof this._onShow != "undefined")
  		this._onShow();

  	},
  	toggle: function(args){
  		this.container.toggle(args);
  		this.visible = !this._visible;
  	}
});

/*  STATIC */


