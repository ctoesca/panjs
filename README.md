#panJS v0.7.1 
> A 35 ko javascript framework 

panJs is a javascript framework that uses Jquery and allows you to create application easily, by making resusable components.
<br/>You can integrate panJS in a existing application (only parts of the application can be managed by panJs).
</p>
<p><a href="http://www.nexilearn.fr/libs/panjs/0.6.1/examples/"><b>Demo</b></p>
## Feature Highlights

* A component is a HTML file that contains CSS, JS, HTML, css <link> like any Html file
* Components can be integrated in a page or in other components with html markup
* Components (and their dependencies) are loaded dynamically and you don't have to add js/css in the `<head>` of the page.
* Cache management (Js/css/html)
* Inheritance on classes and components (HTML / CSS / JS)
* Encapsulation</li>
* Lazy loading of components and classes
* You can use LESS in components. panJs converts LESS to CSS.
* Includes Ajax facilities (Class TrestClient.js)
* Easy to make a one page application (but not mandatory)
* States, hash routing (work in progress)
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

    <script type="text/x-class-definition">
    //<![CDATA[      
    defineClass("TmyComponent", "core.display.Telement", { 
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
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

<script>
//<![CDATA[  

      var panjs = {
        logLevel: "DEBUG",
        env: "dev", // dev or prod
        appVersion: "0.1", 
        version: "0.6", //panjs version
        
        namespaces:[
        {name: "core", path: "../core"},    //panjs "core" directory
        {name: "ui", path: "../ui"},        //panjs "ui" directory (optionnal)
        {name: "app", path: "components"}   //path on your app components (example)
        ]
      };
     
      $(document).ready(function() 
      {
        logger.debug("READY");
        panjs.load($(document.body));           
      });

//]]>
</script>

<script src="../core/panjs_core.min.js"></script>
<!-- Use panjs_core_with_less.min.js if you want to enable LESS-->
```


