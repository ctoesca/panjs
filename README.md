<h2>panJS v0.6.0, a 35ko component framework</h2>

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
  
</pre>


