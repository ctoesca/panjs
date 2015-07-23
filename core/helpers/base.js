
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

String.prototype.leftOf = function(souschaine)
{
 var index = this.indexOf(souschaine,0);
 if (index >=0)
 return this.substring(0, index)
 else
 return '';
}
String.prototype.gauche = String.prototype.leftOf;

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
  /* supprime un object d'un tableau indexé. La case est retirée. */
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
{  /* Ajout des éléments d'un tableau à un tableau */
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
