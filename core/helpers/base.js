﻿function array_replace_recursive(arr) {
  var retObj = {},
    i = 0,
    p = '',
    argl = arguments.length;

  if (argl < 2) {
    throw new Error('There should be at least 2 arguments passed to array_replace_recursive()');
  }

  // Although docs state that the arguments are passed in by reference, it seems they are not altered, but rather the copy that is returned (just guessing), so we make a copy here, instead of acting on arr itself
  for (p in arr) {
    retObj[p] = arr[p];
  }

  for (i = 1; i < argl; i++) {
    for (p in arguments[i]) {
      if (retObj[p] && typeof retObj[p] === 'object') {
        retObj[p] = this.array_replace_recursive(retObj[p], arguments[i][p]);
      } else {
        retObj[p] = arguments[i][p];
      }
    }
  }
  return retObj;
 }
function deepmerge(target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function(e, i) {
            if (typeof dst[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = deepmerge(target[i], e);
            } else {
                if (target.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    } else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            })
        }
        Object.keys(src).forEach(function (key) {
            if (typeof src[key] !== 'object' || !src[key]) {
                dst[key] = src[key];
            }
            else {
                if (!target[key]) {
                    dst[key] = src[key];
                } else {
                    dst[key] = deepmerge(target[key], src[key]);
                }
            }
        });
    }

    return dst;
}


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

function changeFavicon(src) {
  document.head = document.head || document.getElementsByTagName('head')[0];

  var link = document.createElement('link'),
      oldLink = document.getElementById('dynamic-favicon');
  link.id = 'dynamic-favicon';
  link.rel = 'shortcut icon';
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}



var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
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


function getXmlDocument (text) {

      var message = "";

      //On IE, if XML is malformed, ActiveXObject returns more infos than DOMParser
      if (window.DOMParser)
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
        if (!window["MsxmlObject"] )
          window["MsxmlObject"] = new ActiveXObject("MSXML.DOMDocument"); 

        xmlDoc = window["MsxmlObject"];
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

function _extractBrowserVersion( reg ){
  var r = -1;
    var reg = new RegExp(reg);
    if (reg.exec(navigator.userAgent) != null)            
      r = parseFloat(RegExp.$1); 

   return r;
}

function getIEVersion()
{
    return _extractBrowserVersion("MSIE ([0-9]{1,}[\.0-9]{0,})");
}
function getFirefoxVersion()
{
    return _extractBrowserVersion("Firefox/([0-9]*)\.");
}
function getChromeVersion()
{
  return _extractBrowserVersion("Chrome/([0-9]*)\.");
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

String.prototype.rightRightOf = function(souschaine)
{ 
  var index = this.lastIndexOf(souschaine);
  if (index > -1)
    return this.substr(index+souschaine.length);  
  else 
    return "";
}

String.prototype.isEmpty = function(){
   var s = this.trim();
   return (s == "");
};

String.prototype.startsWith = function(s){
  if ((arguments.length == 2) && (caseInsensistive === true))
    return this.toLowerCase().indexOf(s) == 0;
  else
    return this.indexOf(s) == 0;
};

String.prototype.endsWith = function(s, caseInsensistive){

  if ((arguments.length == 2) && (caseInsensistive === true))
    var indx = this.toLowerCase().lastIndexOf(s.toLowerCase());
  else
    var indx = this.lastIndexOf(s);   
  
   return ((indx>=0) && (indx == (this.length - s.length)));
};

String.prototype.stripAccents = function() {
  
    var translate_re = /[àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ]/g;
    var translate = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    return (this.replace(translate_re, function(match){
        return translate.substr(translate_re.source.indexOf(match)-1, 1); })
    );
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

String.prototype.removeEnd = function(s, caseInsensistive){
    if (arguments.length == 1)
      var caseInsensistive = false;

    if (this.endsWith(s, caseInsensistive))
      return this.substring(0, this.length - s.length);
    else
      return this.toString();  
  
};

String.prototype.occurences = function(souschaine)
{
  var r = [];
  var tmp = this;
  var index = tmp.indexOf(souschaine,0);
  var offset = 0;

  while ( index != -1 )
  {   
      r.push(offset + index);
      tmp = tmp.substring(index+souschaine.length, tmp.length);
      offset += index + 1;
      index = tmp.indexOf(souschaine,0);
  }

  return r;
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

Array.prototype.pushArray = function (arr)
{  /* Ajout des éléments d'un tableau à un tableau */
	 for (var i=0; i<arr.length; i++)
	    this.push(arr[i]);
}

function callLater(func, wait) 
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
