
/*##############################################
###########  D:\github\panjs\panjs\extend\base.js#################
##############################################*/

window["MsxmlObject"] = null;

function exec(s)
{           
  if (s == "") return;  

  if (typeof window.execScript != "undefined")
      window.execScript(s);  //Port� globale (eval sur IE n'a pas de port� globale)
    else
      window.eval(s);
}
function getDateFromTimestamp(d){
    var r = "";
    if (d != null){

      r = new Date(parseInt(d) * 1000);
      var year = r.getFullYear();
      var month = r.getMonth()+1;
      if (month < 10)
        month = "0"+month;

      var day = r.getDate();
      if (day < 10)
        day = "0"+day;

      var hour = r.getHours();
         if (hour < 10)
        hour = "0"+hour;

      var min = r.getMinutes();
         if (min < 10)
        min = "0"+min;

      var sec = r.getSeconds();
         if (sec < 10)
        sec = "0"+sec;

      r = year+"/"+month+"/"+day+" "+hour + ':' + min + ':' + sec;
    }
    return r;
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
          if (xmlDoc.documentElement.nodeName == "parsererror") {
            errorMsg = xmlDoc.documentElement.childNodes[0].nodeValue;
          }
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



/*function getXmlDocument(txt)
{
  var xmlDoc = null;
  if (window.DOMParser)
    { 
    var parser=new DOMParser();
    
      xmlDoc=parser.parseFromString(txt,"text/xml");
      if (xmlDoc.documentElement.nodeName == "parsererror") 
      {
        var errStr = xmlDoc.documentElement.childNodes[0].nodeValue;
        throw errStr;
      }
   
    }
  else 
    {
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(txt);
    } 
    return xmlDoc;
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


if (!Number.toFixed) {
  Number.prototype.toFixed=function(n){
    var n = Math.pow(10, n);
    return Math.round(this*n) / n;
  }
}

String.prototype.contains = function(it) { 
  return this.indexOf(it) > -1; 
};
String.prototype.trim = function() { 
  var r = this.replace(/^\s+/g,'').replace(/\s+$/g,''); 
  r = r.replace(/^\n+/g,'').replace(/\n+$/g,''); 
  return r;
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

  var r = this.charAt(0).toUpperCase();
  if (this.length >1)
    r = r+this.substr(1);
  return r;
}

String.prototype.htmlEntities = function()
{ 
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

String.prototype.droite = function(souschaine)
{ 
 var index = this.indexOf(souschaine);

 if (index > -1)
    return this.substring(index+souschaine.length, this.length);
 else 
    return "";
}

String.prototype.droitedroite = function(souschaine)
{ 
  var index = this.lastIndexOf(souschaine);
  if (index >0)
    return this.substr(index+souschaine.length);  
  else 
    return "";
}

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
    return this;   
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

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };      
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


/*##############################################
###########  D:\github\panjs\panjs\extend\jquery.js#################
##############################################*/


/*
* Extension de jquery
*/

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
	return (k == 8)||(k == 13)||(k == 46)||(k == 37)||(k == 39)||(k == 9) || ( evt.ctrlKey && (k=67))|| ( evt.ctrlKey && (k=86))|| ( evt.ctrlKey && (k=88));
}


/*##############################################
###########  D:\github\panjs\panjs\core\starter.js#################
##############################################*/


 (function () {

  panjs.logger = null;
  panjs.root = {id:"root"};
  panjs.loader = null;
  panjs.iever = getIEVersion();
 
  panjs.messages = {
    CLASSNAME_MATCHS_FILENAME: "The name of the class (%1) must match the file name %2 (case sensitive)",
    LESS_IE8: "less.js is not fully compatible with IE%1 : transform less code in css",
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

  for (var i=0; i<panjs.namespaces.length; i++){
    if (typeof( panjs.namespaces[i]) != "undefined")
      panjs.namespaces[i].path = panjs.namespaces[i].path.replace("{version}", panjs.version);       
  }
 
  /* 
    CreateCompoennt 
  */
  panjs.createComponent = function(classPath, args)
  {  
    var className = panjs.getClassNameFromClassPath(classPath);
    
    if (typeof window[className] == "undefined")
    {
      var r = panjs.loader.usesComponent(classPath);
      if (!r.result) 
      {        
          uses("core.display.TerrorElement.html");
          var object = new TerrorElement(r);
          return object;
      }

    }
    try{
      var object = new window[className](args);
    }catch(err){
       uses("core.display.TerrorElement.html");
       var object = new TerrorElement({message: err, path:r.path,url:r.url, className:className});
    }

    //_onInitialized signifie que l'objet est compètement construit (mais il n'est pas forcément visible).
    //!!cette fonction ne s'applique qu'aux composants (mais devrait aussi s'appliquer aux objets)
    if (object._onInitialized)
    object._onInitialized();

    return object;
  }

  /*
    _load
  */
  panjs.load = function(element)
  {     
      if (arguments.length == 0)
        var element = $(document.body);
      
      var compolist = element.getElements("[data-compo]");

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
          var compo = new TproxyDisplayObject({sourceElement: el[0] });
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
      for (var i=0; i< panjs.namespaces.length; i++)
      {
        var n = panjs.namespaces[i];
        
        if (classPath.startsWith(n.name))
        {
          var r = classPath.removeEnd(".html").replace(/\./g, "/");
          r = r.replace(n.name, n.path);
          if (isHtm)
            r = r +".html";
          else
            r = r +".js";

          break;
        }
      }
    }
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
 

       // if ((panjs.iever != 8)&&(panjs.iever != 9))
       if (panjs.iever != 8)
        {
            for (k in properties)
            { 
               /* if (k.startsWith("Bindable_"))
                {
                  var oldK = properties[k];
                  k = k.droite("Bindable_");
                   console.log(k+" => "+typeof oldK);

                
                  def[k] = { 
                    configurable: true,
                    enumerable: true,
                    get: function(){
                      return this["__"+k];
                    },
                    set: function(v){
                      this["__"+k] = v;
                      this["on_var1_changed"]();
                    }
                  }

                }else{*/
                  def[k] = {
                    value: properties[k],
                    writable: true, 
                    configurable: true,
                    enumerable: true
                  }
                //}
                
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
        }
        else
        {
          /* ************ IE8 *********/
          var F = properties.constructor;

          for (k in superProto)
          {
            if ((k != "constructor")&&(k != "_super"))
            F.prototype[k] = superProto[k];
          }
            
          for (k in properties)
          {

            if ((k != "constructor")&&(k != "_super"))
            F.prototype[k] = properties[k];
          }
       
          F.extend = this.extend; 
          F._super = superProto;
          F.prototype.parentClassName = parentClassName;
          F.prototype.classHierarchy = superProto.classHierarchy + ' '+className;
          var constr = F;  

        }
      
        return constr;
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
    },
    callLater: function(f,a)
    {
   
      setTimeout(f.bind(this, a), 50);
    }
};


function defineClass(className, inheritsFromClassPath, def)
{
  var isHtm = inheritsFromClassPath.endsWith(".html");
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

  window[className] = window[classe].extend(def,className,classe);

  panjs.lastDefinedClassName = className;
}

function uses(classPath)
{
	var isHtm = classPath.endsWith(".html");
	if (isHtm)
		panjs.loader.usesComponent(classPath);
	else
		panjs.loader.uses(classPath);
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
  	getLevelName:function()
  	{
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
  	_debug: function()
  	{
      //bizarrement, console.debug n'existe pas sur IE9  mais si on log en console.info, ça sort en debug dans la console
      // console.log sort en INFO dans la console dans tous les cas.
      if (this.active)
  		if (console.debug)
        console.debug(this._getMessage("DEBUG", arguments));
      else
        console.info(this._getMessage("DEBUG", arguments));
  	},
  	_info: function()
  	{
      if (this.active){
		  console.log(this._getMessage("INFO", arguments));
		}
  	},
    _warn: function()
    {
      if (this.active)
      console.warn(this._getMessage("WARN", arguments));
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

      var t = this._getTime()+ "ms("+this._currentGroup+")";

      if (t < 100) t = t + " ";
      if (t < 1000) t = t + " ";
      if (t < 10000) t = t + " ";
      if (t < 100000) t = t + " ";
   
      return t+" - " +sev+"\t"+this._tabulation+r;
    },

  	setLevel: function(value)
  	{
  		this._level = value;

  		this.debug = this._debug;
  		this.info = this._info;
      	this.warn = this._warn;
  		this.error = this._error;
 		
  		if (value >= Tlogger.INFO)
  			this.debug = function(){};
  
      	if (value >= Tlogger.WARN)
       		this.info = function(){};

  		if (value >= Tlogger.ERROR)
  			this.warn = function(){};
  	}
});

Tlogger.DEBUG = 10;
Tlogger.INFO = 20;
Tlogger.WARN = 25;
Tlogger.ERROR = 30;

//loader needs logger.
panjs.logger = new Tlogger({level: Tlogger[panjs.logLevel], name:"main"});
logger = panjs.logger;



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

  constructor: function(args) {
    
    this.loadedJs = {};
    this.loadedCss = {};

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
        var classPathDir = null;
        var className = panjs.getClassNameFromClassPath(classPath);

        if (classPath.endsWith(".js"))
          classPathDir =  classPath.removeEnd(className+".js"); 
        else 
          if (classPath.endsWith(".html"))
          classPathDir =  classPath.removeEnd(className+".html"); 
        else
          return;

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
      url=url+"&rid="+Math.random();

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
      return {result:false, message:"Too much nested components (max: "+this.maxImbrications+")", className: className, classPath:classPath, url: url, path:path};
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
            var dom = getXmlDocument(r.data);
          }catch(err){
            logger.error(err);         
            return {result:false, message:err, className: className, classPath:classPath, url: url, path:path};
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
                try{  
                  this.addScriptNode(node, dirPath, className); 
                }catch(err)
                {
                  var mess =  "Error processing <"+nodeName+"> => "+err;
                  logger.error(path,mess);
                  return {result:false, message: mess, className: className, classPath:classPath, url: url, path:path, stack:err.stack}; 
                }

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
            try{
                var html = getXml(bodyNode);
                var parentClassName = window[className].prototype.parentClassName;
                
                if (defined(window[parentClassName].prototype.html))
                {          
                  html = window[parentClassName].prototype.html.replace( '<!--CONTENT-->', html);
                  html = "<div>"+html.replace(/<body>/gi, "").replace(/<\/body>/gi, "")+"</div>";
                }
                else
                {
                  html = html.replace(/<body>/gi, "<div>").replace(/<\/body>/gi, "</div>");
                }

                html = html.replace(/\\r/gi, "").replace(/\\n/gi, "").trim();
                
                window[className].prototype.html = html;

                if (panjs.iever == 8)
                  window[className].prototype.html = $(html)[0].innerHTML; //correct HTML for IE8 (</div/> => <div></div>).

                window[className].prototype.bodyNode = bodyNode;
            }
            catch(e)
            {
              return {result:false, message:e.message, className: className, classPath:classPath, url: url, path:path};
            }
          }
          /*else
          {         
            //html et bodyNode are inherited            
          }*/
          
          window[className].prototype.classPath = classPath;  
          window[className].prototype.classPathDir = this.getClassPathDir(classPath);
          window[className].prototype.className = className;    
          window[className].lastId = 0;
          
          this._count --;
          if (this._count == 0)
          {
            logger.debug(h, " END USESCOMPONENT ",classPath,h);   
            
          }
      
          logger.groupEnd();
          return {result:true, message:"ok", className: className, classPath:classPath, url: url, path:path}; 
      }
      else
      {
        var mess = "Error loading "+classPath+": "+ r.status;
        logger.warn(mess);
        this._count --;
        logger.groupEnd();
        return {result:false, message:mess, className: className, classPath:classPath, url: url, path:path};
      }
      
    }

    return  {result:true, message:"Already loaded", className: className, classPath:classPath, url: url, path:path}; 
    
  },

    uses: function(classPath)
    {
    
    var h = " ------------ ";
    var className = panjs.getClassNameFromClassPath(classPath);
    var url = null;
    var path = null;

    if (typeof window[className] == "undefined")
    { logger.groupStart();
      if (this._count == 0)
        logger.info(h," USES ",classPath, h);

      path = panjs.getAbsoluteUrlFromClassPath(classPath);
      if (this.loadedJs[path.toLowerCase()] == true)
        return true;

      this._count ++;

      logger.groupStart();
      url = this.getUrlWithVersion(path);

      var r = this.loadFile(url);     
      

      if (r.result)
      {
          r.data = this.processCode(r.data, className);
          exec(r.data);
          window[className].prototype.classPath = classPath;    
          window[className].prototype.className = className;  
          window[className].prototype.classPathDir = this.getClassPathDir(classPath);
          window[className].lastId = 0; 
      }
      logger.debug(className+" = "+typeof window[className]+" path = "+path+", result="+r.result);
      this._count --;
      
      logger.groupEnd();


      if (this._count == 0)
        logger.debug(h," END USES ",classPath,h);     

      logger.groupEnd();
      return true;
    }
    
    },

  addLinkNode: function(node,dirPath)
  {     
    var url = panjs.transformUrl(node.getAttribute("href"),dirPath);
    if (this.loadedCss[url.toLowerCase()] == true)
    {
      return true;
    }
    url = this.getUrlWithVersion(url);

    if ((document.createStyleSheet)&&(panjs.iever == 8))
    {   
      document.createStyleSheet(url);
    }
    else
    {   
      var rel =  node.getAttribute("rel");
      if (rel == null)
        rel = 'stylesheet';

      var type =  node.getAttribute("type");
      if (type == null)
        type = 'text/css';

      var link  = document.createElement('link');
      link.rel  = rel;
      link.type = type;
      link.href = url;

      if (rel == "stylesheet/less")
      {
        if ((panjs.iever >0)&&(panjs.iever<=8))
        {
          logger.warn( panjs.getMessage(panjs.messages.LESS_IE8, panjs.iever));
        }else
        {
          if (this.lessIsLoaded())
          {
            less.sheets.push(link);
            less.refresh(true);
            logger.debug("INJECTION LESS OK");
          }
          else
          {
            logger.warn( panjs.getMessage(panjs.messages.LESS_NOT_LOADED));
          }
        }
      }
      else
      {
        document.getElementsByTagName('head')[0].appendChild(link);                                 
      }
    }   
    logger.debug("Load <link> ASYNC: "+url);
    this.loadedCss[url.toLowerCase()] = true;
    return true;
  },  
  addStyle: function(css, type){

    if (typeof type =="undefined")
      var type = "text/css";

    $('<style type="'+type+'">' + css +'</style>').appendTo('head');
    
      if (type == "text/less")
      {   
        if ((panjs.iever >0)&&(panjs.iever<=8))
        {
          logger.warn( panjs.getMessage(panjs.messages.LESS_IE8, panjs.iever));
        }else
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

    if (node.getAttribute("src") == null)
    {
      var script = getText(node); //Attention si <!DOCTYPE html> est mis en haut du fichier, PB IE8

      if ((className != null) && (node.getAttribute("type") == "text/x-class-definition"))
      { 
        script = this.processCode(script, className); 
      }
      else
      {
        if (className != null)  
          logger.warn("type=\"text/x-class-definition\" doesn't exist on <script> ("+className+")");
      }
      
      exec(script);

    }
    else
    {      
      var url = panjs.transformUrl(node.getAttribute("src"),dirPath);
      url = this.getUrlWithVersion(url);
      if (this.loadedJs[url.toLowerCase()] == false)
      {         
        var r = this.loadFile(url);
        if ((className != null) && (node.getAttribute("type") == "text/x-class-definition"))
          r.data = this.processCode(r.data, className)

        exec(r.data);
      }
    } 
    return true;
  }   

});

panjs.loader = new Tloader();


/*##############################################
###########  D:\github\panjs\panjs\core\events\Tevent.js#################
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
###########  D:\github\panjs\panjs\core\events\TeventDispatcher.js#################
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
	
	dispatchEvent: function(event)
	{	
		if (!this.hasEventListener(event.type))
		return;

		var listeners = this._listeners[event.type];

		for (var i=0; i< listeners.length; i++)
		{
			if (listeners[i] != null)
			{
				var list = listeners[i];

				event.currentTarget = this;

				event.data = event.data || list.data;
				event.bind =  list.bind;
				
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
	on: function(type, listener, data, bind)
	{
		if (arguments.length <4 ) var bind = null;
		if (arguments.length <3 ) var data = null;

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

	/* 	params: (type:String, listener:Function, useCapture:Boolean = false 
		return void
	*/
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
###########  D:\github\panjs\panjs\core\managers\Trouter.js#################
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
	      logger.error("Event window.hashchanging not supported!")
	    }
  	},
  	refreshkeys: function()
  	{
		var hash = window.location.hash.droite('#');
		this.keys = this.decode(hash);
  	},
  	registerComponent: function(c, onhashchange)
  	{
  		this.refreshkeys();
  		this.listeners[c.hashKey] = {owner: c, onhashchange: onhashchange.bind(c)};
  	},

  	getHash: function(owner)
  	{
  		this.refreshkeys();

  		//alert(JSON.stringify(this.keys));
  		return this.keys[owner.hashKey];
  	},
	setHash: function(owner, value)
  	{
  		
  		if (this.keys[owner.hashKey] != value)
  		{
  			var oldValue = this.keys[owner.hashKey];

  			this.keys[owner.hashKey] = value;
  			var encoded = this.encode(this.keys);
  			sendEvents = false;
			window.location.hash = encoded;
			/*Le fait d'avoir déjà modifié this.keys fait que onhashchange ne détectera pas qeul objet a modifié son hash (pas de différence)
			et n'enverra pas d'evenement donc on envoie l'évènement ici.
			De plus, c'est plus optimisé.
			*/
			var r = this._dispatchOnhashchange(owner.hashKey, value);
			logger.debug("RETOUR Onhashchange="+r);
			sendEvents = true;	
		}
		else
		{
			logger.debug("setHash "+value+" => inchangé");
			//this._dispatchOnhashchange(owner.hashKey, value);
		}

  	},
  	_dispatchOnhashchange: function( hashKey, hash)
  	{
  		var l = this.listeners[hashKey];
  		return l.onhashchange(hash);
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
	    				if (v.trim() != "")
	    				r[k] = v;
	    			}
	    		}
			}catch(err)
			{
				logger.error("Echec decodage de "+str+" en objet: "+err);
			}
		}
		else
		{
			logger.error("Echec decodage  de "+str+" en objet: chaine vide");
		}
		return r;
  	},

  	encode: function(obj)
  	{
  		var r = "";

  		try{
  				
	    		//r = JSON.stringify(object);
	    		for (k in obj)
	    		{
	    			if (obj[k].trim() != "")
	    			r = r+k+"="+obj[k]+"&";
	    		}
	    		
	    		if (this.base64encode)	
	    		r = base64encode(r);  

		}catch(err)
		{
			logger.error("Echec encodage de "+obj+" en string: "+err);
		}
		return r;
  	},

  	onhashchange: function(e)
  	{
  		//*Le hash n'est pas codé (il provient de liens):

  		if (!this.sendEvents)
  			return false;
 
	    this.hash = window.location.hash.droite('#');
	    this.keysTmp = this.decode(this.hash);

	    for (k in this.keysTmp)
	    {

	    	logger.debug("keys["+k+"] = "+this.keys[k]+" this.keysTmp[k] = "+this.keysTmp[k]);
	    	if (this.keysTmp[k] != this.keys[k])
	    	{
	    		this.keys[k] = this.keysTmp[k];
	    		if (typeof this.listeners[k] != "undefined"){
	    			logger.debug("Le composant "+k+" va être notifié que son hash a changé: hash="+this.keys[k]);
	    			this._dispatchOnhashchange(k, this.keys[k]);   

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
###########  D:\github\panjs\panjs\core\display\TproxyDisplayObject.js#################
##############################################*/


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





/*##############################################
###########  D:\github\panjs\panjs\core\collections\TarrayCollection.js#################
##############################################*/


/*** 
Tobject 
***/

defineClass("TarrayCollection", "core.events.TeventDispatcher", {
	_source:null,
	length:0,
 
 // _length:0,

	constructor: function(args) { 
		TarrayCollection._super.constructor.call(this,args);

    if (args)
      this._source = args;
    else
      this._source = [];
    
   /* ça fonction */
   
     /* Object.defineProperty(this, "length", {
            set : function(newValue){ 
                logger.debug("changedgg "+this._length+" => "+newValue);
                this._length = newValue; 
            },
            get : function(){ 
                return this._length; 
            }
    });
*/
    this.length = this._source.length;

  	},
	
	/*
  		PUBLIC
  	*/
  sort:function( sortFunction)
  {
      if (defined(sortFunction))
      {
        this._source.sort(sortFunction);
      }
  },

	  getSource: function()
  	{
  		return this._source;
  	},
  	setSource: function(value)
  	{
  		if (this._source != value)
  		{
  			this._source = value;
  			this.refresh();
  		}
  	},
	  
    getByProp: function(propname, propvalue, multiple)
    {
      var r = null;
      var returnArray = false;

      if (arguments.length > 2)
         if (multiple === true){
            r = []
            returnArray = true;
         }
     
      for (var i=0; i<this._source.length; i++)
      {
        var item = this._source[i];
        
        if (typeof item[propname] != "undefined")
        {  
          if (item[propname] == propvalue)
          {
            if (returnArray == true)
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
      return r;
    },
    replaceItem:function(item, newItem)
    {
        var indx = this.getItemIndex(item);
        if (indx > -1)
        {
          this._source[indx] = newItem;
          this.length = this._source.length; 
          this.dispatchEvent( new Tevent(Tevent.REPLACE, {item:item, newItem: newItem}));
        }
    },

    updateItem: function(item)
    {
        this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
    },

  	getItemIndex: function(item)
  	{
  		for (var i=0; i<this._source.length; i++)
      {
  			if (this._source[i] == item)
        {
  				return i;
        }
      }

  		return -1;
  	},

  	getItemAt: function(indx)
  	{
  		return this._source[indx];
  	},

  	addItem: function(item)
  	{ 
  		var indx = this.getItemIndex(item);

  		if (indx == -1)
  		{
  			this._source.push(item);
        this.length = this._source.length;    
        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:this.length-1}));
  		}
  	},
    addItems: function(items)
    { 
      for (var i=0; i<items.length; i++)
      this._source.push(items[i]); 

      this.length = this._source.length;   

      this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
      
    },
    addItemAt: function(item, indx)
    {
        this._source.splice(indx, 0, item);
        this.length = this._source.length;    
        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:indx}));
    },

  	
  	removeItem: function(item)
  	{
  		var indx = this.getItemIndex(item);
  		if (indx >= 0)
  			this._removeItemAt(indx, item);
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
  		this.refresh();
  	},
    refresh:function()
    {
        this.length = this._source.length;
        this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
    },
    
  	/*
  		PRIVATE
  	*/
  	_removeItemAt: function(indx, item)
  	{
  		this._source.splice(indx, 1);
      this.length = this._source.length;
  		this.dispatchEvent( new Tevent(Tevent.DELETE, item));
  	}
});



/*##############################################
###########  D:\github\panjs\panjs\core\display\TdisplayObject.js#################
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

	/* METHODES */
	load:function(){
		/* Si on ne sait pas si l'objet est un proxy ou pas, on appelle load 
		ça ne génèrera pas d'erreur, bien que le composant soit déjà chargé
		*/
		return this;
	},
	_onInitialized: function()
	{
	},
	
	constructor: function(args) { 
		TdisplayObject._super.constructor.call(this,args);

		if (this.baseElement == null)
			throw "La propriété \"baseElement\" n'est pas défini sur "+this.className;

		/* Création du conteneur */

		this.container = $('<'+this.baseElement+"/>");
		//this.container.css("display", "none");	

		window[this.className].lastId ++;
		if (!defined(args, "id")) 
			this._setId( this.className+window[this.className].lastId );
		else
			this._setId(args.id);

		if (args)
		this.injectParam("visible", args.visible,false, this.visible);

		this.container[0].owner = this;
		
  		//logger.debug("init TdisplayObject: ",this.className,", id=",this.id);
  	},

  	appendTo: function(elem){
  		
		if (this._parent != null)
		{	
			/* L'objet a déjà un parent*/

			if (this._parent[0] != elem[0])		 
			{
				/* Le parent change */

				this._parent[0].removeChild(this.container[0]);				
				elem[0].appendChild(this.container[0]);			
				this._parent = $(elem[0]);					
			}
			else
			{
				/* Le parent reste le même */
			}
		}		
		else
		{
			/* Le parent change */
					
			elem[0].appendChild(this.container[0]);
			this._parent = $(elem[0]);
		}
		
		
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
###########  D:\github\panjs\panjs\core\display\TdisplayObjectContainer.js#################
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

uses("core.display.TproxyDisplayObject");

defineClass("TdisplayObjectContainer", "core.display.TdisplayObject",
{ 	
	/* PROPRIETES */
	_statesElements: null,
	currentState: null,
	defaultState: null,
	/* METHODES */	
	constructor: function(args) { 	
	
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

			var included = false;

			for (var i=0; i<arguments.length; i++)
			{
				var stateName = arguments[i];

				if (this.stateExists(stateName))
				{		
					//logger.debug(el.id+", i="+i+", setState stateName = "+stateName);
					if (included == false)
			 		if (el.includeIn != null)
						included = (el.includeIn.indexOf(stateName) >= 0);
					else
						included = true;

					if (included == true)
			 		if (el.excludeFrom != null)
			 		{
			 			if (el.excludeFrom.indexOf(stateName) >= 0)
			 			{
							included = false;
							break;
						}
			 		}	
			 		if (flag == false)
			 			 this.currentState.push(stateName);
				}
				else
				{
					logger.warn(el.id+", state "+stateName+" n'existe pas!");
				}
			}
			flag = true;
			var show = (included);
			//logger.debug("setState: elem.id="+el.id+", show = "+show);
			this._setStateElementVisible( show, el);
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
							if ((setObject)&&(id != null))
							{
								if (defined(this[id]))
									logger.error('1-Duplication du id "'+id+'" sur objet '+this.className);
							
								//logger.debug('Affectation '+id+' sur objet '+this.className);
								this[id] = $(el);
								r.push(id);	
							}

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
					if (panjs.iever == -1 )
						text = el.textContent;
					else
						if (panjs.iever <=8)
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


/*##############################################
###########  D:\github\panjs\panjs\core\display\Telement.js#################
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


		if (defined(args, "elem"))
		{
			/* On injecte les attributs de l'élément dans args */
			var el = args.elem;
			
			for ( var i =0; i< el.attributes.length; i++)
        	{
            	var attr =  el.attributes.item(i);
            	var name = attr.nodeName.toLowerCase();

            	if ((name != "id")&&(name != "data-compo"))
            	{
            		if (name.startsWith("data-"))
            			name = name.droite("-");
            		var value = attr.value;

            		if (value == "true")
            			value = true;
            		if (value == "false")
            			value = false;

            		args[name] = value;
            			
            		//ATTENTION: attr.nodeName est toujours en lowerCase
            		//logger.info("Attribut "+this.id+" , "+name+"="+attr.value);
            	}
            	if (name == "includeinstate"){
            		this.includeInState = value; 
            		//Ajout de l'attribut includeinstate pour qu'il soit parsé dans processStates
            		this.container.attr("includeInState", this.includeInState);
            	}
        	}
	
			/* On injecte le contenu de l'élément source dans l'élément <CONTENT> */	
			this.sourceElement = args.elem;	

			if (this.content != null)
			{
				if (this.sourceElement.innerHTML.trim() != ""){
				
					this.content[0].innerHTML = this.sourceElement.innerHTML;
					if (typeof args.parent != "undefined"){

						args.parent._populateElements(this.content[0], true,[]);
					}
				}
			}

			/* On vide l'élément source */
			//this.sourceElement.innerHTML = "";
			

		}
  		
		if (args)
		{
			if (args.style)
				this.sourceElementStyle = args.style;
			if (args.elem){
				var tmpStyle = args.elem.getAttribute("data-inline-style");
				if (tmpStyle != null)
					this.sourceElementStyle =  tmpStyle;	
			}
			

		}

  	},

  	_onHashChange: function(hash)
  	{
		var r = false;
		
  		if (this.enableHashManager) 
  		if (typeof this.onHashChange === "function"){
  			logger.debug("Telement._onHashChange => "+hash);
  			r = this.onHashChange(hash);
  		}
  		return r;
  	},
	free: function(){
	},

  	_onShow: function(){
  	 	this._onHashChange( panjs.router.getHash(this));
  	},
  	setHash:function(hash)
  	{
  		if (this.enableHashManager) 
  		 panjs.router.setHash(this, hash);
  	},
	getHash:function()
  	{
  		if (this.enableHashManager) 
  		 	return panjs.router.getHash(this);
  		else
  			return null;
  	}
});






/*##############################################
###########  D:\github\panjs\panjs\core\http\TrestClient.js#################
##############################################*/

/*** 
TrestClient 
***/

defineClass("TrestClient", "core.events.TeventDispatcher",
{  	
	dataType: "json",
	/*
	En jsonP, si le serveur renvoie 404 ou 500, on n'a pas le détail:
	exemple: login => 500 => "Mauvais mot de passe" => pas récupéré
	Si le serveur veut renvoyer une erreur, il peut renvoyer un status 200, mais en précisant les champs "status" et "responseTextFieldName".
	*/
	exitCodeFieldName: null, 
	errorTextFieldName: null, 
	lastTokenId: 0,
	extraUrlParams: null,
	
	constructor: function(args){	
		TrestClient._super.constructor.call(this,args);
		this.injectParam("dataType",args.dataType, false);
		this.injectParam("exitCodeFieldName",args.exitCodeFieldName, false);
		this.injectParam("errorTextFieldName",args.errorTextFieldName, false);
		this.injectParam("baseUrl",args.baseUrl);
		this.injectParam("extraUrlParams",args.extraUrlParams);

	
	},

	getNewTokenId: function()
	{
		TrestClient.lastTokenId ++;
		return TrestClient.lastTokenId;
	},
	_getSuccessEvent: function(data, req, token)
	{
		var r = new Tevent(Tevent.SUCCESS, data);
		return r;
	},
	_getErrorEvent: function(req, method, exception,url, token)
	{
		var evtData = {"method":method, responseText:"", statusText:"Erreur inconnue", status:0, url:"url=?"};

		
		/* 
			statusText 
		*/
		if (defined(req, "statusText"))
			evtData.statusText = req.statusText;
		else
			evtData.statusText = "";

		if (defined(exception))
			evtData.statusText = exception;

		if (defined(url))
			evtData.url = url;

		/* 
			ResponseText 
		*/
		if (defined(req , "responseText"))
		evtData.responseText = req.responseText;	
		if (evtData.responseText == "")
		evtData.responseText = evtData.statusText;


		/* 
			status 
		*/
		if (defined(req , "status"))
		evtData.status = req.status;
		
		if (evtData.status == 0)
		evtData.status = 1;

		evtData.token = token;

		try{
			evtData.data = JSON.parse(evtData.responseText);
		}catch(err)
		{
			evtData.data = evtData.responseText;
		}
		
		return new Tevent(Tevent.ERROR, evtData);
	},

	post: function(url, params, data, success, failure, token)
	{
		
		this._call("POST", url, params, data, success||null, failure||null,token);
	},
	get: function(url, params, data, success, failure, token)
	{
		this._call("GET", url, params, data, success||null, failure||null,token);
	},
	put: function(url, params, data, success, failure, token)
	{
		this._call("PUT", url, params, data, success||null, failure||null,token);
	},
	del: function(url, params, data, success, failure, token)
	{
		this._call("DELETE", url, params, data, success||null, failure||null,token);
	},
	_call: function(method, url, params, data, success, failure, token)
	{
		/*
			Construction des paramètres de l'url
		*/
		token.id = this.getNewTokenId();
		
		var urlParams = "";
		if (defined(params))
		{
			if (typeof params == "object")
			{
				urlParams = "?";
				for (p in params)
					urlParams = urlParams + p +"="+params[p]+"&";
			
				if (urlParams == "?")
					urlParams = "";
			}
			else
			{
				urlParams = "?"+params;
			}
		}
		if (this.extraUrlParams)
			urlParams += "&"+this.extraUrlParams;

		var path = this.baseUrl+url+urlParams;

		logger.debug("Appel ",method,": ",path,", dataType="+this.dataType);


		var req = $.ajax({ 
				url: path,
				async:true,
				data:data,
				context:this,
				type: method,
				xhrFields: {
   				   withCredentials: true
   				},

				dataType: this.dataType,	//json: fonctionne pas en crossdomain sur IE8
									//nécessité d'utiliser XdomainRequest (CORS pour IE8)
				success: function(data, textStatus, req) {
					logger.debug("Requête AJAX terminée avec succès: ",url);
					
					if (this.exitCodeFieldName != null)
					{
						var status = data[this.exitCodeFieldName];

						if (defined(status))
						{
							if ( status != 200)
							{



								//C'est une erreur:
								var e = this._getErrorEvent(req, method,  data[this.errorTextFieldName],path, token);
								this.dispatchEvent(e);

								if (defined(failure))
									failure(e, token)
								return;
							}
						}

					}


					var e = this._getSuccessEvent(data,req, token);
					this.dispatchEvent(e);

					if (defined(success))
						success(e, token);
				},
				error: function(req, settings, exception) { 

					var e = this._getErrorEvent(req, method, exception,path, token);

					this.dispatchEvent(e);

					if (defined(failure))
						failure(e, token)
				}
			});

			return req;	
	}
});

