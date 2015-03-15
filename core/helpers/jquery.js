
/*
* Extension de jquery
*/

clone = function(obj) {
	return jQuery.extend(true, {}, obj);
}

$.fn.getElement = function (selector) {  
    //renvoie un seul element Jquery ou null si aucun élément trouvé 
		var r = $(selector, this);		     
		if (r.length == 0)
			return null;
			else
				if (r.length == 1)
				return r;
				else
					if (r.length > 1)
					return $(r[0]);
};
$.fn.getElements = function (selector) {  
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
	logger.debug(k+ ", r="+r);
	return r;
}