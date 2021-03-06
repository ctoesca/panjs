
defineClass("TzoomDetector", "panjs.core.events.TeventDispatcher",
{ 
	isReady: false,

	/* METHODES */
	constructor: function(args) { 
		TzoomDetector._super.constructor.call(this,args);	
		
		panjs.loadScriptAsync(globals.libsPath+"/detect-zoom/detect-zoom.min.js", this.onScriptLoaded.bind(this));
  	},
  	free: function()
  	{
  		this._super.free.call(this);
  	},
  	
  	getZoom: function(callback){

  		var r = {zoom: null};
  		if (this.isReady)
  			r = detectZoom.zoom();

  		return r;
  	},

  	onScriptLoaded: function(src)
  	{
  		if (typeof detectZoom == "undefined")
  			return;
        
        this.isReady = true;

        var data = {zoom: detectZoom.zoom()};//detectZoom.zoom(),  detectZoom.device()
  		this.dispatchEvent( new Tevent(Tevent.READY, data));

        if (zoom != 1)
        {
        	// ZOOM PAS OK
        	/*if (zoomOKToastMessage != null){
        		$().toastmessage('removeToast', zoomOKToastMessage);
        		zoomOKToastMessage = null;	
        	}
        	

        	if (zoomWarningToastMessage == null)
        	zoomWarningToastMessage = $().toastmessage('showToast', {
    			sticky: true,
                stayTime: 10000,
                position: 'top-right',
                text: "ATTENTION: le zoom est activé (x"+zoom+"). Vous risquez d'avoir des problème d'affichage, notamment sur certaines animations.<br/>Pour modifier le zoom:<br/>touche CONTROLE + touche +/-",
                type: "error"
	        });*/

        }else{
        
        	/*if ((zoomOKToastMessage == null)&&(zoomWarningToastMessage != null))
        	zoomOKToastMessage = $().toastmessage('showToast', {
    			sticky: false,
                stayTime: 10000,
                position: 'top-right',
                text: "Le zoom est n'est plus activé",
                type: "success"
	        });

        	// ZOOM OK 
        	if (zoomWarningToastMessage != null)
        	{
        		$().toastmessage('removeToast', zoomWarningToastMessage);
        		zoomWarningToastMessage = null;
        	}*/
        } 
   
  	}
  	
});




