var defaultSettings = {
		appVersion: "1.0.0",
		logLevel	: "DEBUG",
		env			: "dev",
		version 	: "1.0.3",
		addIdClass  : false,
		preserveElementsId: false,
		setSourceInComponents: false,
		stats: {
			active: false,
			url: "http://www.nexilearn.com/apis/portail_panjs/captures"
		},
		cache:{
			useLocalStorage: false
		},
		errorComponentClass: "panjs.core.display.TerrorElement.html"
};

panjs = array_replace_recursive(defaultSettings, panjs);

(function(panjs){

	panjs._iever  = getIEVersion();
    if ((panjs._iever < 9) && (panjs._iever >0))
    	alert("Internet Explorer "+panjs._iever+" is not supported");

	if (!panjs.appName)
		throw "Config ERROR: panjs.appName is missing";
	if (! new RegExp("^[0-9a-zA-Z-_]*$", "g").exec(panjs.appName))
		throw "invalid appName. format: "+regAppName;

	/* private properties*/
	panjs._sourceUrl = "//# sourceURL=";
	var _FFversion = getFirefoxVersion();
	if ((_FFversion > 0) && (_FFversion <= 17))
		panjs._sourceUrl = "//@ sourceURL=";

	var _stack = [];
	var _stackLevel = 0;
	var _idList = {};

	/* public properties */
	panjs.logger = null;
	panjs._classes = {};
	panjs.root = {
		id: "root",
		components: {}
	};
	panjs.loader = null;
	

	panjs.basePath = location.pathname.removeEnd(location.pathname.rightRightOf("/"));
	panjs.basePath = panjs.basePath.removeEnd("/");

	panjs.fullBasePath = location.protocol + '//' + location.host + location.pathname
	panjs.messages = {
		CLASSNAME_MATCHS_FILENAME: "The name of the class (%1) must match the file name (%2) (case sensitive)",
		LESS_IE8: "less is not fully compatible with IE%1 : transform less code in css",
		LESS_NOT_LOADED: "LESS not loaded. Use panjs_core_with_less.min.js or load LESS (before panJs)",
		SCRIPT_ALREADY_LOADED: "loadScriptSync %1 : already loaded",
		LESS_INJECTED: "LESS: injection OK"
	};

	/* namespaces */
	for (var k in panjs.namespaces) {
		panjs.namespaces[k].path = panjs.namespaces[k].path.replace("{version}", panjs.version);
		panjs.namespaces[k].name = k;
	}

	/*
	LESS Config
	*/
	if (typeof panjs.less != "undefined")
		window["less"] = panjs.less;
	else
		window["less"] = {
			env: "production",
			async: true,
			fileAsync: false,
			poll: 1000
		};

	/* private functions */
	var _setElementArgs = function(el, args) {

		if (typeof el != "undefined") {
			for (var i = 0; i < el.attributes.length; i++) {
				var attr = el.attributes.item(i);

				var name = attr.nodeName.toLowerCase();
				var value = attr.value;

				if (name.startsWith("data-"))
					name = _getFormatedArgName(name);
			
				if (value == "true")
					value = true;
				else if (value == "false")
					value = false;

				args[name] = value;    
			}
		}
	}
	
	var _getFormatedArgName = function(argName) {
		//exemple: data-nom-model  => revoie nomModel    	
		argName = argName.rightOf("data-");
		return panjs.getCamelCase(argName);	
	}

	var _getErrorComponent = function(classPath, className, r) {
		if (typeof r == "string")
			r = {
				message: r,
				className: className
			};
		r.stack	= _stack;

		uses(panjs.errorComponentClass);
		object = new TerrorElement(r);

		_stack.push(r.message);
		_stackLevel--;

		if (_stackLevel <= 0) {
			_stack = [];
			_stackLevel = 0;
		}
		return object;
	};

	/*<ENV:dev>*/

	var _captures = {};
	var _capturesTimer = null;
	var _capturesStarted = false;

	var _sendCaptures = function() {
		
		if ((this.stats.active == false)||(!_capturesStarted))
			return;

		var baseUrl =  panjs.stats.url;
		var fullUrl = baseUrl;
		var username = panjs.stats.username;
		var password = panjs.stats.password;

		var _capturesArray = [];
		for (var k in _captures){
			_capturesArray.pushArray(_captures[k]);
			logger.debug("Sending "+_captures[k].length+" ["+k+"] stats");
		}
		var count = _capturesArray.length;

		if (count > 0){
			var req = $.ajax({ 

			        url: fullUrl,
			        async:true,   
			        type: "post",
			        data: JSON.stringify(_capturesArray),
			        username: username, 
			        password: password,
			        success: function(data, textStatus, jqXHR){
			             logger.debug("Send "+count+" stats: success");
			        },
			        error: function(jqXHR, textStatus, errorThrown){
			         	logger.error("Send " + count+" stats: failure: "+jqXHR.responseText);
			        }
			});			
			_captures = {};
		}
		
	}

	panjs.stopCaptures = function(){
		
		if (_capturesTimer != null)
			_capturesTimer.stop();
		_captures = {};
		_capturesStarted = false;
		logger.error("captures stopped");
	}

	panjs.startCaptures = function(){
		
		if (this.stats.active == false)
			return;
		if (_capturesTimer == null){
			uses("panjs.core.helpers.Ttimer");
			_capturesTimer = new Ttimer({delay:5000, onTimer:_sendCaptures.bind(this) } );
		}
		
		_capturesTimer.start();
		_capturesStarted = true;
	}

	panjs.razCaptures = function(){
		
		if (this.stats.active == false)
			return;

		_captures = {};
		var appName = panjs.appName;
		var baseUrl =  panjs.stats.url;
		var fullUrl = baseUrl+'/init';
		var username = panjs.stats.username;
		var password = panjs.stats.password;

		var data = {
			appName: appName
		};

		var req = $.ajax({ 

		        url: fullUrl,
		        async:true,   
		        type: "post",
		        async: false,
		        data: JSON.stringify(data),
		        username: username, 
		        password: password,
		        success: function(data, textStatus, jqXHR){
		             logger.debug("razCaptures: success");
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		         	logger.error("razCaptures: failure: "+jqXHR.responseText);
		        }
		});
	}


	panjs.capture = function(message, opt)
	{
		if ((this.stats.active == false)||(!_capturesStarted))
			return;

		var data = {
		  message: message,
		  classPath: opt.classPath,
		  componentId: null,
		  fromClassName: null,
		  fromClassPath: null,
		  appName: panjs.appName,
		  groupId: 1,
		  fromId: null,
		  isStatic: null,
		  timestamp: new Date().getTime()
		}

		if (opt.from != null){
			data.fromClassName = opt.from.className;
			data.fromClassPath = opt.from.classPath;
			if (opt.from.id != null)
				data.fromId = opt.from.id;
		}
		if (opt.componentId != null)
		    data.componentId = opt.componentId;

		if  (data.message == "createStaticObject")
			data.isStatic = true;
		if  (data.message == "createComponent")
			data.isStatic = false;

		if (typeof _captures[message] == "undefined")
			_captures[message] = [];

		_captures[message].push(data);


	}
	/*</ENV:dev>*/
	
	panjs._exec = function(s) {

		if (s == "") return;

		if (typeof window.execScript != "undefined")
			window.execScript(s); //Porté globale (eval sur IE n'a pas de porté globale)
		else
			window.eval(s);
	}


	/* public functions */
	panjs.addNamespace = function(classPath, url) {
		panjs.namespaces[classPath] = {
			path: url,
			name: classPath
		}
	}
	panjs._setDOMId = function(DOMel, originalId, classPath) {

		if (originalId){

			var elPreserveId = DOMel.getAttribute("data-preserve-id");

			if (elPreserveId == null) {
				elPreserveId = panjs.preserveElementsId;
			} else {
				elPreserveId = (elPreserveId == "true");
			}

			if (!elPreserveId) {
				var nodeName = DOMel.nodeName.toLowerCase();
				if (typeof _idList[nodeName] == "undefined") {
					_idList[nodeName] = 1;
				} else {
					_idList[nodeName]++;				
				}
				
				DOMel.setAttribute("id", nodeName + _idList[nodeName]);		
				DOMel.setAttribute("data-original-id", originalId);	
			}

			if (panjs.addIdClass)
				DOMel.className += " "+originalId;

		}
			
	}

	panjs.getClass = function(classPath) {

		if (typeof panjs._classes[classPath] == "undefined")
			uses(classPath);

		return panjs._classes[classPath].Class;

	};
	
	
	panjs.getInstance = function(classPath, args) {

		var _class = panjs.getClass(classPath);
		return new _class(args);

	};
	panjs.createObject =panjs.getInstance;

	panjs.unload = function(classPath) {
		//var className = panjs._getClassNameFromClassPath(classPath);
		if (typeof panjs._classes[classPath] == "undefined")
			classPath = classPath + ".html";
	
		if (typeof panjs._classes[classPath] != "undefined"){		
			panjs._classes[classPath] = undefined;
			delete panjs._classes[classPath];
		}
	};
	
	
	panjs.createComponent = function(classPath, args, sendData) {
		
		_stackLevel++;
		var className = panjs._getClassNameFromClassPath(classPath);
		var object = null;

		if (typeof panjs._classes[classPath] == "undefined") {
			/*<ENV:prod>*/
			try {
				/*</ENV:prod>*/

				var r = panjs.loader.usesComponent(classPath);
				if ((r==null)||(!r.result))
					return _getErrorComponent(classPath, className, r);

				/*<ENV:prod>*/
			} catch (r) {
				return _getErrorComponent(classPath, className, r);
			}
			/*</ENV:prod>*/
		}

		/*<ENV:prod>*/
		try {
			/*</ENV:prod>*/

			if (typeof args == "undefined")
				var args = {};

			if (typeof args.elem != "undefined") {
				_setElementArgs(args.elem, args);
			}

			if (typeof panjs.root.components[classPath] != "undefined") {
				if (args.reuse != "undefined") {
					if (args.reuse === true) {
						var c = panjs.root.components[classPath];
						c.reuse(args);
						return c;
					}
				}
			};

			object = new panjs._classes[classPath].Class(args);

			/*<ENV:prod>*/
		} catch (err) {

			var m = "Error instantiating " + className + ": " + err;
			logger.error(m);
			var path = panjs.getAbsoluteUrlFromClassPath(classPath);
			var url = panjs.loader._getUrlWithVersion(path);
			var object = _getErrorComponent(classPath, className, {
				message: m,
				path: path,
				url: url,
				className: className
			});
			
			_stack.push(m);
		}

		/*</ENV:prod>*/

		_stackLevel--;
		if (_stackLevel <= 0) {
			_stack = [];
			_stackLevel = 0;
		}

		//_onInitialized signifie que l'objet est compètement construit (mais il n'est pas forcément visible).
		//!!cette fonction ne s'applique qu'aux composants (mais devrait aussi s'appliquer aux objets)
		if (object._onInitialized)
			object._onInitialized();

		panjs.root.components[classPath] = object;
		/*<ENV:dev>*/
			if (sendData !== false){
				var statsData = {classPath:classPath, componentId: object.id,  classPath: classPath, from: null};
				if (typeof sendData == 'object'){
					if (typeof statsData.from != "undefined"){
						statsData.from = sendData.from;					
					}
				}
				panjs.capture("createComponent", statsData);
			}
		/*</ENV:dev>*/

		return object;
	}

	panjs.getCamelCase = function(str) {
		//transforme un id="menu-toggle" en "menuToggle"
		if (str.indexOf("-") == -1)
			return str;

		var r = "";
		var parts = str.split("-");

		for (var i = 0; i < parts.length; i++) {
			if (i == 0)
				r = parts[i];
			else
				r += parts[i].capitalizeFirstLetter();
		}
		return r;
	}

	panjs.loadScriptAsync = function(url, success) {
		$LAB.script(url).wait(function() {

			if (typeof success != "undefined")
				success(url);
		});
	}
	
	panjs.loadScriptSync = function(url) {
		var r = { result: null, errorMessage: ""};

		if (!this.loader.loadedJs[url.toLowerCase()]) 
		{
			var result = this.loader._loadFileSync(this.loader._getUrlWithVersion(url));
			r.result = result.result;
			if (r.result != true){
				r.errorMessage = result.exception;
			}else{
				result.data += '\n'+panjs._sourceUrl+ url + '.js';
				panjs._exec(result.data);
				this.loader.loadedJs[url.toLowerCase()] = 1;				
			}
		} else {
			r.result = true
			logger.debug(panjs.messages.SCRIPT_ALREADY_LOADED, url);
		}
		return r;
	}

	panjs.load = function(element, onReady) {
		if (arguments.length == 0)
			var element = $(document.body);

		var compolist = [];

		if (element.attr("data-compo") != null)
			compolist.push(element);
		else
			compolist = element.find("[data-compo]");

		for (var i = 0; i < compolist.length; i++) {
			var el = $(compolist[i]);
			var dataType = el.attr("data-compo");
			var autoload = (el.attr("data-autoload") !== "false");
			var id = el.attr("id");

			if (autoload == true) {
				var compo = el.load();
				panjs.root[id] = compo;
			} else {
				panjs._setDOMId(el[0], id, dataType);

				el[0].compo = null;
				el[0].owner = null;

				panjs.root[id] = el;
			}
		}

		
		if (arguments.length == 2)
			onReady();
	}

	panjs._getClassNameFromClassPath = function(classPath) {
		var sep = ".";
		if (classPath.startsWith("http://") || classPath.startsWith("file://") || classPath.startsWith("https://") || (classPath[0] == "/"))
			sep = "/";

		var r = classPath;
		if (classPath.endsWith(".html"))
			r = classPath.removeEnd(".html");

		var parts = r.split(sep);

		r = parts[parts.length - 1];

		return r;
	}

	panjs.getNSFromClassPath = function(classPath) {
		var r = null;
		for (var k in panjs.namespaces) {
			if (classPath.startsWith(k + ".")) {
				r = panjs.namespaces[k];
				break;
			}
		}
		return r;
	}

	panjs.getAbsoluteUrlFromClassPath = function(classPath) {
		var isHtm = (classPath.endsWith(".html"));

		var r = "";
		if (classPath.startsWith("http://") || classPath.startsWith("file://") || (classPath[0] == "/")) {
			if (!isHtm)
				r = classPath + ".js";
			else
				r = classPath;
		} else {
			var classPathWithoutExt = classPath.removeEnd(".html");
			if (!classPathWithoutExt.contains(".")) {
				//fichier à la racine
				r = panjs.basePath + "/" + classPath;
				if (!isHtm)
					r = r + ".js";
			} else {
				var namespace = panjs.getNSFromClassPath(classPath);
				if (namespace) {
					r = namespace.path + "/" + classPath.rightOf(namespace.name + ".").removeEnd(".html").replace(/\./g, "/");

					if (!isHtm)
						r = r + ".js";
					else
						r = r + ".html";
				}
			}
		}
		
		if (r == ""){
			r = classPath.removeEnd(".html").replace(/\./g, "/");
			if (!isHtm)
				r = r + ".js";
			else
				r = r + ".html";
			//throw "Can't resolve " + classPath + ": verify namespaces";
		}

		return r;
	}

	/*panjs._isAbsoluteUrl = function(url) {
		var s = url.toLowerCase();
		return ((s[0] == "/") || (s.toLowerCase().startsWith("http://")) || (s.toLowerCase().startsWith("https://")));
	}*/

}(panjs = panjs || {} ));


var Tobject = {
	classHierarchy: "Tobject",


	extend: function(properties, className, parentClassName) {
		var superProto = this.prototype || Tobject;

		var def = {};
		def["classHierarchy"] = {
			value: superProto.classHierarchy + ' ' + className
		};

		for (var k in properties) {
			if (k == "isLoaded")
				if (className != "TdisplayObject")
					logger.warn("Error extending " + superProto.classHierarchy + ' ' + className + ": 'isLoaded' property is reserved by panjs");

			if (k.startsWith("$")) {
				var defaultValue = properties[k];
				k = k.rightOf("$");
				//logger.debug("BINDABLE => " + k + ", defaultValue=" + defaultValue);

				def["__" + k] = {
					value: defaultValue,
					writable: true,
					enumerable: true
				};

				var setF = new Function('var key = "__' + k + '", propName="' + k + '",oldValue=this[key];newValue=arguments[0]; if (this[key] != arguments[0]){this[key] = arguments[0]; this.__OnPropChanged(propName, oldValue, newValue, this);}');
				var getF = new Function('var key = "__' + k + '"; return this[key]');
				def[k] = {

					get: getF,
					set: setF
				}

			} else {

				def[k] = {
					value: properties[k],
					writable: true,
					configurable: true,
					enumerable: true
				}

			}

		}

		var proto = Object.create(superProto, def);
		var constr = proto.constructor;

		if (!(constr instanceof Function))
			throw new Error("You must define a method 'constructor'");

		constr.prototype = proto;
		constr.prototype.parentClassName = parentClassName;
		constr._super = superProto;
		constr.extend = this.extend;

		return constr;
	},
	__OnPropChanged: function(propName, oldValue, newValue, object) {},

	injectParam: function(name, value, mandatory, defaut) //void
		{
			if ((typeof value == "undefined") || (value == null)) {
				if (typeof defaut != "undefined") {
					this[name] = defaut;
					return true;
				} else {
					if ((typeof mandatory != "undefined") && (mandatory == true))
						throw "The " + name + " argument has no default value on " + this.className;
					else
						return false;
				}
			} else {
				this[name] = value;
				return true;
			}
		}
};

function defineStaticClass(className, parentClassPath, def) {
	defineClass(className, parentClassPath, def, true);


}
function defineClass(className, parentClassPath, def, isStatic ) {

	if (arguments.length < 4)
		var isStatic = false;

	var isHtm = parentClassPath.endsWith(".html");
	var parentClasseName = panjs._getClassNameFromClassPath(parentClassPath);
	
	var classPath = null;
	if ((typeof __CLASSPATH__ != "undefined") && (__CLASSPATH__ != null))
		classPath = __CLASSPATH__;
	else
		classPath = className;

	var filename = classPath.removeEnd(".html");
	if (filename.contains("."))
		filename = filename.rightRightOf(".");

	if ((classPath != className) && (filename != className)){
		var mess = logger.parse(panjs.messages.CLASSNAME_MATCHS_FILENAME, className, filename);
		throw mess;
	}

	if ((typeof panjs._classes[parentClassPath] == "undefined") && (parentClasseName != "Tloader") && (parentClasseName != "Tlogger")&& (parentClasseName != "Tobject"))
	{
		if (isHtm)
			panjs.loader.usesComponent(parentClassPath);
		else
			panjs.loader.uses(parentClassPath);

		if (typeof panjs._classes[parentClassPath] == "undefined") {
			if (logger)
				logger.error("Unable to inherit from " + parentClassPath + ": class is not loaded");

			return null;
		}
	}

	/*<ENV:prod>*/
	try {
		/*</ENV:prod>*/

		if ( panjs._classes[parentClassPath] )
			var Class = panjs._classes[parentClassPath].Class.extend(def, className, parentClasseName);
		else
			//pour Tloader, Tlogger Tobject
			var Class = window[parentClasseName].extend(def, className, parentClasseName);
			
		panjs._classes[classPath] = {
			Class: Class,
			isComponent: isHtm,
			lastId: 0
		}
		
		Class.prototype.classPath = classPath;
		Class.prototype.className = className;

		if (isStatic){
			window[className] = new Class();
			window[className].id = classPath;
		}
		else{
			window[className] = Class;
		}

		var classNames = classPath.split(".");
		var nsObject = window;
		for (var i=0; i< classNames.length; i++){
			var ns = classNames[i];
			if (i == classNames.length-1 ){
				nsObject[ns] = window[className];
			}else
			if (typeof nsObject[ns] == "undefined"){
				nsObject[ns] = {};
			}
			nsObject = nsObject[ns];
		}

		/*<ENV:prod>*/

	} catch (err) {
		alert(className + " " + err);
	}
	/*</ENV:prod>*/

	__CLASSPATH__ = null;
	panjs._lastDefinedClassName = className;

	/*<ENV:dev>*/
	if (isStatic){
		var statsData = {classPath:classPath, componentId: window[className].id, from: null};
		if (typeof sendData == 'object'){
			if (typeof statsData.from != "undefined"){
				statsData.from = sendData.from;					
			}
		}
		panjs.capture("createStaticObject", statsData);
	}
	/*</ENV:dev>*/

}

function uses(classPath) {
	var isHtm = classPath.endsWith(".html");
	if (isHtm)
		var r = panjs.loader.usesComponent(classPath);
	else
		var r = panjs.loader.uses(classPath);
	return r;
}


/*** 
Tlogger
***/
defineClass("Tlogger", "panjs.core.Tobject", {
	_level: null,
	name: "MAIN",
	creationDate: null,
	_currentGroup: 0,
	_tabulation: "",
	tab: [],

	constructor: function(args) {
		

		this.injectParam("_level", args.level, false, Tlogger.INFO);
		this.injectParam("name", args.name, false);
		this.creationDate = new Date().getTime();


		


		this.setLevel(this._level);	
		this.razTime();

		this.info("Init logger LEVEL=%1", this.getLevelName());
	},

	razTime: function() {
		this.creationDate = new Date();
	},
	isLevelEnabled: function(level) {
		return level >= this._level;
	},
	getLevelName: function() {
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
	groupStart: function() {

		//console.group(name);
		this._currentGroup++;
		this._calcTabultation();
	},
	groupEnd: function() {
		this._currentGroup--;
		this._calcTabultation();
		//console.groupEnd();
	},
	_calcTabultation: function() {
		this._tabulation = "";
		for (var i = 0; i < this._currentGroup; i++)
			this._tabulation += "\t";
	},
	_getTime: function() {
		return new Date().getTime() - this.creationDate;
	},
	_trace: function() {
		console.trace( this._getMessage("TRACE", arguments) );
	},
	_debug: function() {
		console.debug( this._getMessage("DEBUG", arguments) );
	},
	_info: function() {
		console.info( this._getMessage("INFO", arguments) );
	},
	_warn: function() {
		console.warn( this._getMessage("WARN", arguments) );
	},
	_error: function() {
		console.error( this._getMessage("ERROR", arguments) );
	},
	_fallback: function(){
		
		if (typeof console != "undefined"){
			var m = this.logger._getMessage(this.levelStr, arguments);
			console.log(m);
		}
	},
	parse: function() {
		
		if (typeof arguments[0] == "string")
		{
			var r = arguments[0];
			for (var i=1; i<arguments.length; i++){
				var a = arguments[i]; 
				if (a == null) a = 'null';
				r = r.replace("%"+i, a);
			}
		}else{
			var r = "";
			for (var i=0; i<arguments.length; i++){
				r += JSON.stringify( arguments[i] )+"\n";
			}
		}

		return r;
	},

	_getMessage: function(sev, args) {		
		var r = this.parse.apply(this, args);
		return this._getTime() + "ms(" + this._currentGroup + ") - " + sev + "\t" + this._tabulation + r;
		//return this._getTime() + "ms(" + this._currentGroup + ") - " + sev + r;
	},

	setLevel: function() {
		return this._level;
	},
	setLevel: function(value) {
		this._level = value;
		
		if (typeof console != "undefined"){ //IE9...
			
			if (typeof console.trace == "undefined")
				this.trace = this._fallback.bind( {levelStr:"TRACE", logger:this});
			else
				this.trace = this._trace;
			
			if (typeof console.debug == "undefined")
				this.debug = this._fallback.bind( {levelStr:"DEBUG", logger:this});
			else
				this.debug = this._debug;
			
			if (typeof console.info == "undefined")
				this.info = this._fallback.bind( {levelStr:"INFO", logger:this});
			else
				this.info = this._info;
			
			if (typeof console.warn == "undefined")
				this.warn = this._fallback.bind( {levelStr:"WARN", logger:this});
			else
				this.warn = this._warn;
			
			if (typeof console.error == "undefined")
				this.error = this._fallback.bind( {levelStr:"ERROR", logger:this});			
			else
				this.error = this._error;
		}else{

			this.trace = this._fallback.bind( {levelStr:"TRACE", logger:this});
			this.debug = this._fallback.bind( {levelStr:"DEBUG", logger:this});
			this.info = this._fallback.bind( {levelStr:"INFO", logger:this});
			this.warn = this._fallback.bind( {levelStr:"WARN", logger:this});
			this.error = this._fallback.bind( {levelStr:"ERROR", logger:this});
		}



		if (value >= Tlogger.DEBUG)
			this.trace = function() {};

		if (value >= Tlogger.INFO)
			this.debug = function() {};

		if (value >= Tlogger.WARN)
			this.info = function() {};

		if (value >= Tlogger.ERROR)
			this.warn = function() {};

	}
});
Tlogger.TRACE = 10;
Tlogger.DEBUG = 20;
Tlogger.INFO = 30;
Tlogger.WARN = 40;
Tlogger.ERROR = 50;


//loader needs logger.
panjs.logger = new Tlogger({
	level: Tlogger[panjs.logLevel],
	name: "main"
});
logger = panjs.logger;


//Compat Ttracer (temporaire)
Ttracer = function() {};
Ttracer.getLogger = function(name) {
	return logger;
}


/*** 
Tloader: loads other classes or components (synchronous)
***/

defineClass("Tloader", "panjs.core.Tobject", {
	queue: [],
	loadedJs: null,
	loadedCss: null,
	_lessIsLoaded: null,
	randomId: "",
	_addedcss:"",
	_stylenode: null,

	constructor: function(args) {

		this.loadedJs = {};
		this.loadedCss = {};
		this.randomId = Math.random();

	},
	
	init: function(){
		/* Cache init */
		if (!panjs.cache.useLocalStorage) {
			panjs.cache = {};

			var prefix = "cache_" + panjs.appName;
			for (var i in localStorage) {
				/* empty localStorage */
				if (i.startsWith(prefix))
					localStorage.removeItem(i);
			}
		}
	},

	lessIsLoaded: function() {
		if (this._lessIsLoaded == null)
			this._lessIsLoaded = defined(window["less"], "refresh");
		return this._lessIsLoaded;
	},

	getClassPathDir: function(classPath) {

		/* returns:
		http://.../.../.../
		app.components.
		*/
		var classPathDir = classPath;

		if (classPath.endsWith(".js"))
			classPathDir = classPath.removeEnd(".js");
		else
		if (classPath.endsWith(".html"))
			classPathDir = classPath.removeEnd(".html");

		classPathDir = classPathDir.substr(0, classPathDir.lastIndexOf("."));

		return classPathDir;
	},

	_getUrlWithVersion: function(url) {

		if (url.contains("?") == false)
			url += "?";
		else
			url += "&";

		url += "v=" + panjs.appVersion;

		if (panjs.env == "dev")
			url = url + "&rid=" + this.randomId;

		return url;
	},
	_loadFileSync: function(url) {
		var useLocalStorage = (panjs.cache.useLocalStorage && (panjs.env == "prod") && (panjs.appName));

		if (useLocalStorage) {
			var prefix = "cache_" + panjs.appName;
			var key = (prefix + "." + panjs.appVersion + "." + url.hashCode());

			var data = localStorage.getItem(key);

			if (data) {
				return {
					'result': true,
					'data': data
				};
			}
		}

		try {
			var result = {
				'result': false,
				'exception': "",
				status: "erreur inconnue"
			};

			logger.debug("Loadfile SYNC %1", url);

			jQuery.support.cors = true;
			var req = jQuery.ajax({
				url: url,
				method: "GET",
				cache: true,
				async: false,
				dataType: "html",
				processData: false,
				context: this,
 	

				beforeSend: function(request) {
					//Sur accès GSM, les proxies des providers "optimisent" et modifient les pages html, les rendant non valides, et injectent du script etc.
					//no-transform évite ça

					//request.setRequestHeader("Cache-Control", "no-transform");

				},
				success: function(data, textStatus, jqXHR) {

					result = {
						'result': true,
						'data': data
					};
					if (useLocalStorage) {

						//suppression ancienne version
						for (var i in localStorage) {
							if (i.startsWith(prefix) && (!i.startsWith(prefix + "." + panjs.appVersion))) {
								logger.debug('Removing old version from locaStorage: %1', i);
								localStorage.removeItem(i);
							}
						}
						try {
							localStorage.setItem(key, data);
						} catch (err) {
							logger.debug(err + ": data from " + url + " will not be saved");
						}
					}
				},
				error: function(jqXHR, settings, exception) {
					logger.error("Load error. url=%1, exception=%2", url, exception);

					result = {
						'result': false,
						'jqXHR': req,
						'exception': exception
					};
					if (req && req.status)
						result.status = req.status;
					else
						result.status = exception;

				}
			});

		} catch (err) {
			result = {
				'result': false,
				'exception': err,
				status: err
			};
		}



		return result;
	},

	getFileSync: function(url) {
		return this._loadFileSync(url);
	},

	usesComponent: function(classPath) {
		/*
		Loads HTML file
		*/
		var className = panjs._getClassNameFromClassPath(classPath);

		var r = {
			result: false,
			message: "",
			className: className,
			classPath: classPath,
			url: null,
			path: null,
			Class: null
		};

		if (typeof panjs._classes[classPath] == "undefined") {
			
			//logger.parse("USESCOMPONENT %1", classPath);

			logger.debug("USESCOMPONENT %1", classPath);
			logger.groupStart();

			r.path = panjs.getAbsoluteUrlFromClassPath(classPath);
			r.url = this._getUrlWithVersion(r.path);
	
			var data = this._loadFileSync(r.url);

			if (data.result) {

				try {
					var dom = getXmlDocument(data.data);
				} catch (err) {
					logger.error("XML error in class " + className + ": " + err);
					r.isXmlError = true;
					r.message = err;	
					return r;				
				}

				var headNode = dom.getElementsByTagName("head")[0];
				var bodyNode = dom.getElementsByTagName("body")[0];
				var linkNodes = [];
				var styleNodes = [];
				var dirPath = r.path.substring(0, r.path.lastIndexOf("/"));

				for (var i = 0; i < headNode.childNodes.length; i++) {

					var node = headNode.childNodes[i];

					var nodeName = node.nodeName.toLowerCase();
					/*
					On doit charger le style à la fin car le style de la dernire classe
					doit "ecraser" les styles des classes parentes.
					*/

					if (nodeName == "script") {
						/*<ENV:prod>*/
						try {
							/*</ENV:prod>*/

							this.addScriptNode(node, dirPath, className, classPath);
							/*<ENV:prod>*/
						} catch (err) {
							var mess = "Error processing <" + nodeName + "> in " + className + " => " + err;
							logger.error(r.path + ": "+ mess);
							r.message = mess;
							r.stack = err.stack;
							return r;
						}
						/*</ENV:prod>*/

					} else {
						if (nodeName == "link")
							linkNodes.push(node)
						else if (nodeName == "style")
							styleNodes.push(node);
					}

				}
				if (typeof panjs._classes[classPath] == "undefined")
				{
					r.message = "Classe "+classPath+" not loaded";
					return r;
				}
				var Class = panjs._classes[classPath].Class;

				for (var i = 0; i < linkNodes.length; i++) {
					this.addLinkNode(linkNodes[i], dirPath);
				}

				for (var i = 0; i < styleNodes.length; i++) {
					logger.debug("Load style %1", classPath);
					this.addStyleNode(styleNodes[i]);
				}
				var parentClassName = Class.prototype.parentClassName;


				if (defined(bodyNode)) {
					/*<ENV:prod>*/
					try {
						/*</ENV:prod>*/

						var html = getXml(bodyNode);

						if (defined(window[parentClassName].prototype.html)) {
							if (window[parentClassName].prototype.html.contains('<!--CONTENT-->'))
								html = window[parentClassName].prototype.html.replace('<!--CONTENT-->', html);

						}

						html = html.replace(/<body>/gi, "").replace(/<\/body>/gi, "");
						//html = html.replace(/\\r/gi, "").replace(/\\n/gi, "").trim();

						Class.prototype.html = html;
						Class.prototype.bodyNode = bodyNode;

						/*<ENV:prod>*/
					} catch (e) {
						r.message = e.message;
						return r;
					}
					/*</ENV:prod>*/
				}
				else
				{         
					//html et bodyNode are inherited       
					if (defined(window[parentClassName].prototype.html))
					{ 
						html = window[parentClassName].prototype.html;
						Class.prototype.html = html;
						Class.prototype.bodyNode = bodyNode;
					}
					
				}

				if (panjs.setSourceInComponents)
					Class.prototype.source = data.data;
				
				Class.prototype.classPathDir = this.getClassPathDir(classPath);
				Class.prototype.dirPath = dirPath;
				Class.lastId = 0;

				logger.groupEnd();
				logger.debug("END USESCOMPONENT %1", classPath);
				
				r.result = true;
				r.message = "ok";
				r.Class = Class;
				return r;

			} else {
				
				var mess = "Error loading " + classPath + ": " + data.status;
				logger.warn(mess);		
				r.mess = mess;
				return r;
			}

		}else{
			r.result = true;
			r.mess = "Already loaded";
			r.Class = panjs._classes[classPath].Class;
		}
		return r;		
	},

	uses: function(classPath) {

		var className = panjs._getClassNameFromClassPath(classPath);
		var r = {
			result: false,
			message: "",
			className: className,
			classPath: classPath,
			url: null,
			path: null,
			Class: null
		};

		if (typeof panjs._classes[classPath] == "undefined") {
			
			logger.debug("USES %1", classPath);
			logger.groupStart();
			
			r.path = panjs.getAbsoluteUrlFromClassPath(classPath);
			var dirPath = r.path.substring(0, r.path.lastIndexOf("/"));
	
			r.url = this._getUrlWithVersion(r.path);
			var data = this._loadFileSync(r.url);

			if (data.result) {
				data.data = this._processCode(data.data, className, dirPath, classPath, '.js');
				panjs._exec(data.data);

				if (typeof panjs._classes[classPath] == "undefined")
				{
					r.message = "Classe "+classPath+" not loaded";
					return r;
				}

				var Class = panjs._classes[classPath].Class;

				Class.prototype.classPathDir = this.getClassPathDir(classPath);
				Class.prototype.dirPath = dirPath;
			
				panjs._classes[classPath].lastId = 0;
				
				r.result = true;
				r.message = "ok";
				r.Class = Class;

			}else{
				throw classPath+" not loaded: "+data.status;				
			}
			
			logger.groupEnd();
			logger.debug("END USES %1", classPath);
	
		} else {		
			r.result = true;
			r.message = "Already loaded";		
			r.Class = Class;	
		}

		return r;

	},
	_transformUrl: function(url, dirPath) {
		/*
		renvoie l'url absolue 
		*/

		if ((url[0] != "/") && (url.substring(0, 7) != "http://") && (url.substring(0, 7) != "file://")  && (url.substring(0, 8) != "https://"))
			url = dirPath + "/" + url;
		return url;
	},

	addLinkNode: function(node, dirPath) {
		var url = this._transformUrl(node.getAttribute("href"), dirPath);

		var type = node.getAttribute("type") || 'text/css';
		var rel = node.getAttribute("rel") || 'stylesheet';

		this.loadCssFile(url, type, rel);

	},
	loadCssFile: function(url, type, rel) {

		if (arguments.length == 0)
			throw "loadCssFile(url, type , rel): Missing url";

		var r = false;

		url = this._getUrlWithVersion(url);

		if (this.loadedCss[url.toLowerCase()])
			return r;

		if (arguments.length < 2)
			var type = "text/css";

		if (arguments.length < 3)
			var rel = "stylesheet";

		var link = document.createElement('link');
		link.rel = rel;
		link.type = type;
		link.href = url;

		if (rel == "stylesheet/less") {
			if (this.lessIsLoaded()) {
				less.sheets.push(link);
				less.refresh(true);
				logger.debug(panjs.messages.LESS_INJECTED);
				r = true;
			} else {
				logger.warn(panjs.messages.LESS_NOT_LOADED);
			}
		} else {
			document.getElementsByTagName('head')[0].appendChild(link);
			r = true;
		}

		if (r == true)
			logger.debug("Load <link> ASYNC: %1", url);

		this.loadedCss[url.toLowerCase()] = true;

		return r;
	},
	
	/*
	Fonctionne partout sauf sur IE9 (et +?) car il semble que le nombre de noeud <style> soit limité dnas <HEAD> 
	!! Voir avec IE10 si ça fonctionne.
	*/
	addStyle: function(css, type) {

		if (panjs._iever >0)
		{
			this.addStyleIE(css, type)
		}else{

			if (css.trim() == "")
				return;
			if (arguments.length < 2)
				var type = "text/css";

			$('<style type="' + type + '">' + css + '</style>').appendTo('head');

			if (type == "text/less") {
				if (this.lessIsLoaded()) {
					less.refresh();

					logger.debug(panjs.messages.LESS_INJECTED);
				} else {
					logger.warn(panjs.messages.LESS_NOT_LOADED);

				}
			}
		}
	},

	addStyleIE: function(css, type) {
		/* fusion des style text/css + deplacement du <STYLE> à la fin 
		!! pb possible si load fichier css qui est sensé écraser le style INLINE car <LINK> sera toujours placé avant <STYLE> !		
		De plus, les style LESS ne sont pas placé à la fin: il faut les convertir puis les placer dans <STYLE> css
		*/
		if (css.trim() == "")
			return;

		if (arguments.length < 2)
			var type = "text/css";

		if (type == "text/less") {
			
			var el = $('<style type="' + type + '">' + css + '</style>');
			el.appendTo('head');

			if (this.lessIsLoaded()) {
				less.refresh();
				logger.debug(panjs.messages.LESS_INJECTED);
			} else {
				logger.warn(panjs.messages.LESS_NOT_LOADED);

			}
		}else{
			if (this._stylenode == null)
			{
				var el = $('<style type="' + type + '">' + css + '</style>');
				el.appendTo('head');
				this._stylenode = el[0];
			}else{
				this._addedcss += "\n"+css;
				this._stylenode.innerHTML = this._addedcss;
				$(this._stylenode).appendTo('head');
			}
		}
	},

	addStyleNode: function(node) {

		var type = node.getAttribute("type");
		if (type == null)
			type = 'text/css';

		var css = node.textContent;

		this.addStyle(css, type);

	},

	_processCode: function(code, className, dirPath, classPath, ext) {
		/*
			Remplace this._super par className._super
			*/			
		var r = code.replace("defineClass(", "var __CLASSPATH__='"+classPath+"';defineClass(").replace(/this._super/g, 'panjs._classes["' + classPath + '"].Class._super') + '\n'+panjs._sourceUrl+ dirPath + "/" + className + ext;
			r = r.replace("defineStaticClass(", "var __CLASSPATH__='"+classPath+"';defineStaticClass(");
		return r;
	},

	addScriptNode: function(node, dirPath, className, classPath) {
		var subtype = node.getAttribute("data-subtype");
		var src = node.getAttribute("src");

		if (src == null) {
			var script = node.textContent;

			if ((className != null) && (subtype == "text/x-class-definition")) {
				script = this._processCode(script, className, dirPath, classPath, '.html');
			}
			panjs._exec(script);
		} else {
			var url = this._transformUrl(src, dirPath);

			if (!this.loadedJs[url.toLowerCase()]) {
				var r = this._loadFileSync(this._getUrlWithVersion(url));
				if ((className != null) && (subtype == "text/x-class-definition")) {
					r.data = this._processCode(r.data, className, dirPath, classPath, '.js')
				} else {
					r.data += '\n'+panjs._sourceUrl + src + '.js';
				}

				panjs._exec(r.data);
				this.loadedJs[url.toLowerCase()] = 1;

			} else {
				logger.debug( panjs.messages.SCRIPT_ALREADY_LOADED, url );
			}
		}
		return true;
	}

});



panjs.loader = new Tloader();
panjs.loader.init();

/*<ENV:dev>*/
if (panjs.stats.active)
	panjs.startCaptures();
/*</ENV:dev>*/

logger.info("READY. Panjs version: "+panjs.version);
