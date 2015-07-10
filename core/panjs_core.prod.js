
/*##############################################
###########  ..\..\core\helpers\base.js#################
##############################################*/


window["MsxmlObject"] = null;


function randomBetween(min, max){
  return Math.floor(Math.random() * max) + min;
}


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

function getDocHeight() {
    var D = document;
    return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    );
}

function getXml(xmlNode)
{
    var r;     
    
    if (xmlNode.xml)
      r = xmlNode.xml;
    else
      r = (new XMLSerializer()).serializeToString(xmlNode);  

    return r;
}

function getText(xmlNode)
{         
  var r;
  
  if (typeof xmlNode.text != "undefined")                                    
      r = xmlNode.text;   
  else
      r = xmlNode.textContent;
    
  return r;  
}

function CreateMSXMLDocumentObject () 
{
  if ( window["MsxmlObject"] == null)
  {
    if (typeof (ActiveXObject) != "undefined") 
    {
      var progIDs = [
      "Msxml2.DOMDocument.6.0", 
      "Msxml2.DOMDocument.5.0", 
      "Msxml2.DOMDocument.4.0", 
      "Msxml2.DOMDocument.3.0", 
      "MSXML2.DOMDocument", 
      "MSXML.DOMDocument"
      ];
      for (var i = 0; i < progIDs.length; i++) {
        try { 
          window["MsxmlObject"] = new ActiveXObject(progIDs[i]); 
          return window["MsxmlObject"];
        } catch(e) {};
      }
    }    
  }
  else
  {
      return window["MsxmlObject"];
  }

  return null;
}

function getXmlDocument (text) {

      var message = "";

      //On IE, if XML is malformed, ActiveXObject returns more infos than DOMParser
      if ((window.DOMParser) && ((panjs.iever >= 11)||(panjs.iever ==-1)) )
      { 
          // all browsers, except IE before version 9
          var parser = new DOMParser();
          try 
          {
            xmlDoc = parser.parseFromString (text, "text/xml");
          } 
          catch (e) 
          {
                    // if text is not well-formed, 
                    // it raises an exception in IE from version 9
                    throw "XML parsing error.";
          };
      }
      else 
      {  // Internet Explorer before version 9
        xmlDoc = CreateMSXMLDocumentObject ();
        if (!xmlDoc) 
        {
          throw "Cannot create XMLDocument object";
        }

        xmlDoc.loadXML (text);
      }

      var errorMsg = null;
      if (xmlDoc.parseError && xmlDoc.parseError.errorCode != 0) 
      {
        errorMsg = "XML Parsing Error: " + xmlDoc.parseError.reason
        + " at line " + xmlDoc.parseError.line
        + " at position " + xmlDoc.parseError.linepos;
      }
      else 
      {
        if (xmlDoc.documentElement) {
          var errors = xmlDoc.getElementsByTagName( 'parsererror' );
          if( errors.length > 0 )
            errorMsg = errors[0].textContent;
        }
        else {
          errorMsg = "XML Parsing Error!";
        }
      }

      if (errorMsg) {
        throw errorMsg;
      }

      return xmlDoc;
}

/*function isUndefined(obj) {
      return obj === void 0;
}*/

/* 
  defined(object, "prop1", "prop2", "prop3" , ...) 
*/
function defined(obj)
{
  if ((typeof obj != "undefined") && (obj != null))
  { 
    var o = obj;
    for (var i=1; i<arguments.length; i++)
    {
        if (defined( o[arguments[i]] ))
          o = o[arguments[i]];
        else
          return false;
    }
    return true;
  }
  else
  {
    return false;
  }
}

function getIEVersion()
  {
    var iever =-1;
    var reg = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (reg.exec(navigator.userAgent) != null)            
      iever = parseFloat(RegExp.$1); 

   return iever;
  }
function getFirefoxVersion()
  {
    var iever =-1;
    var reg = new RegExp("Firefox/([0-9]*)\.");
    if (reg.exec(navigator.userAgent) != null)            
      iever = parseFloat(RegExp.$1); 

   return iever;
  }
function getChromeVersion()
  {
      var r =-1;
      var reg = new RegExp("Chrome/([0-9]*)\.");
      if (reg.exec(navigator.userAgent) != null)            
        r = parseFloat(RegExp.$1); 
    return r;
  }


String.prototype.contains = function(it) { 
  return this.indexOf(it) > -1; 
};

String.prototype.gauche = function(souschaine)
{
 var index = this.indexOf(souschaine,0);
 if (index >=0)
 return this.substring(0, index)
 else
 return '';
}

String.prototype.capitalizeFirstLetter = function()
{
  if (this.length == 0)
    return this;
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.htmlEntities = function()
{ 
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

String.prototype.rightOf = function(search)
{
  var index = this.indexOf(search);

  if (index > -1)
    return this.substring(index+search.length, this.length);
  else 
    return "";
}
String.prototype.droite = String.prototype.rightOf;

String.prototype.rightRightOf = function(souschaine)
{ 
  var index = this.lastIndexOf(souschaine);
  if (index >0)
    return this.substr(index+souschaine.length);  
  else 
    return "";
}
String.prototype.droitedroite = String.prototype.rightRightOf;

String.prototype.isEmpty = function(){
   var s = this.trim();
   return (s == "");
};

String.prototype.startsWith = function(s){
   return this.indexOf(s) == 0;
};
String.prototype.endsWith = function(s){
   return this.lastIndexOf(s) == (this.length - s.length);
};


String.prototype.hashCode = function(){
    var hash = 0
		var i, c;
    if (this.length == 0) return hash;
    for (i = 0; i < this.length; i++) {
        c = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+c;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

String.prototype.removeEnd = function(s){
  if (this.endsWith(s))
    return this.substring(0, this.length - s.length);
  else
    return this.toString();   
};

String.prototype.removeEndCaseInsensitive = function(end)
{
		/*
		Renvoie la chaine s sans la chaine end, sans tenir compte de la casse   
		*/
		var hasEnd = ((this.toLowerCase().lastIndexOf(end) + end.length) ==  this.length)  ; 
		
		if (hasEnd == true)
		{
			var indx = this.toLowerCase().lastIndexOf(end.toLowerCase());  
		  return this.substr(0, indx);
		}
		return this;
}

Array.prototype.remove=function(s){
  /* supprime un object d'un tableau index�. La case est retir�e. */
  for(i=0;i < this.length; i++)
  {
    if(s==this[i]) 
    {
      this.splice(i, 1);
      return;
    }
  }
}

String.prototype.nbsouschaine = function(souschaine)
{
  var tmp = this;
  var result = 0;
  var index = tmp.indexOf(souschaine,0);
  while ( index != -1 )
  {   result++;
      tmp = tmp.substring(index+souschaine.length, tmp.length);
      index = tmp.indexOf(souschaine,0);
  }
  return result;
}

Array.prototype.pushArray = function (arr)
{  /* Ajout des �l�ments d'un tableau � un tableau */
	 for (var i=0; i<arr.length; i++)
	    this.push(arr[i]);
}


function base64encode(input)
{
  var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  if (typeof input !== 'string') 
    return input;
     
  if (typeof window.btoa !== 'undefined') 
    return window.btoa(input);
  var output = "", a, b, c, d, e, f, g, i = 0;
 
  while (i < input.length) {
        a = input.charCodeAt(i++);
        b = input.charCodeAt(i++);
        c = input.charCodeAt(i++);
        d = a >> 2;
        e = ((a & 3) << 4) | (b >> 4);
        f = ((b & 15) << 2) | (c >> 6);
        g = c & 63;
 
        if (isNaN(b)) f = g = 64;
        else if (isNaN(c)) g = 64;
 
        output += map.charAt(d) + map.charAt(e) + map.charAt(f) + map.charAt(g);
  }
 
  return output;
}
  
function base64decode(input)
{
  if (typeof input !== 'string') return input;
    else input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  if (typeof window.atob !== 'undefined') 
    return window.atob(input);
  
  var output = "", a, b, c, d, e, f, g, i = 0;

  while (i < input.length) {
        d = map.indexOf(input.charAt(i++));
        e = map.indexOf(input.charAt(i++));
        f = map.indexOf(input.charAt(i++));
        g = map.indexOf(input.charAt(i++));
 
        a = (d << 2) | (e >> 4);
        b = ((e & 15) << 4) | (f >> 2);
        c = ((f & 3) << 6) | g;
 
        output += String.fromCharCode(a);
        if (f != 64) output += String.fromCharCode(b);
        if (g != 64) output += String.fromCharCode(c);
  }

  return output;
}

function callLater(func) 
{
  var args = Array.prototype.slice.call(arguments).slice(1);
  return setTimeout(function(){ return func.apply(null, args); }, 50);
}

function delay(func, wait) 
{
  var args = Array.prototype.slice.call(arguments).slice(2);
  return setTimeout(function(){ return func.apply(null, args); }, wait);
}

function RGB2Color(r, g, b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n)
{
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}


/*##############################################
###########  ..\..\core\helpers\jquery.js#################
##############################################*/


/*
* Extension de jquery
*/

clone = function(obj) {
	return jQuery.extend(true, {}, obj);
}

$.fn.getElement = function (selector) {  
    //renvoie un seul element Jquery ou null si aucun élément trouvé 
		var r = $(selector, this);		     
		if (r.length == 0)
			return null;
			else
				if (r.length == 1)
				return r;
				else
					if (r.length > 1)
					return $(r[0]);
};
$.fn.getElements = function (selector) {  
    //renvoie un tableau Jquery d'elements Jquery (vide si aucun élément trouvé) 
		var r = $(selector, this);	//tableau d'élement DOM
		var result = $([]);
		if (r.length == 1)
			result.push(r);
		else
			for (var i=0; i< r.length; i++)
			{
				result.push($(r[i]));
			}		           
		return result;	
};

function isNumberKey(evt)
{
      var k = evt.which;
      var shift = evt.shiftKey;

      var numerosPavenum = ((k >=96) && (k<=105));
      var numerosClavier = ((k >=48) && (k<=57));

      return numerosPavenum || (numerosClavier && (shift == true));
}

function isControlKey(evt)
{	
	// flèches, backspace, supp, ctrl+C, ctrl+X , ctrl+V
	var k = evt.which;	
	var r =  (k == 8)||(k == 13)||(k == 46)||(k == 35)||(k == 36)||(k == 37)||(k == 39)||(k == 9) || ( evt.ctrlKey && (k=67))|| ( evt.ctrlKey && (k=86))|| ( evt.ctrlKey && (k=88));
	logger.debug(k+ ", r="+r);
	return r;
}


/*##############################################
###########  ..\..\core\starter.prod.js#################
##############################################*/


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

			uses("core.display.TerrorElement.html");
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
				uses("core.display.TerrorElement.html");  
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
					uses("core.display.TproxyDisplayObject");
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
				if (!classPath.contains("."))
				{
				//fichier à la racine
				r = classPath;
				if (isHtm)
					r = r +".html";
				else
					r = r +".js";
			}else
			{

				for (var k in panjs.namespaces)
				{
					if (classPath.startsWith(k+"."))
					{
						var r = classPath.removeEnd(".html").replace(/\./g, "/");
						r = r.replace(k, panjs.namespaces[k].path);
						if (isHtm)
							r = r +".html";
						else
							r = r +".js";

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

defineClass("Tlogger", "core.Tobject", {
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

defineClass("Tloader", "core.Tobject", {
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

								this.addScriptNode(node, dirPath, className); 
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
						r.data = this.processCode(r.data, className);
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
		var r = false;
		
		url = this.getUrlWithVersion(url);

		if (this.loadedCss[url.toLowerCase()])
			return r;
		
		var l = arguments.length;
		if (l == 0)
			throw "loadCssFile(url, type , rel): Missing url";
		
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

	processCode: function(code, className)
	{
		/*
			Remplace this._super par className._super
		*/  
		return code.replace(/this._super/g, className+"._super");   
	},

	addScriptNode: function(node, dirPath, className)
	{ 
		var subtype = node.getAttribute("subtype");
		var src = node.getAttribute("src");

		if (src == null)
		{
			var script = getText(node);
			
			if ((className != null) && ( subtype == "text/x-class-definition"))
			{ 
				script = this.processCode(script, className); 
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
					r.data = this.processCode(r.data, className)
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


/*##############################################
###########  ..\..\core\events\Tevent.js#################
##############################################*/

/*
Event
*/

/* 
params: type:String, bubbles:Boolean = false, cancelable:Boolean = false 
*/

defineClass("Tevent", "core.Tobject",
{  
	type: null,
	data: null,
	bubbles: false,
	cancelable: false,
	currentTarget: null,
	cancelled: false,
	defaultPrevented: false,

	constructor: function(type, eventData, bubbles, cancelable){
		this.injectParam("type", type,true);
		this.injectParam("data", eventData);
		this.injectParam("bubbles", bubbles);
		this.injectParam("cancelable", cancelable);     
	},
	preventDefault: function()
	{
		this.defaultPrevented = true;
	}
});

Tevent.CLICK = "CLICK";
Tevent.CHANGE = "CHANGE";
Tevent.SUCCESS = "SUCCESS";
Tevent.ERROR = "ERROR";
Tevent.DELETE = "DELETE";
Tevent.UPDATE = "UPDATE";
Tevent.ADDED = "ADDED";
Tevent.LOADED = "LOADED";
Tevent.BEFORE_LOAD = "BEFORE_LOAD";
Tevent.DATA_LOADED = "DATA_LOADED";
Tevent.REFRESH = "REFRESH";
Tevent.REPLACE = "REPLACE";
Tevent.ITEM_CLICKED = "ITEM_CLICKED";
Tevent.OPEN = "OPEN";
Tevent.CLOSE = "CLOSE";
Tevent.READY = "READY";
Tevent.BEFORE_STATE_CHANGE = "BEFORE_STATE_CHANGE";
Tevent.STATE_CHANGED = "STATE_CHANGED";

Tevent.SHOW = "SHOW";
Tevent.SHOWN = "SHOWN";
Tevent.HIDE = "HIDE";
Tevent.HIDDEN = "HIDDEN";
Tevent.WAITING = "WAITING";







/*##############################################
###########  ..\..\core\events\TeventDispatcher.js#################
##############################################*/

/*
TeventDispatcher 
_eventTypes: { type1:[listener1, listener2 ...], type2:[listener1, listener2 ...], ...}
*/

uses("core.events.Tevent");

defineClass("TeventDispatcher", "core.Tobject", { 

	_listeners: null,
	
	
	constructor: function(args){
		this._listeners = {};
		//logger.debug("TeventDispatcher.init ",this.className,". args=",args);
	},
	free: function(){
		this.removeAllListeners();
	},
	/* 	params event:Tevent 
		return Boolean
	*/
	_getListenerIndex: function(type, listener)
	{	
		if (!this.hasEventListener(type))
			return -1;
		
		for (var i=0; i< this._listeners[type].length; i++)
		{
			if (this._listeners[type][i].listener == listener)
			return i;
		}
		return -1;
	},
	
	dispatchEvent: function(mixed, eventData, bubbles, cancelable)
	{	
		/*mixed = Tevent: {type, eventData, bubbles, cancelable}
			or 
		mixed = {type, eventData, bubbles, cancelable}*/

		var type = null;
		var event = null;
		if (typeof mixed == "object")
		{
			event = mixed;
			type = mixed.type;
		}
		else{
			type = arguments[0];
		}

		if (!this.hasEventListener(type))
				return;
		//un objet event n'est créé que si il y a des listeners
		if (event == null)
			event = new Tevent(type, eventData, bubbles, cancelable);
		
		var listeners = this._listeners[event.type];

		for (var i=0; i< listeners.length; i++)
		{
			if (listeners[i] != null)
			{
				var list = listeners[i];

				if (event.currentTarget == null)
				event.currentTarget = this;

				event.bind =  list.bind;
				event.relatedData = list.data;
				
				if (event.bind == null)
					list.listener(event);
				else
					list.listener.call(event.bind,event);
				
				if (event.cancelled)
					break;
			}
		}	
	},

	/* 	params type:String, listener:Function
		return void
	*/
	on: function(type, listener, bind, data)
	{
		if (arguments.length <4 ) var data = null;
		if (arguments.length <3 ) var bind = null;

		var l = {"listener":listener, "data": data, "bind":bind};

		if (!this.hasEventListener(type))
			this._listeners[type] = [];
		
		for (var i=0; i< this._listeners[type].length; i++)
		{
			if (this._listeners[type][i] == null)
			{
				this._listeners[type][i] = l;
				return;
			}
		}	
		this._listeners[type].push(l);
	},

	
	offByCtx: function(ctx){
		for (type in this._listeners)
		{
			var listeners = this._listeners[type];
			for (var i=0; i< listeners.length; i++)
			{
				if ((listeners[i] != null)&&(listeners[i].bind == ctx))
				{
					listeners[i] = null;
				}	
			}
		}
	},
	
	off: function(type, listener)
	{
		var indx = this._getListenerIndex(type, listener);
	
		if (indx >= 0)
		{
			this._listeners[type][indx] = null;
		}
	},
	removeAllListeners: function()
	{
		for (type in this._listeners)
		{
			this._listeners[type].length = 0;
			this._listeners[type] = null;
			delete this._listeners[type];
		}
	},
	/* 	params: type:String	
		return Boolean
	*/
	hasEventListener: function(evtType) 
	{
		return (typeof this._listeners[evtType] != "undefined");
	}
});


/*##############################################
###########  ..\..\core\Application.js#################
##############################################*/

/*
Event
*/

/* 
params: type:String, bubbles:Boolean = false, cancelable:Boolean = false 
*/

defineClass("Application", "core.events.TeventDispatcher",
{  
	constructor: function(args){
		 
	}
});




/*##############################################
###########  ..\..\core\managers\Trouter.js#################
##############################################*/


defineClass("Trouter", "core.events.TeventDispatcher", {
	
	hash: "",
    sendEvents: true,
    keys: {},
    listeners: {},
    base64encode: false,

	constructor: function(args) {
		Trouter._super.constructor.call(this,args);

  		if ("onhashchange" in window) 
	    {
	      window.onhashchange = this.onhashchange.bind(this);
	    }
	    else    
	    {
	      logger.error("Trouter.constructor: Event window.hashchanging not supported!")
	    }
  	},
  	refreshkeys: function()
  	{
		var hash = window.location.hash.droite('#');
		this.keys = this.decode(hash);
		//logger.debug("Trouter.refreshkeys: this.keys = "+JSON.stringify(this.keys));
  	},
  	registerComponent: function(c, onhashchange)
  	{
  		this.refreshkeys();
  		if (typeof this.listeners[c.hashKey] == "undefined")
  			this.listeners[c.hashKey] = [];
  		this.listeners[c.hashKey].push( {owner: c, onhashchange: onhashchange.bind(c) });
  	},

  	getHash: function(owner)
  	{
  		var r = this.keys[owner.hashKey] ||null;
  		return r;
  	},
	setHash: function(owner, value, silent)
  	{
  		//if (typeof value == "undefined")
  		//	value = null;
  		//logger.debug("START Trouter.setHash: "+value+" silent="+silent);
  		if (this.keys[owner.hashKey] != value)
  		{
  			var oldValue = this.keys[owner.hashKey];

  			this.keys[owner.hashKey] = value||null;
  			var encoded = this.encode(this.keys);
  			this.sendEvents = false;
			window.location.hash = encoded;
			/*Le fait d'avoir déjà modifié this.keys fait que onhashchange ne détectera pas qeul objet a modifié son hash (pas de différence)
			et n'enverra pas d'evenement donc on envoie l'évènement ici.
			De plus, c'est plus optimisé.
			!!edit: en fait onhashchange est déclenché quand même après cette fonction.
			*/

			if (!silent)
				this._dispatchOnhashchange(owner.hashKey, value, oldValue);

			//logger.debug("Trouter.setHash: RETOUR Onhashchange="+r);
			this.sendEvents = true;	
		}
		else
		{
			logger.debug("Trouter.setHash: "+value+" => inchangé sur "+owner.id);
			//this._dispatchOnhashchange(owner.hashKey, value);
		}
		//logger.debug("END Trouter.setHash: "+value+" silent="+silent);
  	},
  	_dispatchOnhashchange: function( hashKey, hash, oldValue)
  	{
  		if (typeof hash == "undefined")
			hash = null;

		if (hashKey != null)
		{
			if (this.listeners[hashKey])
			{
				for (var i=0; i<this.listeners[hashKey].length; i++){
					var l = this.listeners[hashKey][i];	
					l.onhashchange(hash, oldValue);
				}
				
			}
		}/*else{

			for (var k in this.listeners)
			{			
				var l = this.listeners[k];
				l.onhashchange(hash);	
			}
		}*/
  	},
  	decode: function(str)
  	{
  		var r = {};
  		if ((str != ""))
  		{
  			try{

  				if (this.base64encode)	
	    		str = base64decode(str);   

	    		//r = JSON.parse(r);
	    		str = str.split("&");

	    		for (var i=0; i<str.length; i++)
	    		{
	    			if (str[i].trim() != "")
	    			{
	    				var arr = str[i].split("=");
	    				k = arr[0];
	    				v = arr[1];
	    				//if (v.trim() != "")
	    				r[k] = v;
	    			}
	    		}
			}catch(err)
			{
				logger.error("Trouter.decode: Echec decodage de "+str+" en objet: "+err);
			}
		}
		/*else
		{
			logger.error("Trouter.decode: Echec decodage  de "+str+" en objet: chaine vide");
		}*/
		return r;
  	},

  	encode: function(obj)
  	{
  		var r = "";

  		try{
  				
	    		//r = JSON.stringify(object);
	    		for (k in obj)
	    		{
	    			if (typeof obj[k] == 'string')
	    			//if ((obj[k].trim() != "")&&(obj[k].trim() != ""))
	    			r = r+k+"="+obj[k]+"&";
	    		}
	    		
	    		if (this.base64encode)	
	    		r = base64encode(r);  

		}catch(err)
		{
			logger.error("Trouter.encode: Echec encodage de "+obj+" en string: "+err);
			logger.debug("Trouter.encode: obj = "+JSON.encode(obj));
		}
		return r;
  	},

  	onhashchange: function(e)
  	{
  		//*Le hash n'est pas codé (il provient de liens):
  		/* Cette fonction est déclenchée uniquement quand on modifie l'Url manuellement ou que l'on avance ou recule dans l'historique */
  		if (!this.sendEvents)
  			return false;

	    this.hash = window.location.hash.droite('#');
	    this.keysTmp = this.decode(this.hash);

	    /*
		
	    */
		//logger.debug("Trouter.onhashchange: PHASE 1 :");	    
		//logger.debug("Trouter.onhashchange: this.keysTmp = "+JSON.stringify(this.keysTmp));
		//logger.debug("Trouter.onhashchange: this.keys = "+JSON.stringify(this.keys));

  		for (k in this.keysTmp)
	    {
	  		//logger.debug("Trouter.onhashchange: k="+k+" , this.keys[k]="+this.keys[k]+", this.keysTmp[k]="+this.keysTmp[k]);
	    	if ((typeof this.keys[k] == "undefined")||(this.keys[k] == null))
	    	{
	    		//la clef est valorisée alors qu'elle ne l'était pas
	    		var oldhash =  null;
	    		this.keys[k] = this.keysTmp[k];
	    		//logger.debug("Trouter.onhashchange: VALORISATION this.keys["+k+"] = "+this.keysTmp[k]);
	    		logger.debug("Trouter.onhashchange: [1] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]+", oldhash="+oldhash);
	    		this._dispatchOnhashchange(k, this.keys[k], oldhash);   
	    	}else{
				//la clef est valorisée, elle l'était déjà
	    		if (this.keysTmp[k] != this.keys[k])
	    		{
	    			var oldhash =  this.keys[k];
	    			//logger.debug("Trouter.onhashchange: VALORISATION this.keys["+k+"] = "+this.keysTmp[k]);
	    			this.keys[k] = this.keysTmp[k];
	    			logger.debug("Trouter.onhashchange: [2] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]+", oldhash="+oldhash);
	    			this._dispatchOnhashchange(k, this.keys[k], oldhash);  
	    		}
	    	}
	    	    	
	    }

	    //logger.debug("Trouter.onhashchange: PHASE 2 :");
	    //logger.debug("Trouter.onhashchange: this.keysTmp = "+JSON.stringify(this.keysTmp));
		//logger.debug("Trouter.onhashchange: this.keys = "+JSON.stringify(this.keys));
	    //Mise à null des clefs qui n'existent plus

  		for (k in this.keys){
  			found = true;		
  			if (typeof this.keysTmp[k] == "undefined")
	    	{	    			
	    		this.keys[k] = null;
	    		logger.debug("Trouter.onhashchange: [3] Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    		if (typeof this.listeners[k] != "undefined"){
	    			
	    			this._dispatchOnhashchange(k, this.keys[k], null);   
	    		}
	    	}
  		}
	    
		var evt = new Tevent(Trouter.HASH_CHANGE,  this.keys);
	    this.dispatchEvent(evt);

		
		return false;
  	}

});

Trouter.HASH_CHANGE = "HASH_CHANGE" ;

panjs.router = new Trouter();


/*##############################################
###########  ..\..\core\display\TproxyDisplayObject.js#################
##############################################*/


defineClass("TproxyDisplayObject", "core.events.TeventDispatcher",
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
		this.sourceElement.setAttribute("loaded", "false");
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





/*##############################################
###########  ..\..\core\collections\TarrayCollection.js#################
##############################################*/


/*** 
Tobject 
***/

defineClass("TarrayCollection", "core.events.TeventDispatcher", {
	_source:null,
	length:0,
  key: null,
  _byId: null,
 // _length:0,
  filterFunction: null,
  _items: null,

	constructor: function(args) { 
		TarrayCollection._super.constructor.call(this,args);
    
    this._items = [];

    var data = [];
    if (args){
      if (typeof args.push != "undefined"){
        data = args;
      }else{
        if (args.key)
          this.key = args.key;
        if (args.data)
          data = args.data;
        if (args.filterFunction)
          this.filterFunction = args.filterFunction;
      }
    }

    this._byId = {};
    this.setSource(data);
    
   /* ça fonction */
   
   /*   Object.defineProperty(this._source, "length", {
            set : function(newValue){ 
                logger.debug("changedgg "+this._length+" => "+newValue);
                this._length = newValue; 
            },
            get : function(){ 
                return this._length; 
            }
    });*/

  

  	},
	
	/*
  		PUBLIC
  	*/
  sort:function( sortFunction)
  {
      if (defined(sortFunction))
        this._items.sort(sortFunction);
  },
  
	  getSource: function()
  	{
  		return this._items;
  	},
  	setSource: function(value)
  	{
  		if (this._source != value)
  		{
  			this._source = value;
        
        if (this.filterFunction != null){
          this._items = this._source.filter( this.filterFunction );
        }
        else{
          this._items = this._source.slice(0);
        }

        if (this.key != null)
        {
          this._byId = {};
          for (var i=0; i<this._items.length; i++)
            this._byId[ this._items[i][this.key]] = this._items[i];
        }
        this.length = this._items.length;
  			this.refresh();
  		}
  	},
	 find: function(opt)
   {
      var r = [];
      if (opt.filterFunction){
        for (var i=0; i<this._source.length; i++){
          if (opt.filterFunction(this._source[i]))
            r.push(this._source[i]);
        }
      }
     
      return r;
   },
    getByKey: function(key)
    {
      return  this._byId[key];
    },
    getByProp: function(propname, propvalue, multiple, case_sensitive)
    {
      var r = null;
      
      if ((this.key!=null) && (propname == this.key))
      {
          if (typeof this._byId[propvalue] != "undefined")
            r = this._byId[propvalue];
      }else
      {
        if (typeof case_sensitive == "undefined")
          case_sensitive = false;

        if ((!case_sensitive)&&(typeof propvalue == 'string'))
          propvalue = propvalue.toLowerCase();

          if (arguments.length < 3)
          {
             var multiple = false;
          }
          else{
              r = [];
          }
          for (var i=0; i<this._items.length; i++)
          {            
            var item = this._items[i];
            
            if (typeof item[propname] != "undefined")
            {  
              var tmp =  item[propname];
             if ((!case_sensitive)&&(typeof item[propname] == 'string'))
                  tmp =  item[propname].toLowerCase();

              if (tmp == propvalue)
              {
                if (multiple == true)
                {
                  r.push(item);
                }
                else
                {
                  r = item;
                  break;
                }
                
              }
            }
          } 
      }
     
      return r;
    },
    getFilterFunction: function(){
      return this.filterFunction;
    },
    setFilterFunction: function( f ){
      if (this.filterFunction != f){
        this.filterFunction = f;
      }
    },
    dispatchUpdateEvent: function(item){
      this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"UPDATE", item: item}));
    },
   
    refresh:function()
    {
      
      if (this.filterFunction != null)
        this._items = this._source.filter( this.filterFunction );
      //else
      //   this._items = this._source.slice(0);

      this.length = this._items.length;
     
      this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REFRESH"}));
    },

    /*
    ******************** LECTURE DE LA COLLECTION ************************
    */
    _getItemIndex: function(item, list)
    {
      for (var k=0; k<list.length; k++)
      {
          if (list[k] == item)
            return k;
      }
      return -1;
    },
    getItemIndex: function(item)
    {
      return this._getItemIndex(item, this._items);
    },

    getItemAt: function(indx)
    {
      return this._items[indx];
    },
  
    contains: function(item){
      return (this.getItemIndex(item)>=0);
    },
    /*
    ******************** MODIFICATION DE LA COLLECTION ************************
    */
    _replaceItem: function(indx, item, newItem){
      
      this._items[indx] = newItem;
      if (this.key != null)
      {
        this._byId[item[this.key]] = newItem;
        this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
      }
              
      this.length = this._items.length;      
      this.dispatchEvent( new Tevent(Tevent.REPLACE, {item:item, newItem: newItem}));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REPLACE",item:item, newItem: newItem}));
    },
   
    replaceItem:function(item, newItem)
    { 
      if (item == newItem)
        return;

        var indx = this._getItemIndex(item, this._source);
        if (indx > -1)
          this._source[ indx] = newItem;
        
        indx = this.getItemIndex(item);
        if (indx > -1)
        {                 
          if (this.filterFunction == null)
          {
            this._replaceItem(indx, item, newItem);
          }else
          {          
              if (this.filterFunction(newItem))
              {
                //Filtre OK
                this._replaceItem(indx, item, newItem);

              }
              else
              {
                //Filtre KO
                this._removeItemAt(indx, newItem);
              }
          }
          
       }
    },
    _addItemAt: function(indx, item)
    {   

        if (this.key != null)
        {
          if (typeof this._byId[item[this.key]] != "undefined")
          {
            throw "Key already in collection: "+item[this.key];
          }
          this._byId[item[this.key]] = item;
        }
        
        this._items.splice(indx, 0, item);
        this.length = this._items.length;    

        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:indx}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:indx}));
    },

  	addItem: function(item)
  	{
        this._source.push(item);

        if ((this.filterFunction == null) || (this.filterFunction(item)))
        {
          var indx = this.getItemIndex(item);          
          if (indx == -1)
          {
             this._addItemAt(this.length, item);
          }
        }
  	},

    addItemsAt: function(items, indx)
    { 
      if (indx > this.length)
      {
        this.addItems(items);
      }else{
        var position = indx;
        for (var i=0; i<items.length; i++)
        {
          this._source.push(items[i]);
          if ((this.filterFunction == null) || (this.filterFunction(items[i])))
          {
            var indx = this.getItemIndex(items[i]);   
            if (indx > -1){
              position ++;         
              this._addItemAt(position, items[i]);  
            }
            
          }
        }     
      }
    },

    addItems: function(items)
    { 
      this.addItemsAt(items, this.length);
    },
    addItemAt: function(item, indx)
    {
        if (indx > this.length){
          this.addItem(item)
        }else{
            this._source.push(item);
            if ((this.filterFunction == null) || (this.filterFunction(item)))
            {
              this._addItemAt(indx, item );
            }       
        }
    },
    forEach: function( f ){
      this._items.forEach( f );
    },
    removeItems: function(mixed)
    {
      if (typeof mixed == "function")
      {
        var itemsToRemove = [];
        for (var i =0; i< this._items.length; i++)          
          if (mixed(this._items[i]))
            itemsToRemove.push(this._items[i]);
      }else{
        var itemsToRemove = mixed;
      }
      
      for (var i =0; i< itemsToRemove.length; i++) 
        this.removeItem( itemsToRemove[i] );

      return itemsToRemove;
    },

  	removeItem: function(item)
  	{
      if (item != null)
      {
        var indx = this.getItemIndex(item);
        if (indx >= 0){
          this._removeItemAt(indx, item);
        }
      }else{
         var indx = -1;
      }
  		
      return indx;
  	},
  	
  	removeItemAt: function(indx)
  	{ 
  		var item = this.getItemAt(indx);
      if (item != null)
  		  this._removeItemAt(indx, item);
  	},
  	
  	removeAll: function()
  	{
  		this._source = [];
      this._items = [];
      this._byId = {};
  		this.refresh();
  	},
   
    
  	/*
  		PRIVATE
  	*/
  	_removeItemAt: function(indx, item)
  	{
  		this._items.splice(indx, 1);

      var indxSource = this._getItemIndex(item, this._source);
     
      if (indxSource>= 0)
        this._source.splice(indxSource, 1);
 
      this.length = this._items.length;
      if (this.key != null)
        delete this._byId[item[this.key]];

  		this.dispatchEvent( new Tevent(Tevent.DELETE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"DELETE", item:item}));
  	}
});



/*##############################################
###########  ..\..\core\display\TdisplayObject.js#################
##############################################*/


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


defineClass("TdisplayObject", "core.events.TeventDispatcher",
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
	
	/* METHODES */
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

		//parfois on a besoin d'un id unique (voir Tcheckbox).				
		//if (!defined(args, "id")) 
			this._setId( this.className+window[this.className].lastId );
		//else
		//	this._setId(args.id);

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

	_setId: function(value)
	{
		/* attention: ici this.container n'est pas encore un objet jquery*/
		this.id = value;
		this.container.attr("id", "ctn"+this.id);
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




/*##############################################
###########  ..\..\core\display\TdisplayObjectContainer.js#################
##############################################*/

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
						text = el.textContent;
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


/*##############################################
###########  ..\..\core\display\Telement.js#################
##############################################*/

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





