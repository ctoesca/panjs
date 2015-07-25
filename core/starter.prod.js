
(function () {

	panjs.logger = null;
	panjs.root = {id:"root", components: {}};
	panjs.loader = null;
	panjs.iever = getIEVersion();
	panjs.chromever = getChromeVersion();
	panjs.ffver = getFirefoxVersion();
	panjs.stack = [];
	panjs.stackLevel = 0;
	panjs.setSourceInComponents = false;

	panjs.messages = {
		CLASSNAME_MATCHS_FILENAME: "The name of the class (%1) must match the file name %2 (case sensitive)",
		LESS_IE8: "less is not fully compatible with IE%1 : transform less code in css",
		LESS_NOT_LOADED: "LESS not loaded. Use panjs_core_with_less.min.js or load LESS (before panJs)"
	};

	panjs.getMessage  = function(mess) {

		for (var i=1; i<arguments.length; i++){

			var a = arguments[i]; 
			if (a == null) a = 'null';
			mess = mess.replace("%"+i, a);
		}

		return mess; 
	};
	panjs.getClass  = function(classPath) {

		if (typeof window[classPath] == "undefined")    
			uses(classPath);
		
		return window[classPath];

	}; 
	panjs.getInstance  = function(classPath, args) {

		var _class = panjs.getClass(classPath);
		return new _class(args);

	};   

	/*
		Remplacement variables panjs dans namespaces
		*/
		if (typeof panjs.less != "undefined")
			window["less"] = panjs.less;
		else
			window["less"] =  
		{
			env: "production", 
			async: true,       
			fileAsync: false,                            
			poll: 1000,       
			functions: {},  
			dumpLineNumbers: "comments", 
			relativeUrls: false,                               
			rootpath: ":/a.com/"                             
		};

	/*
		Remplacement variables panjs dans namespaces
		*/

		for (var k in panjs.namespaces)
			panjs.namespaces[k].path = panjs.namespaces[k].path.replace("{version}", panjs.version);       
		
	/* 
		CreateCompoennt 
		*/
		panjs.getErrorComponent = function(classPath, className, r)
		{
			if (typeof r == "string")
			r = { message: r, className: className};

			uses("panjs.core.display.TerrorElement.html");
			object = new TerrorElement(r);

			panjs.stack.push(r.message);
			panjs.stackLevel --;

			if (panjs.stackLevel <= 0){
				panjs.stack = [];
				panjs.stackLevel = 0;
			}
			return object;
		};

		panjs.createComponent = function(classPath, args)
		{ 
			panjs.stackLevel ++;
			var className = panjs.getClassNameFromClassPath(classPath);
			var object = null;

			if (typeof window[className] == "undefined")
			{
				/*CONFIG_START:manageErrors*/
				try{
				/*CONFIG_END:manageErrors*/

					var r = panjs.loader.usesComponent(classPath);
					if (!r.result){
						return panjs.getErrorComponent(classPath, className, r);
					}

				/*CONFIG_START:manageErrors*/
				}	
				catch(r){ 
					return panjs.getErrorComponent(classPath, className, r);
				}
				/*CONFIG_END:manageErrors*/
			}

			/*CONFIG_START:manageErrors*/
			try{
			/*CONFIG_END:manageErrors*/

				if (typeof args == "undefined")
					var args = {};

				if (typeof args.elem != "undefined")
				{
					panjs.setElementArgs(args.elem, args);
				}


				if (typeof panjs.root.components[classPath] != "undefined"){
					if (args.reuse != "undefined") 
					{
						if (args.reuse === true){
							var c = panjs.root.components[classPath];
							c.reuse(args);
							return c;
						}
					}
				};

				object = new window[className](args);

			/*CONFIG_START:manageErrors*/
			}catch(err){  

				var m = "Error instantiating "+className+": "+err;
				logger.error(m);
				uses("panjs.core.display.TerrorElement.html");  
				var path = panjs.getAbsoluteUrlFromClassPath(classPath);    
				var url = panjs.loader.getUrlWithVersion(path)
				var object = new TerrorElement({message: m, path: path,url:url, className:className});
				panjs.stack.push(m);
			}
			/*CONFIG_END:manageErrors*/

			panjs.stackLevel --;
			if (panjs.stackLevel <= 0){
				panjs.stack = [];
				panjs.stackLevel = 0;
			}

		//_onInitialized signifie que l'objet est compètement construit (mais il n'est pas forcément visible).
		//!!cette fonction ne s'applique qu'aux composants (mais devrait aussi s'appliquer aux objets)
		if (object._onInitialized)
			object._onInitialized();

		panjs.root.components[classPath] = object;

		return object;
	}
	panjs.setElementArgs = function(el, args){

		if (typeof el != "undefined")
		{
			for ( var i =0; i< el.attributes.length; i++)
			{
				var attr =  el.attributes.item(i);

				var name = attr.nodeName.toLowerCase();
				var value = attr.value;

									//if ((name != "id")&&(name != "data-compo"))
								 // {
									if (name.startsWith("data-")){
											//name = name.droite("-");
											name = panjs.getFormatedArgName(name);

										}
										
										if (value == "true")
											value = true;
										else if (value == "false")
											value = false;

										args[name] = value;
										//ATTENTION: attr.nodeName est toujours en lowerCase!
										//logger.info("setElementArgs : arg "+name+" = "+value);
								 // }       
							 }
						 }
					 }

					 panjs.getFormatedIdName = function(idName)
					 {
		//transforme un id="menu-toggle" en "menuToggle"
		//logger.debug("idName="+idName);

		if (idName.indexOf("-") == -1)
			return idName;

		var r = "";
		var parts = idName.split("-");

		for (var i=0; i< parts.length; i++){
			if (i == 0)
				r = parts[i];
			else
				r += parts[i].capitalizeFirstLetter();
		}
		//logger.debug("idName="+idName+", parts.length = "+parts.length+",r="+r);
		return r;
	}
	panjs.getFormatedArgName = function(argName)
	{
		//exemple: data-nom-model  => revoie nomModel    
		var r = "";
		var parts = argName.split("-");
		for (var i=1; i< parts.length; i++){
			if (i == 1)
				r = parts[i];
			else
				r += parts[i].capitalizeFirstLetter();
		}
		return r;
	}

	panjs.loadScript = function(src, success)
	{ 
		$LAB.script(src).wait(function(){

			if (typeof success != "undefined")
				success(src);
		});
	}

	/*
		_load
		*/
		panjs.load = function(element)
		{     
		/* var helperPath = panjs.getNamespace("core").path+"/helpers";

			if (!$.fn.getElement)
			{
			$LAB.setOptions({ Debug:true})
			 .script(helperPath+"/jquery.js")
			 .script(helperPath+"/base.js")
			 .wait(function(){
					 panjs._load(element); 
			 });
			}     
			else{*/

				panjs._load(element); 
		 // }

	 }

	 panjs.exec = function(s){

		if (s == "") return;  

		if (typeof window.execScript != "undefined")
				window.execScript(s);  //Porté globale (eval sur IE n'a pas de porté globale)
			else
				window.eval(s);


		}

		panjs._load = function(element)
		{ 
			if (arguments.length == 0)
				var element = $(document.body);

			var compolist = [];

			if (element.attr("data-compo") != null)
				compolist.push(element);
			else
				compolist = element.getElements("[data-compo]");

			for (var i=0; i< compolist.length; i++)
			{
				var el = compolist[i];    
				var dataCompo = el.attr("data-compo");
				var autoload = (el.attr("autoload") !== "false");
				var id = el.attr("id");

				if (autoload == true)
				{
					var compo = panjs.createComponent(dataCompo,{elem:el[0]});     
					el.replaceWith(compo.container);
					compo.container[0].owner = compo;   
				}
				else
				{
					uses("panjs.core.display.TproxyDisplayObject");
					var compo = new TproxyDisplayObject({sourceElement:el[0]});
					compo.parent = this;
					el[0].loaded = false;
					el.hide();     
					el[0].setAttribute("id", panjs.root.id+"_"+id);          
					el[0].originalId = id;       
					el[0].owner = panjs.root;          
				}

				panjs.root[id] = compo;

			}

			logger.info("READY"); 
			if (typeof onReady != "undefined")
				onReady();
		}

		panjs.getClassNameFromClassPath = function(classPath)
		{
			var sep = ".";
			if ((classPath.startsWith("http://"))||(classPath.startsWith("https://")) ||(classPath[0] == "/"))
				sep = "/";

			var r = classPath;  
			if (classPath.endsWith(".html"))
				r = classPath.removeEnd(".html");

			var parts = r.split(sep);

			r = parts[parts.length - 1];

			return r;
		}

		panjs.getNamespace = function(name)
		{
			var r = null;
			if (typeof panjs.namespaces[k] != "undefined")
				r = panjs.namespaces[k];
			return r;
		}
		panjs.getAbsoluteUrlFromClassPath = function(classPath)
		{
			var isHtm = (classPath.endsWith(".html"));

			var r = "";
			if ((classPath.startsWith("http://")|| classPath[0] == "/"))
			{
				if (!isHtm )
					r = classPath +".js";
				else
					r = classPath;
			}
			else
			{
				var classPathWithoutExt = classPath.removeEnd(".html");
				if (!classPathWithoutExt.contains("."))
				{
				//fichier à la racine
				r = classPath;
				if (!isHtm)
					r = r +".js";
			}else
			{

				for (var k in panjs.namespaces)
				{
					if (classPath.startsWith(k+"."))
					{
						var r = panjs.namespaces[k].path+ "/"+classPath.droite(k+".").removeEnd(".html").replace(/\./g, "/");
						
						if (!isHtm)
							r = r +".js";
						else
							r = r +".html";						
						break;
					}
				}        
			}

		}

		if (r == "")
			throw "Can't resolve "+classPath+": verify namespaces";

		return  r;
	}

	panjs.isAbsoluteUrl = function(url)
	{
		var s = url.toLowerCase();
		return ((s[0] == "/") ||(s.toLowerCase().startsWith("http://"))|| (s.toLowerCase().startsWith("https://")) );
	}

	panjs.transformUrl = function(url, dirPath)
	{
		/*
		renvoie l'url absolue 
		*/

		if ((url[0] != "/") && (url.substring(0,7) != "http://")&& (url.substring(0,8) != "https://"))
			url = dirPath+"/"+url;
		return url;
	}

})();



/*
		Classes nécessaires au démarrage
		*/

		var Tobject = {
			classHierarchy: "Tobject",


			extend: function (properties, className, parentClassName) {
				var superProto = this.prototype || Tobject;

				var def = {};
				def["classHierarchy"] = {value: superProto.classHierarchy + ' '+className};

				for (var k in properties)
				{ 
					if (k.startsWith("$"))
					{
						var defaultValue = properties[k];
						k = k.droite("$");
						logger.debug("BINDABLE => "+k+", defaultValue="+defaultValue);

						def["__"+k] =  {
							value: defaultValue,
							writable: true,
							enumerable: true
						};

						var setF = new Function('var key = "__'+k+'", propName="'+k+'",oldValue=this[key];newValue=arguments[0]; if (this[key] != arguments[0]){this[key] = arguments[0]; this.__OnPropChanged(propName, oldValue, newValue, this);}');
						var getF = new Function('var key = "__'+k+'"; return this[key]');
						def[k] = { 

							get: getF,
							set: setF
						}

					}else{

						def[k] = {
							value: properties[k],
							writable: true, 
							configurable: true,
							enumerable: true
						}

					}

				}

						 //if (typeof superProto.key2 == "undefined"){
					/*  def.key2 = {          
							get: function() 
							{ 
								return "ok"; 
							},
							set: function(v) 
							{ 

								try{
									 alert(this._super);//.key2 = 2;
									alert("v="+v+", Parent: id="+this.id);
								}catch(err){
									alert(err);
								}
							}
						};
						*/
						//}

						var proto = Object.create(superProto, def);
						var constr = proto.constructor;

						if (!(constr instanceof Function)) 
							throw new Error("You must define a method 'constructor'");

						constr.prototype = proto;
						constr.prototype.parentClassName = parentClassName;       
						constr._super = superProto;
						constr.extend = this.extend; // inherit class method

					return constr;
				},
				__OnPropChanged: function(propName, oldValue, newValue, object){
				},

				copyOwnTo: function(source, target) {
					Object.getOwnPropertyNames(source).forEach(function(propName) {
						console.log(propName);
						Object.defineProperty(target, propName,
							Object.getOwnPropertyDescriptor(source, propName));
					});
					return target;
				},
		injectParam: function(name, value, mandatory, defaut)//void
		{
			if ((typeof value == "undefined")||(value == null))
			{
				if (typeof defaut != "undefined")
				{
					this[name] = defaut;
					return true;
				}
				else{
					if ((typeof mandatory != "undefined") && (mandatory == true))
						throw "The "+name+" argument has no default value on "+this.className;
					else
						return false;
				}
			}
			else
			{
				this[name] = value;
				return true;
			}
		}


	};


	function defineClass(className, inheritsFromClassPath, def)
	{
		var isHtm =  inheritsFromClassPath.endsWith(".html");
		var classe = panjs.getClassNameFromClassPath(inheritsFromClassPath);

		if (typeof window[classe] == "undefined")
		{
			if (isHtm)
				panjs.loader.usesComponent(inheritsFromClassPath);
			else
				panjs.loader.uses(inheritsFromClassPath);

			
			if (typeof window[classe] == "undefined")
			{
				if (logger)
					logger.error("Unable to inherit from "+inheritsFromClassPath+": class is not loaded");

				return null;
			}
		}

		/*CONFIG_START:manageErrors*/
		try{
		/*CONFIG_END:manageErrors*/
			
			window[className] = window[classe].extend(def,className,classe);

		/*CONFIG_START:manageErrors*/
		}catch(err)
		{
			alert(classe+" "+err);
		}
		/*CONFIG_END:manageErrors*/

		panjs.lastDefinedClassName = className;
	}

	function uses(classPath)
	{
		var isHtm = classPath.endsWith(".html");
		if (isHtm)
			var r = panjs.loader.usesComponent(classPath);
		else
			var r = panjs.loader.uses(classPath);
		return r;
	}


/*** 
Tlogger.
Inclu ici car loader a besoin du logger.
***/

defineClass("Tlogger", "panjs.core.Tobject", {
	_level: null,
	name: "MAIN",
	creationDate: null,
	active: true,
	_currentGroup: 0,
	_tabulation: "",
	tab: [],

	constructor: function(args) {

		this.injectParam("_level", args.level,false, Tlogger.INFO);
		this.injectParam("name", args.name,false);
		this.creationDate = new Date().getTime();


		this.setLevel(this._level);
		
		this.active = (typeof console != "undefined");
		this.razTime();

		this.info("Init logger LEVEL=",this.getLevelName());
	},
	razTime: function()
	{
		this.creationDate = new Date();
	},
	isLevelEnabled: function(level){
		return level >= this._level;
	},
	getLevelName:function()
	{
		if (this._level == Tlogger.TRACE)
			return "TRACE";
		if (this._level == Tlogger.DEBUG)
			return "DEBUG";
		if (this._level == Tlogger.INFO)
			return "INFO";
		if (this._level == Tlogger.WARN)
			return "WARN";
		if (this._level == Tlogger.ERROR)
			return "ERROR";
	},
	groupStart: function()
	{  
		if (this.active)
		{
			this._currentGroup ++;
			this._calcTabultation();
		}
	},
	groupEnd: function()
	{
		if (this.active)
		{
			this._currentGroup --;
			this._calcTabultation();
		}
	},
	_calcTabultation: function()
	{
		this._tabulation = "";
		for (var i =0; i< this._currentGroup; i++)
			this._tabulation += "\t";

	},
	_getTime:function()
	{
		return new Date().getTime() - this.creationDate;
	},
	_trace: function()
	{
		if (this.active){
			var m = this._getMessage("TRACE", arguments);
			if (console.trace)
				console.trace(m);
			else
				console.log(m);
		}
	},
	_debug: function()
	{
			//bizarrement, console.debug n'existe pas sur IE9  mais si on log en console.info, ça sort en debug dans la console
			// console.log sort en INFO dans la console dans tous les cas.
			if (this.active){
				var m = this._getMessage("DEBUG", arguments);
				if (console.debug)
					console.debug(m);
				else
					console.log(m);
			}
		},
		_info: function()
		{
			if (this.active){
				var m = this._getMessage("INFO", arguments);
				if (console.info)
					console.info(m);
				else
					console.log(m);
			}
		},
		_warn: function()
		{
			if (this.active){
				var m = this._getMessage("WARN", arguments);
				if (console.warn)
					console.warn(m);
				else
					console.log(m);
			}

		},
		_error: function()
		{
			if (this.active)
				console.error(this._getMessage("ERROR", arguments));  
		},
		_getMessage: function(sev, args)
		{
			var r = "";
			for (var i =0; i< args.length; i++)
				r += args[i];

			return this._getTime()+ "ms("+this._currentGroup+") - " +sev+"\t"+this._tabulation+r;
		},

		setLevel: function(value)
		{
			this._level = value;
			this.trace = this._trace;
			this.debug = this._debug;
			this.info = this._info;
			this.warn = this._warn;
			this.error = this._error;

			if (value >= Tlogger.DEBUG)
				this.trace = function(){};

			if (value >= Tlogger.INFO)
				this.debug = function(){};

			if (value >= Tlogger.WARN)
				this.info = function(){};

			if (value >= Tlogger.ERROR)
				this.warn = function(){};
		}
	});
Tlogger.TRACE = 10;
Tlogger.DEBUG = 20;
Tlogger.INFO = 30;
Tlogger.WARN = 40;
Tlogger.ERROR = 50;

//loader needs logger.
panjs.logger = new Tlogger({level: Tlogger[panjs.logLevel], name:"main"});
logger = panjs.logger;


//Compat Ttracer (temporaire)
Ttracer = function(){};
Ttracer.getLogger = function(name){
	return logger;
}



/*** 
Tloader: loads other classes or components (synchronous)
***/

defineClass("Tloader", "panjs.core.Tobject", {
	queue: [],
	_count: 0,
	maxImbrications: 10,
	loadedJs: null,
	loadedCss: null,
	_lessIsLoaded: null,
	randomId: "",

	constructor: function(args) {

		this.loadedJs = {};
		this.loadedCss = {};
		this.randomId = Math.random();

	},
	lessIsLoaded: function()
	{
		if (this._lessIsLoaded == null)
			this._lessIsLoaded = defined(window["less"], "refresh");
		return this._lessIsLoaded;
	},

	getClassPathDir: function(classPath){

				/* returns:
				http://.../.../.../
				app.components.
				*/
				var classPathDir = classPath;

				if (classPath.endsWith(".js"))
					classPathDir =  classPath.removeEnd(".js"); 
				else 
					if (classPath.endsWith(".html"))
						classPathDir =  classPath.removeEnd(".html"); 

					classPathDir = classPathDir.substr(0, classPathDir.lastIndexOf("."));

					return classPathDir;
				},

				getUrlWithVersion: function(url)
				{

					if (url.contains("?") == false)
						url += "?";
					else
						url += "&";

					url += "v="+panjs.appVersion;

					if (panjs.env == "dev")
						url=url+"&rid="+this.randomId;

					return url;
				},
				loadFile: function(url)
				{ 

					try{
						var result = {'result':false, 'exception': "", status: "erreur inconnue"};

						logger.debug("Loadfile SYNC ",url);

						jQuery.support.cors = true;
						var req = jQuery.ajax({ 
							url: url,
							method:"GET",
							cache : true,
							async:false,
							dataType: "html",
							processData: false,
							context: this,
					//Sur accès GSM, les proxies des providers "optimisent" et modifient les pages html, les rendant non valides, et injectent du script etc.
					//no-transform évite ça, mais ce n'est psa imparable.
					
					beforeSend: function (request)
					{
						request.setRequestHeader("Cache-Control", "no-transform");
					},
					success: function(data, textStatus, jqXHR) { 
						this.onLoadFileSuccess(jqXHR, url);   
						result = {'result':true, 'data': data};   
					},
					error: function(jqXHR, settings, exception) {
						this.onLoadFileError(req, settings, exception,url);

						result = {'result':false, 'jqXHR': req, 'exception': exception};  
						if (req && req.status)
							result.status = req.status;
						else
							result.status = exception;

					}
				}); 
}catch(err)
{
	result = {'result':false, 'exception': err, status: err};
}
return result;
},

onLoadFileSuccess: function(jqxhr, path)
{
},
onLoadFileError: function(jqXHR, settings, exception, path)
{
	logger.error("Echec chargement "+path+": "+exception);
},

usesComponent: function(classPath)
{
		/*
		Loads HTML file
		*/

		var h = " ************ ";

		var className = panjs.getClassNameFromClassPath(classPath);

		var url = null;
		var path = null;

		if (this._count > this.maxImbrications)
		{
			return {result:false, message:"Too much nested components (max: "+this.maxImbrications+")", className: className, classPath:classPath, url: url, path:"?", Class: null};
		}

		if (typeof window[className] == "undefined")
		{ 
			logger.groupStart();
			if (this._count == 0)
			{   
				logger.info(h," USESCOMPONENT ",classPath, h);
			}
			
			this._count ++;

			path = panjs.getAbsoluteUrlFromClassPath(classPath);    
			url = this.getUrlWithVersion(path)

			var r = this.loadFile(url);


			if (r.result)
			{ 
				try{

						//if (r.data.indexOf("bmi_orig_img") >= 0){
							//certains providers injectent du code à la fin des fichiers HTML (3G)
							//et remplacent les liens des fichiers js et css par leurs contenus js/css
							//REMPLACE PAR ajout header cache-control = no-transform loadFile
							
					 //  var indx = r.data.lastIndexOf("</html>");
					 //   r.data = r.data.substring(0, indx+7);
					 //   r.data = r.data.replace(/\&/g, "&amp;");
					 // }

					 var dom = getXmlDocument(r.data);
				 }catch(err){
					logger.error("XML error in class "+className+": "+err);         
					return {result:false, isXmlError: true, message:err, className: className, classPath:classPath, url: url, path:path};
				 }

				 var headNode = dom.getElementsByTagName("head")[0];
				 var bodyNode = dom.getElementsByTagName("body")[0];
				 var linkNodes = [];
				 var styleNodes = [];
				 var dirPath = path.substring(0, path.lastIndexOf("/")); 

				 for (var i=0; i< headNode.childNodes.length; i++)
				 {

					var node = headNode.childNodes[i];

					var nodeName = node.nodeName.toLowerCase();
						/*
						On doit charger le style à la fin car le style de la dernire classe
						doit "ecraser" les styles des classes parentes.
						*/

						if ( nodeName == "script")
						{ 
							/*CONFIG_START:manageErrors*/
							try{ 
							/*CONFIG_END:manageErrors*/

								this.addScriptNode(node, dirPath, className, classPath); 
							/*CONFIG_START:manageErrors*/
							}catch(err)
							{
								var mess =  "Error processing <"+nodeName+"> in "+className+" => "+err;
								logger.error(path,mess);
								return {result:false, message: mess, className: className, classPath:classPath, url: url, path:path, stack:err.stack}; 
							}
							/*CONFIG_END:manageErrors*/

						}
						else
						{
							if (nodeName == "link")   
								linkNodes.push(node)
							else if (nodeName == "style")
								styleNodes.push(node);  
						}

					}

					if (typeof window[className] == "undefined")
					{
						var mess = classPath+ " class has not been loaded. ";
						if (panjs.lastDefinedClassName != className)
							mess += "\n"+panjs.getMessage(panjs.messages.CLASSNAME_MATCHS_FILENAME, panjs.lastDefinedClassName, path);

						logger.error(mess);
						return {result:false, message: mess, className: className, classPath:classPath, url: url, path:path, stack:null}; 
					}

					for (var i=0; i<linkNodes.length ; i++)
					{
						this.addLinkNode(linkNodes[i], dirPath);
					}

					for (var i=0; i<styleNodes.length ; i++)
					{
						logger.debug("Load style ",classPath);
						this.addStyleNode(styleNodes[i]);
					}

					if (defined(bodyNode))
					{
						/*CONFIG_START:manageErrors*/
						try{
						/*CONFIG_END:manageErrors*/

							var html = getXml(bodyNode);
							var parentClassName = window[className].prototype.parentClassName;

							if (defined(window[parentClassName].prototype.html)){
								if (window[parentClassName].prototype.html.contains('<!--CONTENT-->'))
									html = window[parentClassName].prototype.html.replace( '<!--CONTENT-->', html); 

							}

							html = html.replace(/<body>/gi, "").replace(/<\/body>/gi, "");
							html = html.replace(/\\r/gi, "").replace(/\\n/gi, "").trim();

							window[className].prototype.html = html;
							window[className].prototype.bodyNode = bodyNode;

						/*CONFIG_START:manageErrors*/
						}
						catch(e)
						{ 
							return {result:false, message:e.message, className: className, classPath:classPath, url: url, path:path, Class: null};
						}
						/*CONFIG_END:manageErrors*/
					}
					/*else
					{         
						//html et bodyNode are inherited            
					}*/
					if (panjs.setSourceInComponents)
						window[className].prototype.source = r.data;
					window[className].prototype.classPath = classPath;  
					window[className].prototype.classPathDir = this.getClassPathDir(classPath);
					window[className].prototype.className = className;  
					window[className].prototype.dirPath = dirPath;  
					window[className].lastId = 0;

					
					this._count --;
					if (this._count == 0)
					{
						logger.debug(h, " END USESCOMPONENT ",classPath,h);   

					}

					logger.groupEnd();
					return {result:true, message:"ok", className: className, classPath:classPath, url: url, path:path, Class: window[className]}; 
				}
				else
				{ 
					var mess = "Error loading "+classPath+": "+ r.status;
					logger.warn(mess);
					this._count --;
					logger.groupEnd();

					return {result:false, message:mess, className: className, classPath:classPath, url: url, path:path, Class: null};
				}

			}

			return  {result:true, message:"Already loaded", className: className, classPath:classPath, url: url, path:path, Class: window[className]}; 

		},

		uses: function(classPath)
		{

			var h = " ------------ ";
			var className = panjs.getClassNameFromClassPath(classPath);
			var url = null;
			var path = null;

			if (typeof window[classPath] == "undefined")
				{ logger.groupStart();
					if (this._count == 0)
						logger.info(h," USES ",classPath, h);

					path = panjs.getAbsoluteUrlFromClassPath(classPath);
					var dirPath = path.substring(0, path.lastIndexOf("/")); 

					if (this.loadedJs[path.toLowerCase()])
						return true;

					this._count ++;

					logger.groupStart();
					url = this.getUrlWithVersion(path);


					var r = this.loadFile(url);     


					if (r.result)
					{
						r.data = this.processCode(r.data, className, dirPath, classPath, '.js');
						panjs.exec(r.data);

						if (panjs.setSourceInComponents)
							window[className].prototype.source = r.data;

						window[className].prototype.classPath = classPath;    
						window[className].prototype.className = className;  
						window[className].prototype.classPathDir = this.getClassPathDir(classPath);
						window[className].prototype.dirPath = dirPath;
						window[classPath] = window[className];
					}
			//logger.debug(className+" = "+typeof window[className]+" path = "+path+", result="+r.result);
			this._count --;
			
			logger.groupEnd();


			if (this._count == 0)
				logger.debug(h," END USES ",classPath,h);     

			logger.groupEnd();
			return {result:true, message:"ok", className: className, classPath:classPath, url: url, path:path, Class: window[className]}; 

			
		}else{
			return  {result:true, message:"Already loaded", className: className, classPath:classPath, url: url, path:path, Class: window[className]}; 
		}
		
	},

	addLinkNode: function(node,dirPath)
	{     
		var url = panjs.transformUrl(node.getAttribute("href"),dirPath);

		var type =  node.getAttribute("type") || 'text/css';
		var rel = node.getAttribute("rel") || 'stylesheet';

		this.loadCssFile(url, type, rel);

	},  
	loadCssFile: function(url, type , rel){
		
		if (arguments.length == 0)
			throw "loadCssFile(url, type , rel): Missing url";

		var r = false;
		
		url = this.getUrlWithVersion(url);

		if (this.loadedCss[url.toLowerCase()])
			return r;
		
		if (typeof type == "undefined")
			var type = "text/css";
		
		if (typeof rel == "undefined")
			var rel = "stylesheet";

			var link  = document.createElement('link');
			link.rel  = rel;
			link.type = type;
			link.href = url;

			if (rel == "stylesheet/less")
			{
					if (this.lessIsLoaded())
					{
						less.sheets.push(link);
						less.refresh(true);
						logger.debug("INJECTION LESS OK");
						r = true;
					}
					else
					{         
						logger.warn( panjs.getMessage(panjs.messages.LESS_NOT_LOADED));
					}
			}
			else
			{
				document.getElementsByTagName('head')[0].appendChild(link); 
				r = true;                                
			}
		 
		if (r == true)
			logger.debug("Load <link> ASYNC: "+url);

		this.loadedCss[url.toLowerCase()] = true;

		return r;
	},
	addStyle: function(css, type){
		if (css.trim() == "")
			return;

		if (typeof type =="undefined")
			var type = "text/css";

		$('<style type="'+type+'">' + css +'</style>').appendTo('head');

		if (type == "text/less")
		{   
				if (this.lessIsLoaded())
				{
					less.refresh();

					logger.debug("INJECTION LESS OK");    
				}
				else
				{
					logger.warn( panjs.getMessage(panjs.messages.LESS_NOT_LOADED));

				}
		}
	},
	
	addStyleNode: function(node)
	{                   

		var type =  node.getAttribute("type");
		if (type == null)
			type = 'text/css';

		var css = getText(node);
		this.addStyle(css, type);

	},

	processCode: function(code, className, dirPath, classPath, ext)
	{
		/*
			Remplace this._super par className._super
		*/  
		var r = code.replace(/this._super/g, className+"._super")+'\n//@ sourceURL='+dirPath+"/"+className+ext;   
		return r;
	},

	addScriptNode: function(node, dirPath, className, classPath)
	{ 
		var subtype = node.getAttribute("data-subtype");
		var src = node.getAttribute("src");

		if (src == null)
		{
			var script = getText(node);
			
			if ((className != null) && ( subtype == "text/x-class-definition"))
			{ 
				script = this.processCode(script, className, dirPath, classPath, '.html'); 
			}
			panjs.exec(script);
		}
		else
		{      
			var url = panjs.transformUrl( src , dirPath);

			if (!this.loadedJs[url.toLowerCase()])
			{         
				var r = this.loadFile(this.getUrlWithVersion(url));
				if ((className != null) && ( subtype == "text/x-class-definition")){
					r.data = this.processCode(r.data, className, dirPath, classPath, '.js')
				}else{
					r.data += '\n//@ sourceURL='+src+'.js';
				}

				panjs.exec(r.data);
				this.loadedJs[url.toLowerCase()] = 1;

			}else{
				logger.debug("Le script "+url+" est déjà chargé");
			}
		} 
		return true;
	}   

});



panjs.loader = new Tloader();