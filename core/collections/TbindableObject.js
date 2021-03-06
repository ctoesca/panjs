

/*
Envoie un evenement "CHANGE" quand une propriété a changé.
seules les propriétés ne commençant pas par "_" , de type string ou number sont bindable 

Cette classe n'est pas perenne car à chaque instanciation, on doit binder les proprités alors
que c'est au niveau du prototype que ça devrait être fait (starter -> extend).
*/

defineClass("TbindableObject", "panjs.core.events.TeventDispatcher",
{  

	test:0,
	var1: "reter",

	constructor: function(args){
		this._super.constructor.call(this,args); 	  
		this.defineProp();
	},
	defineProp: function()
	{
		Object.defineProperty (this, '__',  { value: {} });

		var fields = [];
		for (var k in this)
		{
			var typ = typeof this[k];
			if ((( typ == "number") || (typ == "string")) && (k.substring(0,1) != "_") )
			{
				fields.push(k);
			}
		}

		//** DEFINI SUR LE PROTOTYPE */
		/*(function define_fields (fields,b){
			fields.forEach (function (field_name) {

				var cache = b[field_name]; // la propriété va être écrasée
				var values = {};

				Object.defineProperty (TbindableObject.prototype, field_name, {
					get: function () { 
						
						return this["_"+field_name]; 
					},
					set: function (newValue) {
						if (this["_"+field_name] != newValue)
						{
							alert("changed "+this["_"+field_name]+" => "+newValue);
							this["_"+field_name] = newValue;
						}
					}
				})
				b["_"+field_name] = cache;
			})
		}) (fields,this);
*/

		//** DEFINI SUR L'INSTANCE */
		 var $this = this;
		 fields.forEach(function(field_name){
		 	var cache = $this[field_name];
	        Object.defineProperty($this, field_name, {
	            get: function(){ return this["_"+field_name] },
	            set: function(newValue){
	       
	                if (this["_"+field_name] != newValue)
					{
						alert("changed "+this["_"+field_name]+" => "+newValue);
						this["_"+field_name] = newValue;
					}    
	            }
	        });
	        $this["_"+field_name] = cache;
	        
	    });

	}

});



