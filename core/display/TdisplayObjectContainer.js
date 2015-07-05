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

	_statesElements: null,
	currentState: null,
	defaultState: null,
	_bindElements : null,
	__bindings:null,
	_children: null,

	constructor: function(args) { 	
		this._bindElements = [];
		this.__bindings = { html: [] };
		
		TdisplayObjectContainer._super.constructor.call(this,args);
		if (this._children == null)
  			this._children = [];

		this._children = [];
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
				//logger.error(script);
		    	var sl = new Function(script).bind(this);
		    	sl(el, evtName);		
			}
		    //this._bindElements.push(el);
		}	
    },
    bindEvents: function(el) {
    	var events = ["click", "change", "blur", "keyup", "dblclick"]; 	
    	for (var i=0; i< events.length; i++){
    		this.bindEvent(el, events[i]);
    	}	
    	this.bind(el);
    },

   	bind: function(el) {
   		/*var html = el.html();
    	if (html.match(/\{\{.*\}\}/))
    	{
			var tempFn = doT.template(html).bind(this);
			this.__bindings.html.push({template: html, element: el, tempFn: tempFn});
    	}*/
    },

	renderBindings: function(){
		for (var i=0; i < this.__bindings.html.length; i++)
		{
			var b = this.__bindings.html[i];
			
			try{
				//logger.error("RENDER "+b.template+" => "+b.tempFn(this));
				b.element.html( b.tempFn(this) );	
			}catch(err){
				logger.error(err);
			}			
		}
	},
	createComponent: function(classPath, args){
  		var compo = TdisplayObjectContainer._super.createComponent(classPath,args);
  		if (this._children == null)
  			this._children = [];
  		this._children.push(compo);
  		return compo;
  	},
	  		
    free: function(){

    	if (this._children != null)
    	{
    		TdisplayObjectContainer._super.free.call(this);
			for (var i=0; i<this._children.length; i++)				
				this._children[i].free();
			
			this._children = null;
    	}
		//inutile de désaffecter les events sur les objets jquery car remove() le fait.
		//!!par contre, ce n'est pas le cas pour les composants panjs (il faut appeler free() sur tous les compo)
	},
	__OnPropChanged: function(propName, oldValue, newValue, object){
		//logger.debug("__OnPropChanged : propName = "+propName+", oldValue = "+oldValue+", newValue = "+newValue);
		this.renderBindings();		
	},
  	processStates:function(element)
  	{
		var includeIn = element.getAttribute("includeIn");		
		if (includeIn != null)
	  		includeIn = includeIn.split(" ");
	  	var includeLogic = element.getAttribute("includeLogic") ||"OR"; 
	  		  		  	

	  	var excludeFrom = element.getAttribute("excludeFrom");
	  	if (excludeFrom != null)
			excludeFrom = excludeFrom.split(" ");
		var excludeLogic = element.getAttribute("excludeLogic") ||"OR"; 			
	  	

	  	if ((excludeFrom != null) && (includeIn != null))
	  		throw "'excludeFrom' and 'includeIn' attributes are exclusive";
		
	
	  	if ((includeIn != null) || (excludeFrom != null)){
	  		//logger.debug("includeIn = "+includeIn+", includeLogic="+includeLogic+", excludeFrom = "+excludeFrom+", excludeLogic="+excludeLogic);
	  		var obj = {visible: null, excludeLogic: excludeLogic, includeLogic: includeLogic, elem: element, id:element.getAttribute("id"), includeIn: includeIn, excludeFrom: excludeFrom};
	    	this._statesElements.push( obj );
	  	}    
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

	_setStateElementVisible: function(visible, stateObj)
	{ 
		var isCompo = (stateObj.elem.getAttribute("data-compo") != null);
		var r = false;

		//if (logger.isLevelEnabled(Tlogger.TRACE))
		//	logger.trace("_setStateElementVisible show="+visible+", isCompo="+isCompo+", id="+stateObj.id);

		if (stateObj.visible != visible)
		{
			r = true;
			if (visible)
			{	   
				//affichage de l'élément
				if (isCompo) 
				{
					// composant
					stateObj.elem.compo.load();
					stateObj.elem.compo.show();
				}
				else
				{
					// objet jquery
					$(stateObj.elem).show(); 
				}
			}
			else
			{
				if (isCompo) 
				{
					// composant
					stateObj.elem.compo.hide();
				}
				else
				{
					// objet jquery
					$(stateObj.elem).hide();
				}		   
			}
			stateObj.visible = visible;
		}
 		return r;
		
	},
	hasState: function(state){
		var r = false;

		if (typeof state == "string")
		{
			for (var j=0; j< this.currentState.length; j++)
			{
				if (this.currentState[j] == state)
				{
					r = true;
					break;
				}
			}
		}else{
			logger.error("hasState error: state is undefined");
		}
		
		return r;
	},
	addState: function(state){

		var changed = false;

		if (typeof state == "string")
		{
			var currentState = [];
			var found = false;
				
			
			for (var j=0; j< this.currentState.length; j++)
			{
				if (this.currentState[j] == state){
					found = true;
				}else{
					currentState.push(this.currentState[j]);
				}
			}
			
			if (!found){
				changed = true;
				currentState.push(state);
				this.setState(currentState);
			}
		}else{
			logger.error("addState error: state is undefined");
		}
	
		return changed;
	},
	removeState: function(state){

		var changed = false;

		if (typeof state == "string")
		{
			var currentState = [];
			
			for (var j=0; j< this.currentState.length; j++){
				if (this.currentState[j] != state)
					currentState.push(this.currentState[j]);
				else
					changed = true;
			}
			if (changed)
				this.setState(currentState);
			
		}else{
			logger.error("removeState error: state is undefined");
		}	
		return changed;

	},
	setState: function(mixed)
	{
		/*
			- On affiche les éléments ayant includeIn = un des states passé en argument
			- On cache les éléments ayant excludeFrom = un des states passé en argument
		*/
		
		var newStatesHash = {};
		var oldStatesHash = {};

		var changed = false;
		if (typeof mixed != 'object'){
			
			var states = [];
			for (var i=0; i< arguments.length; i++){
				if (arguments[i] != undefined){
					states.push(arguments[i]);
					newStatesHash[arguments[i]] = 1;
				}else{
					logger.error("setState error: state is undefined");
				}
			}
		}else{

			var states = mixed;
			for (var i=0; i < states.length; i++)
				if (states[i] != undefined)
					newStatesHash[states[i]] = 1;
				else
					logger.error("setState error: state is undefined");
		}
	
		
		var oldStates = this.currentState;
		for (var i=0; i < this.currentState.length; i++){
			this.container.removeClass(this.currentState[i]);	
			oldStatesHash[ this.currentState[i] ] = 1;
		}

		this.currentState = [];
		
		for (var j=0; j< this._statesElements.length; j++)
		{	
			var el = this._statesElements[j];

			var included = true;
			var excluded = true;

			if  (el.includeIn != null)
			{
				excluded = null;
				included = true;

				for (var i=0; i<el.includeIn.length; i++)
				{
					var stateName = el.includeIn[i];

					var stateIncluded = (typeof newStatesHash[stateName] != "undefined");

					if (el.includeLogic == "OR")
					{
						included = stateIncluded;
						if (included)
							break;		
					}else{
						included = included && stateIncluded;
					}
				}
			}else if  (el.excludeFrom != null)
			{
				excluded = false;
				included = null;
				for (var i=0; i<el.excludeFrom.length; i++)
				{
					var stateName = el.excludeFrom[i];
					var stateIncluded = (typeof newStatesHash[stateName] != "undefined");
					
					if (el.excludeLogic == "OR")
					{
						excluded = stateIncluded;
						if (excluded)
							break;		
					}else{
						excluded = excluded && stateIncluded;
					}
				}
			}
								
			if ((included != null)||(excluded != null)){				
				var show = ((included == true) || (excluded == false));
			

				var ch = this._setStateElementVisible( show, el);
				changed = ch || changed ;
			}
		}	
		
		this.currentState = [];
		for (var k in newStatesHash){
			this.currentState.push(k);
			this.container.addClass(k);
		}

		if (changed){
			if (logger.isLevelEnabled(Tlogger.TRACE))
				logger.trace(this.id+".currentState = "+JSON.stringify(this.currentState));

			var statesAdded = [];
			for (k in newStatesHash)
				if (typeof oldStatesHash[k] == "undefined")
					statesAdded.push(k);
			
			var statesRemoved = [];
			for (k in oldStatesHash)
				if (typeof newStatesHash[k] == "undefined")
					statesRemoved.push(k);

			this.dispatchEvent(new Tevent(Tevent.STATE_CHANGED, {oldStates: oldStates, newStates: this.currentState, removedStates: statesRemoved, addedStates:statesAdded}));
		}
		
		return changed;
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
									//creation instance du composant
									var compo = this.createComponent(dataType,{elem:el, parent:this});	

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
											
									//if (compo.visible == true)
									//{					
										$(el).replaceWith(compo.container);										
										compo.container[0].owner = compo;				
									/*}
									else
									{
										logger.info("PAS DE replaceWith pour ",compo.id ," visible = ",compo.visible," ",typeof compo.visible);
									}*/
							
									el.loaded = true;
									el.compo = compo;
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
									el.compo = proxyCompo;
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
