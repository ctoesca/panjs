
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
       logger.error("Error while instantiating "+className+": "+err);
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
      return {result:false, message:"Too much nested components (max: "+this.maxImbrications+")", className: className, classPath:classPath, url: url, path:"?"};
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
          window[className].prototype.dirPath = dirPath;  
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
      if (this.loadedJs[path.toLowerCase()])
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

    var type =  node.getAttribute("type") || 'text/css';
    var rel = node.getAttribute("rel") || 'stylesheet';
      
    this.loadCssFile(url, type, rel);

  },  
  loadCssFile: function(url, type , rel){
    var r = false;

    if (this.loadedCss[url.toLowerCase()])
      return r;
    
    var l = arguments.length;
    if (l == 0)
      throw "loadCssFile(url, type , rel): Missing url";

    
    else if (l == 2)
      var rel = "stylesheet/less";

    url = this.getUrlWithVersion(url);

    if ((document.createStyleSheet)&&(panjs.iever == 8))
    {   
      document.createStyleSheet(url);
      r = true;
    }
    else
    {   
     
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
            r = true;
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
        r = true;                                
      }
    }   
    if (r == true)
    logger.debug("Load <link> ASYNC: "+url);

    this.loadedCss[url.toLowerCase()] = true;

    return r;
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

      if (!this.loadedJs[url.toLowerCase()])
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