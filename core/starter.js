
 (function () {

  panjs.logger = null;
  panjs.root = {id:"root"};
  panjs.loader = null;
  panjs.iever = getIEVersion();

     
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
        element = $(document.body);
      
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

            if (!(constr instanceof Function)) {
              throw new Error("You must define a method 'constructor'");
            }
            // Set up the constructor
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
    			 throw "Le paramètre "+name+" n'a pas de valeur pas défaut sur object "+this.className;
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
      logger.error("Impossible d'hériter de "+inheritsFromClassPath+": CLASSE NON CHARGEE");

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
	_severity: null,
	name: "MAIN",
  	creationDate: null,
  	active: true,
  	_currentGroup: 0,
  	_tabulation: "",
	tab: [],

	constructor: function(args) {

		  this.injectParam("_severity", args.severity,false, Tlogger.INFO);
		  this.injectParam("name", args.name,false);
    	this.creationDate = new Date().getTime();

           
		  this.setSeverity(this._severity);
    
      this.active = (typeof console != "undefined");
    	this.razTime();

  		this.info("Init logger SEVERITY=",this.getSeverityName());
  	},
    razTime: function()
    {
        this.creationDate = new Date();
    },
  	getSeverityName:function()
  	{
  		if (this._severity == Tlogger.DEBUG)
  			return "DEBUG";
  		if (this._severity == Tlogger.INFO)
  			return "INFO";
      if (this._severity == Tlogger.WARN)
        return "WARN";
  		if (this._severity == Tlogger.ERROR)
  			return "ERROR";
  	},
 	groupStart: function()
 	{  
 		if (this.active)
 		{
 			this._currentGroup ++;
 			this._calcTabultation();
 			//console.group();	
 		}
 	},
 	groupEnd: function()
 	{
		if (this.active)
 		{
 			this._currentGroup --;
 			this._calcTabultation();
 			//console.groupEnd();	
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
      //bizarrement, console.debuf n'existe pas sur IE9  mais si on log en console.info, ça sort en debug dans la console
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

  	setSeverity: function(value)
  	{
  		this._severity = value;

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

//loader a besoin de logger.
panjs.logger = new Tlogger({severity: Tlogger[panjs.logLevel], name:"main"});
logger = panjs.logger;



/*** 
Tloader: classe qui permet de charger d'autres classes ou composants
en synchrone. 
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

        /* renvoie:
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
      url = url+"?version="+panjs.appVersion;
    else
      url = url+"&version="+panjs.appVersion;

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
      //alert("OK "+path);
    },
  onLoadFileError: function(jqXHR, settings, exception, path)
    {
      logger.error("Echec chargement "+path+": "+exception);
    //alert(exception+": "+path);
    },

    usesComponent: function(classPath)
  {
    var h = " ************ ";
    /*
    Chargement du fichier HTML comportant de l'HTML et du javascript
    */
//logger.debug("usesComponent "+classPath);
    var className = panjs.getClassNameFromClassPath(classPath);
  
    var url = null;
    var path = null;

    if (this._count > this.maxImbrications)
    {
      return {result:false, message:"Trop de composants imbriqués (max: "+this.maxImbrications+")", className: className, classPath:classPath, url: url, path:path};
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
            var m = "Le fichier est mal formé:\n"+err;
            logger.error(m);
           
            return {result:false, message:m, className: className, classPath:classPath, url: url, path:path};
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

            try{

              if ( nodeName == "script")
              {   
                this.addScriptNode(node, dirPath, className); 
                //if (logger)
                 // logger.debug("typeof panjs["+className+"] = " + typeof panjs[className]);

              }
              else
              {
                if (nodeName == "link")   
                  linkNodes.push(node)
              else
                if (nodeName == "style")
                  styleNodes.push(node);  
              }
            }catch(err)
            {
              var mess =  "Erreur chargement node <"+nodeName+"> => "+err;
              logger.error(path,mess+"\n"+err.stack);
              return {result:false, message: mess, className: className, classPath:classPath, url: url, path:path, stack:err.stack}; 
            }
          }

          if (typeof window[className] == "undefined")
          {
            var mess = "La class "+classPath+ " ne s'est pas chargée. ";
            if (panjs.lastDefinedClassName != className)
             mess += "\nLe nom de la classe ("+panjs.lastDefinedClassName+") doit correspondre avec le nom du fichier "+path+" (respectez la casse)";

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
               
                

                 // html = html.replace("</content>","");
                  html = html.replace(/<body>/gi, "");
                  html = html.replace(/<\/body>/gi, "");
                  html = "<div>"+html+"</div>";

                }
                else
                {
                  html = html.replace(/<body>/gi, "<div>");
                  html = html.replace(/<\/body>/gi, "</div>");
                }
                html = html.replace(/\\r/gi, "").replace(/\\n/gi, "").trim();
               
                if (panjs.iever == 8)
                {
                  var div = $(html); //renvoie un html avec des balises vides correct (</div/> => <div></div>).
                  window[className].prototype.html = div[0].innerHTML;
                }else{
                  window[className].prototype.html = html;
                }

                window[className].prototype.bodyNode = bodyNode;
            }
            catch(e)
            {
              return {result:false, message:e.message, className: className, classPath:classPath, url: url, path:path};
            }
          }
          else
          {
            /*
            html et bodyNode sont hérités
            */
          }
          
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
        var mess = "Echec chargement "+classPath+": "+ r.status;
        logger.warn(mess);
        this._count --;
        logger.groupEnd();
        return {result:false, message:mess, className: className, classPath:classPath, url: url, path:path};
      }
      
    }
    return  {result:true, message:"Déjà chargé", className: className, classPath:classPath, url: url, path:path}; 
    
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
      {
        logger.debug("Déjà chargé: "+path);
        return;
      }

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
    }
    
    },

  addLinkNode: function(node,dirPath)
  {     
    var url = panjs.transformUrl(node.getAttribute("href"),dirPath);
    if (this.loadedCss[url.toLowerCase()] == true)
    {
      logger.debug("Déjà chargé: "+url);
      return;
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
          logger.warn("less.js n'es pas compatible avec IE"+panjs.iever+": transformer le code less en css");
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
            logger.warn("LESS non chargé. Utilisez panjs_core_with_less.min.js ou bien chargez LESS avant panJs");
          }
        }
      }
      else
      {
        document.getElementsByTagName('head')[0].appendChild(link);                                 
      }
    }   
    logger.debug("Load link ASYNC: "+url);
    this.loadedCss[url.toLowerCase()] = true;
  },  
  addStyle: function(css, type){

    if (typeof type =="undefined")
      var type = "text/css";

    $('<style type="'+type+'">' + css +'</style>').appendTo('head');
    
      if (type == "text/less")
      {   
        if ((panjs.iever >0)&&(panjs.iever<=8))
        {
          logger.warn("less.js n'es pas compatible avec IE"+panjs.iever+": transformer le code less en css");
        }else
        {
            if (this.lessIsLoaded())
            {
              less.refresh();
              logger.debug("INJECTION LESS OK");    
            }
            else
            {
              logger.warn("LESS non chargé. Utilisez panjs_core_with_less.min.js ou bien chargez LESS avant panJs");
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
    
    var r = code;
    if (code.indexOf("this._super") == 1 )
      r = r.replace("this._super", className+"._super")
    else
      r = r.replace(/this._super/g, className+"._super");   


    return r;
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
          logger.warn("type=\"text/x-class-definition\" n'a pas été mis sur sur élément <script> de "+className);
      }
      
      exec(script);

    }
    else
    {      
      var url = panjs.transformUrl(node.getAttribute("src"),dirPath);
      
      if (this.loadedJs[this.getUrlWithVersion(url).toLowerCase()] == true)
      {
        logger.debug("Déjà chargé: "+url);
      }
      else
      {         
        var r = this.loadFile(this.getUrlWithVersion(url));
        if ((className != null) && (node.getAttribute("type") == "text/x-class-definition"))
          r.data = this.processCode(r.data, className)

        exec(r.data);
      }
    }  
  }   

});

panjs.loader = new Tloader();

$(document).ready(function() 
{

});