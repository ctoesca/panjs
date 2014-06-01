<h2>panJS v0.6.0 <small>- a 35ko component framework</small></h2>

<p>panJs is a javascript framework that uses Jquery and allows you to create application easily, by making resusable components.
<br/>You can integrate panJS in a existing application (only parts of the application can be managed by panJs).
</p>

<h3>Some features:</h3>
<ul>
<li>A component is a HTML file that contains CSS, JS, HTML, css &lt;link&gt; like any Html file</li>
<li>Components can be integrated in a page or in other components with html markup</li>
<li>Components (and their dependencies) are loaded dynamically and you don't have to add js/css in the <code>&lt;head&gt;</code> of the page.</li>
<li>Cache management (Js/css/html)</li>
<li>Inheritance on classes and components (HTML / CSS / JS)</li>
<li>Encapsulation</li>
<li>Lazy loading of components and classes</li>
<li>You can use LESS in components. panJs converts LESS to CSS.</li>
<li>Includes Ajax facilities (Class TrestClient.js)</li>
<li>Easy to make a one page application (but not mandatory)</li>
<li>States, hash routing (work in progress)</li>
<li>...</li>
</ul>

<h3>What panJs does not:</h3>
<ul>
<li>panJs doesn't choose the architecture of your application (MVC, MVVC etc)</li>
<li>Data binding (but you can use some data binding frameworks if you want)</li>
<li>panJs isn't a UI library (but there is already some UI components available)</li>
</ul>

<h3>What is a panJS component?</h3>

<p>You put a component in HTML page (or in another HTML component) like this:</p>

<pre>&lt;div data-compo="app.myComponent.html"/&gt;</pre>

<p>myComponent.html:</p>
<pre>
&lt;html&gt; 

  &lt;head&gt;
    &lt;style type="text/css"&gt;
    .TmyComponent .result
    {
      font-weight: bold;           
      color: #428bca
    }   
    &lt;/style&gt;

    &lt;script type="text/x-class-definition"&gt;
    //&lt;![CDATA[      
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
    //]]&gt;
    &lt;/script&gt;
  &lt;/head&gt;
  
  &lt;body&gt;
     &lt;button type="submit" id="btnSubmit" class="btn btn-danger"&gt;Click here&lt;/button&gt;
     &lt;span id="result" class="result"&gt;&lt;/span&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

<h3>Getting started</h3>

<pre>

&lt;script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js">&lt;/script&gt;

&lt;script&gt;
//&lt;![CDATA[  

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

//]]&gt;
&lt;/script&gt;

&lt;script src="../core/panjs_core.min.js">&lt;/script&gt;
&lt;!-- Use panjs_core_with_less.min.js if you want to enable LESS--&gt;
</pre>


