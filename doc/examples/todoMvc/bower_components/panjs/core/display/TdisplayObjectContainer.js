/*
	numChildren : int

	addChild(child:DisplayObject):DisplayObject
	addChildAt(child:DisplayObject, index:int):DisplayObject
	contains(child:DisplayObject):Boolean
	getChildAt(index:int):DisplayObject
	getChildByName(name:String):DisplayObject
	getChildIndex(child:DisplayObject):int
	removeChild(child:DisplayObject):DisplayObject
	removeChildAt(index:int):DisplayObject
	removeChildren(beginIndex:int = 0, endIndex:int = 0x7fffffff):void
	setChildIndex(child:DisplayObject, index:int):void
	swapChildren(child1:DisplayObject, child2:DisplayObject):void
	swapChildrenAt(index1:int, index2:int):void
*/



defineClass("TdisplayObjectContainer", "core.display.TdisplayObject",
{ 	
	/* PROPRIETES */
	_statesElements: null,
	currentState: null,
	defaultState: null,
	_bindElements : null,
	__bindings:null,



	/* METHODES */	
	constructor: function(args) { 	
		this._bindElements = [];
		this.__bindings = { html: [] };
		TdisplayObjectContainer._super.constructor.call(this,args);
		this._statesElements = [];
		this.currentState = [];

		if (defined(this.html) && (this.html.trim() != ""))
		{			
			this.container.html(this.html);		
			this._populateElements(this.container[0],true,[]);		
		}

  		//logger.debug("init TdisplayObjectContainer: "+this.className+". args="+args);
  	},

	bindEvent: function(el, evtName) {
		var on_evt_attr = el.attr("data-on"+evtName);

		if (on_evt_attr)
		{
			if (on_evt_attr.startsWith("{{")){
				var script = on_evt_attr.droite("{{").gauche("}}");
				var f = new Function(script).bind(this);
				el.on(evtName, f);
			}else{
				var script = 'arguments[0].on("'+evtName+'", '+on_evt_attr+'.bind(this))';
		    	var sl = new Function(script).bind(this);
		    	sl(el, evtName);		
			}
		    //this._bindElements.push(el);
		}	
    },
    bindEvents: function(el) {
    	var events = ["click", "change", "blur", "blur", "keyup", "dblclick"]; 	
    	for (var i=0; i< events.length; i++){
    		this.bindEvent(el, events[i]);
    	}	
    	this.bind(el);
    },

   	bind: function(el) {
   		var html = el.html();
    	if (html.match(/\{\{.*\}\}/))
    	{
			el.tempFn = doT.template(html).bind(this);
			this.__bindings.html.push({template: html, element: el, tempFn: el.tempFn});
    	}
    },
	renderBindings: function(){
		for (var i=0; i < this.__bindings.html.length; i++)
		{
			var b = this.__bindings.html[i];
			logger.debug("RENDER "+b.template);
			try{
				b.element.html( b.tempFn(this) );	
			}catch(err){
				logger.error(err);
			}
			
		}
	},
    free: function(){

		TdisplayObjectContainer._super.free.call(this);
		//inutile de désaffecter les events sur les objets jquery car remove() le fait.
		//!!par contre, ce n'est pas le cas pour les composants panjs (il faut appeler free() sur tous les compo)
	},
	__OnPropChanged: function(propName, oldValue, newValue){
		logger.debug("__OnPropChanged : propName = "+propName+", oldValue = "+oldValue+", newValue = "+newValue);
		this.renderBindings();		
	},
  	processStates:function(element)
  	{
		var includeIn = element.getAttribute("includeIn");
		if (includeIn!= null)
		{
	  		if (includeIn.indexOf(",")>=0)
	  			includeIn = includeIn.split(",");
	  		else
	  			includeIn = [includeIn];
	  	}


	  	var excludeFrom = element.getAttribute("excludeFrom");
	  	if (excludeFrom != null)
	  	{
	  		if (excludeFrom.indexOf(",")>=0)
	  			excludeFrom = excludeFrom.split(",");
	  		else
	  			excludeFrom = [excludeFrom];
	  	}

	  	if ((includeIn != null) || (excludeFrom != null))
	    	this._statesElements.push({elem: element, id:element.getAttribute("id"), includeIn: includeIn, excludeFrom: excludeFrom});
	    
  	},
  	stateExists: function(state)
	{
	    var r = false;
	    if ((state == null)||(state==""))
	    	return false;

	    for (var i=0; i< this._statesElements.length; i++)
	    {
	    	var s = this._statesElements[i];
	        if ((s.includeIn!=null) && (s.includeIn.indexOf(state)>=0))
	        {
	          r = true;
	          break;
	        }else
	        if ((s.excludeFrom!=null) && (s.excludeFrom.indexOf(state)>=0))
	        {
	          r = true;
	          break;
	        }
	    }
	    return r;
	},

	_setStateElementVisible: function(visible, state)
	{ 
 		if (visible)
		{	   
				//on affiche l'élément
				if (this[state.elem.originalId])
				{

					if (this[state.elem.originalId].className) 
					{
						// c'est un composant

						this[state.elem.originalId].load();
						this[state.elem.originalId].show();
					}
					else
					{
						// c'est un objet jquery
						$(state.elem).show(); 
					}
				}
				else
				{
					$(state.elem).show();
				}
		}
		else
		{
				if (this[state.elem.originalId])
				{
					if (this[state.elem.originalId].className)
					{
						// c'est un composant
						this[state.elem.originalId].hide();
					}
					else
					{
						// c'est un objet jquery
						$(state.elem).hide();
					}
				}
				else
				{
					$(state.elem).hide();
				}
			   
		}
	},
	setState: function()
	{
		/*
			- On affiche les éléments ayant includeIn = un des states passé en argument
			- On cache les éléments ayant excludeFrom = un des states passé en argument
		*/
	
		var oldStates = this.currentState;
		this.currentState = [];
	
		var flag = false;

		for (var j=0; j< this._statesElements.length; j++)
		{	
			var el = this._statesElements[j];

			var included = null;
			var excluded = null;

			for (var i=0; i<arguments.length; i++)
			{
				var stateName = arguments[i];

				if (this.stateExists(stateName))
				{		
					if (flag == false)
			 			this.currentState.push(stateName);

					if ((el.includeIn != null)&&(included != true))
					{
						included = (el.includeIn.indexOf(stateName) >= 0);						
					}

					if ((el.excludeFrom != null)&&(excluded != true))
					{
						excluded = (el.excludeFrom.indexOf(stateName) >= 0);	
						if (excluded)				
							break;
					}
				}
				
			}
			
			flag = true;						

			if ((included != null)||(excluded != null)){
				//logger.debug("setState "+this.currentState+": affichage "+el.id+", included="+included+", excluded="+excluded);
				//On  intervient que si included est défini (non null)
				var show = (((included == true)||(included == null)) && ((excluded == false)||(excluded == null)));
				this._setStateElementVisible( show, el);
			}
			
		}	
	
		for (var i=0; i< this.currentState.length; i++){
			this.dispatchEvent(new Tevent(Tevent.STATE_CHANGED, {oldStates: oldStates, state: this.currentState[i]}));
		}
	},

	_populateElements: function(element, setObject, r)
	{		

		//logger.info("_populateElements sur "+this.className+", element.id="+element.getAttribute("id")+", nodeName="+element.nodeName);
		
		/*
		Renvoie un tableau contenant tous les id des éléments contenus dans "element", en récursif.
		setObject: true/false. Si false, l'élément trouvé n'est pas stocké:
					Cas du parsing de <CONTENT>: on ne veut pas que les éléments de <CONTENT> soient stockés 
					car ils appartiennet à l'objet parent.
					Exemple:
					<VBox>
						<Label id="label1" text="OK label1"/>
						<Label id="label2" text="OK label2"/>
					</VBox>
					La VBox et les 2 labels sont sur l'objet parent.
					Les 2 labels sont en fait injecté ici, mais ne font pas partie du template.
		*/

	
		for (var i=0; i < element.childNodes.length; i++)
		{
				var el = element.childNodes[i];

				if (el.nodeType == 1)
				{
					//nodeType = ELEMENT	
		
						var id = el.getAttribute("id");
						var dataType = el.getAttribute("data-compo");		


						if (dataType == null)
						{	
							var jqobj = $(el);		
							if ((setObject)&&(id != null))
							{
								if (defined(this[id]))
									logger.error('1-Duplication du id "'+id+'" sur objet '+this.className);
							
								//logger.debug('Affectation '+id+' sur objet '+this.className);
								var fId = panjs.getFormatedIdName(id);
								this[fId] = jqobj;
								r.push(id);	
							}
							this.bindEvents( jqobj );
							
							this._populateElements(el,setObject, r);
						}
						else
						{
							if (dataType == this.classPath)
							{
								logger.error("Référence circulaire dans "+this.classPath);
							}
							else
							{

								var autoload = !(el.getAttribute("autoload") === "false");
							
								if (autoload)
								{
									//On crée l'instance du composant
									
									var compo = panjs.createComponent(dataType,{elem:el, parent:this});	
									/*if (compo.className == "TerrorElement"){
							
										panjs.stack.push("Unable to create "+dataType+" : "+compo.message);
									}*/
								
									compo.parent = this;

									if ((setObject)&&(id != null))
									{
										if (defined(this[id]))
											logger.error('2-Duplication du id "',id,'" sur objet ',this.className);
															
										this[id] = compo;	
										r.push(id);										
									}		
											
									if (compo.visible == true)
									{
										
										//alert("AVANT: "+compo.className+" => "+compo.container.css("display"));
										/*Tdropdown:  Display = block */

										$(el).replaceWith(compo.container);										

										//alert("APRES: "+compo.className+" => "+compo.container.css("display"));
										/*Tdropdown:  Display = inline-block */

										compo.container[0].owner = compo;
									
										//compo.show();						
									}
									else
									{
										logger.info("PAS DE replaceWith pour ",compo.id ," visible = ",compo.visible," ",typeof compo.visible);
									}

									
									el.loaded = true;
									compo.loaded = true;
									
									
								}
								else
								{
									//Le composant n'est pas instancié: on met un proxy à la place, qui a la fonction LOAD()
									el.setAttribute("id", this.id+"_"+id);
									uses("core.display.TproxyDisplayObject");
									var proxyCompo = new TproxyDisplayObject({sourceElement:el});
									

									proxyCompo.parent = this;
									el.loaded = false;
									$(el).hide();
									if ((setObject)&&(id != null))
										this[id] = proxyCompo;
								}

							}						
						}
						el.originalId = id;				
						el.owner = this;
						this.processStates(el);							
					
				}else if (el.nodeType == 8)
				{
					
					var text = "";
					if ((panjs.iever == -1 )||(panjs.iever > 8 ))
						text = el.textContent;
					else
						text = el.text.droite("<!--").gauche("-->").trim();

					text = text.toUpperCase();

					if (text == "CONTENT")
					{
						
						var c = document.createElement("div");
						c.setAttribute("data-class", "content");
						


						element.replaceChild(c, el);					
						this.content = $(c);
					}	

					
					
				}
		}
		
		
		return r;

	}  	
});


/*  STATIC */
TdisplayObjectContainer._listeIdElements = [];
