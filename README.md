#panJS v0.7.0 
> A 37 ko javascript framework 

panJs is a javascript framework that uses Jquery and allows you to create application easily, by making resusable classes and HTML components.
<br/>
Panjs is designed for single page applications but you can use it in a existing application (only parts of the application can be managed by panJs).
</p>

<p><b>One component = one .html file = HTML + CSS + JS</b></p>

<p><a href="http://www.nexilearn.com/panjs/trunk/doc/tutorial" target="_blank"><b>Getting started</b></p>

## Feature Highlights

* A component is a HTML file that contains CSS, JS, HTML, css <link> like any Html file
* Components are based on OOP
* Components (and their dependencies) are loaded dynamically and you don't have to manage dependcies (js/css) in the `<head>` of the main page.
* Cache management (Js/css/html)
* Inheritance on classes and components (HTML / CSS / JS)
* Encapsulation
* Lazy loading of components and classes
* You can use LESS in components. panJs converts LESS to CSS.
* Includes Ajax facilities (Class TrestClient.js)
* Easy to make a one page application (but not mandatory)
* States, hash routing
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

<p><a href="http://www.nexilearn.com/panjs/trunk/doc/tutorial" target="_blank"><b>Tutorial</b></p>


