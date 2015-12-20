
/*
* Extension de jquery
*/

clone = function(obj) {
	return jQuery.extend(true, {}, obj);
}
/*
(function( $ ) {
 	

    $.fn.panjs = function() {
  		var selectedObjects = this;
        return {
	        getCompo : function() {
				var r = null;
				if ($(selectedObjects)[0].compo)
					r = $(selectedObjects)[0].compo;
				return r;
	        }
    	};
 
    };
 
}( jQuery ));*/


$.fn.load = function(args) {

	var el = $(this);
	var r = null;
	var dataCompo = el.attr("data-compo");

	if (dataCompo == null) {
		logger.warn("This element is not a panjs component");
	} else {
		var isLoaded = (el.attr("data-loaded") == "true");

		if (!isLoaded) {
			var originalId = el.attr("data-original-id");

			var id = el.attr("id");

			if (arguments.length == 0){
				var args = {};	
			}

			if (typeof el.data("args") != "undefined")
			{
				var _args = el.data("args");
				for (var k in args)
					_args[k] = args[k];
				args = _args;
			}

			var owner = null;
			if (el[0].owner){
				owner = el[0].owner;
			}else if (args.owner){
				owner = args.owner;
			}


			args.elem = el[0];
			args.owner = owner;

			var compo = panjs.createComponent(dataCompo, args, false);

			compo.container[0].compo = compo;
			compo.container[0].loaded = true;

			compo.container.attr("data-loaded", "true");
			compo.container.attr("data-original-id", originalId);

			
			if (owner){
				owner._onSubComponentLoaded(compo, el, args);			
			}	
			else{							
				logger.debug("owner not set: dataCompo="+dataCompo+" originalId="+originalId);
				/*<ENV:dev>*/
        		panjs.capture("$.fn.load: createComponent without owner",{componentId: compo.id, classPath: compo.classPath, from: null});
        		/*</ENV:dev>*/
			}
        	


			el.trigger(Tevent.LOADED, [compo, args]);

			el.replaceWith(compo.container);

			/*if (el.css("display") != "none")
				compo.container.css("display", el.css("display"));
			else
				compo.container.hide();*/

			compo._triggerOnAdded();

			el.remove();

			r = compo;
		} else {
			r = el[0].compo;
		}

	}
	return r;
};

$.fn.isLoaded = function() {
	return ($(this).attr("data-loaded") == "true")
}

$.fn.isCompo = function() {
	return ($(this).attr("data-compo") != null)
}
$.fn.getCompo = function() {
	//return $(this).panjs().getCompo();
	var r = null;
	if ($(this)[0].compo)
		r = $(this)[0].compo;
	return r;
}

$.fn.getElement = function (selector) {  
    //renvoie un seul element Jquery ou null si aucun élément trouvé 
		var r = $(this).find(selector);
		if (r.length == 0)
			return null;
		else
			return $(r[0]);
};

/* DEPRECATED */
$.fn.getElements = function (selector) {  
	logger.warn("PANJS: $.fn.getElements is deprecated");
    //renvoie un tableau Jquery d'elements Jquery (vide si aucun élément trouvé) 
		var r = $(selector, this);	//tableau d'élement DOM
		var result = $([]);
		if (r.length == 1)
			result.push(r);
		else
			for (var i=0; i< r.length; i++)
			{
				result.push($(r[i]));
			}		           
		return result;	
};

$.fn.swapWith = function(to) {
	return this.each(function() {
		var copy_to = $(to).clone(true);
		var copy_from = $(this).clone(true);
		$(to).replaceWith(copy_from);
		$(this).replaceWith(copy_to);
	});
};

function isNumberKey(evt)
{
      var k = evt.which;
      var shift = evt.shiftKey;

      var numerosPavenum = ((k >=96) && (k<=105));
      var numerosClavier = ((k >=48) && (k<=57));

      return numerosPavenum || (numerosClavier && (shift == true));
}

function isControlKey(evt)
{	
	// flèches, backspace, supp, ctrl+C, ctrl+X , ctrl+V
	var k = evt.which;	
	var r =  (k == 8)||(k == 13)||(k == 46)||(k == 35)||(k == 36)||(k == 37)||(k == 39)||(k == 9) || ( evt.ctrlKey && (k=67))|| ( evt.ctrlKey && (k=86))|| ( evt.ctrlKey && (k=88));
	return r;
}