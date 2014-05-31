
function exec(s)
{           
  if (s == "") return;  

  if (typeof window.execScript != "undefined")
      window.execScript(s);  //Porté globale (eval sur IE n'a pas de porté globale)
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
    var result;     

    try{     

      if (xmlNode.xml)
        result = xmlNode.xml;
      else
      result = (new XMLSerializer()).serializeToString(xmlNode);
  }
  catch(e)
  {
    alert("Erreur getXml: "+e);
  }   
  
    return result;
}
function getText(xmlNode)
{         
  try{
  var r;
    
  if (typeof xmlNode.text != "undefined")                                    
      r = xmlNode.text;   
  else
      r = xmlNode.textContent;
    
  return r;

  }catch(err)
  {
    return err;
  }    
}

function getXmlDocument(txt)
{
  /* transforme du texte  XML en object XMLDocument */
  if (window.DOMParser)
    {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(txt,"text/xml");
    }
  else 
    {
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(txt);
    } 
    return xmlDoc;
}


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
  try{
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }catch(e)
  {   
  }
  return "ERREUR htmlEntities";
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
 var r = "";
 if (index >0)
    r = this.substr(index+souschaine.length);   
 return r;
}


String.prototype.isEmpty = function(){
   var s = this.trim();
   return ((s == "")||(this == null));
};
String.prototype.startsWith = function(s){
   return this.indexOf(s) == 0;
};
String.prototype.endsWith = function(s){
   return this.lastIndexOf(s) == (this.length - s.length);
};
String.prototype.removeEnd = function(s){
  if (this.endsWith(s))
  {
    return this.substring(0, this.length - s.length);
  }
  else
  {
    return this;
  }
   
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


//Bind() n'existe pas sur IE8

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

function getInternetExplorerVersion() 
{    
  var rv = -1; // Return value assumes failure.   
  if (navigator.appName == 'Microsoft Internet Explorer') 
  {       
   var ua = navigator.userAgent;        
   var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");       
   if (re.exec(ua) != null)            
   rv = parseFloat(RegExp.$1);    
   }    
  return rv;
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