#panJS v0.8.3
> A 40 ko javascript framework 

panJs is a javascript framework that uses Jquery and allows you to create applications easily, by making resusable components.
<br/>You can integrate panJS in a existing application (only parts of the application can be managed by panJs).
</p>
<p><a href="http://www.nexilearn.fr/libs/panjs/trunk/doc/examples/demo"><b>Basic demo</b></p>
<p><a href="http://www.nexilearn.fr/libs/panjs/trunk/doc/examples/todoMvc"><b>TodoMVC example</b></p>
<p><a href="http://www.nexilearn.fr/libs/panjs/trunk/doc/examples/todoMvc/index2.html"><b>TodoMVC X2 example</b></p>
<p><a href="http://www.nexilearn.fr/libs/panjs/trunk/doc/examples/circles"><b>Circles example</b></p>
<p><a href="http://www.nexilearn.fr/libs/panjs/trunk/doc/tutorial"><b>Tutorial</b></p>
## Feature Highlights

* A component is a HTML file that contains CSS, JS, HTML, css <link> like any Html file
* Components can be integrated in a page or in other components with html markup
* Components (and their dependencies) are loaded dynamically and you don't have to add js/css in the `<head>` of the page.
* Cache management (Js/css/html): the framework add '?v=x.x.x' in all loaded files.
* Inheritance on classes and components (HTML / CSS / JS)
* Encapsulation
* Lazy loading of components and classes
* You can use LESS in components. panJs converts LESS to CSS.
* Includes Ajax facilities (Class TrestClient.js)
* Easy to make a one page application (but not mandatory)
* States, hash routing
* Errors management: in production, a component with a runtime error/syntax error/XML error will be replaced by a special error component showing the error: the application is not interrupted (showing a white page etc).
* ...


###What panJs does not:

* panJs doesn't choose the architecture of your application (MVC, MVVC etc)</li>
* Data binding (but you can use some data binding frameworks if you want like KnockoutJS, Mustach ...)</li>
* panJs isn't a UI library (but there is already some UI components available)</li>


### What is a panJS component?

You put a component in HTML page (or in another HTML component) like this:

```
<div data-compo="app.myComponent.html"/>
```

<p>myComponent.html:</p>
```
<html> 
  <head>
    <style type="text/css">
    .TmyComponent .result
     {
        font-weight: bold;           
        color: #428bca
     }   
    </style>

    <script subtype="text/x-class-definition">
    //<![CDATA[      
    defineClass("TmyComponent", "panjs.core.display.Telement", { 
       baseElement: "div",	
       clickCount:0,
       constructor: function(args){
    	    this._super.constructor.call(this,args);  
    	    this.btnSubmit.on("click", this.onSubmit.bind(this));
       },
       onSubmit: function(){
          this.clickCount ++;
          this.result.html("You have clicked "+this.clickCount+" times");
       }
    });
    //]]>
    </script>
  </head>
  
  <body>
     <button type="submit" id="btnSubmit" class="btn btn-danger">Click here</button>
     <span id="result" class="result"></span>
  </body>
</html>
```

##Getting started

```
<html>
  <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
 
    <script>
    //<![CDATA[  
          //panjs settings:
          var panjs = {
            logLevel: "DEBUG",
            env: "dev", // dev or prod
            appName: "myapp"
            appVersion: "0.1", 
            version: "0.8.1", //panjs version
            
            namespaces:{
              "core": {path: "../core"},    //panjs "core" directory
              "ui":   {path: "../ui"},        //panjs "ui" directory (optionnal)
              "helpers":   {path: "../helpers"},
              "app":  {path: "components"}   //path on your app components (example)
            }
          };
         
          $(document).ready(function() 
          {
            logger.debug("READY");
            panjs.load($(document.body));           
          });
    //]]>
    </script>
    
    <script src="../core/panjs_core.dev.min.js"></script>
    <!-- If you want to enable LESS-->
    <!-- <script src="../core/panjs_core_with_less.dev.min.js"></script>-->

    <!-- Production (error management enabled) -->
    <!-- <script src="../core/panjs_core.prod.min.js"></script>-->
    <!-- <script src="../core/panjs_core_with_less.prod.min.js"></script>-->

  </head>
  <body>
      <!-- panjs component: path : './components/myComponent.html' -->
      <div data-compo="app.myComponent.html"/>

  </body>
</html>
```


