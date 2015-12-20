/*
Tevent
*/

__CLASSPATH__="panjs.core.events.Tevent";
defineClass("Tevent", "panjs.core.Tobject",
{  
	type: null,
	data: null,
	relatedData: null,
	bubbles: false,
	cancelable: false,
	currentTarget: null,
	cancelled: false,
	defaultPrevented: false,

	constructor: function(type, eventData, bubbles, cancelable){
		this.injectParam("type", type,true);
		this.injectParam("data", eventData);
		this.injectParam("bubbles", bubbles);
		this.injectParam("cancelable", cancelable);     
	},
	preventDefault: function()
	{
		this.defaultPrevented = true;
	}
});

Tevent.CLICK = "click";
Tevent.CHANGE = "change";
Tevent.SUCCESS = "success";
Tevent.ERROR = "error";
Tevent.DELETE = "delete";
Tevent.UPDATE = "update";
Tevent.ADDED = "added";
Tevent.LOADED = "loaded";
Tevent.BEFORE_LOAD = "before_load";
Tevent.DATA_LOADED = "data-loaded";
Tevent.REFRESH = "refresh";
Tevent.REPLACE = "replace";
Tevent.ITEM_CLICKED = "item-clicked";
Tevent.OPEN = "open";
Tevent.CLOSE = "close";
Tevent.READY = "ready";
Tevent.BEFORE_STATE_CHANGE = "before_state_change";
Tevent.STATE_CHANGED = "state_changed";
Tevent.KEYDOWN = "keydown";
Tevent.SHOW = "show";
Tevent.SHOWN = "shown";
Tevent.HIDE = "hide";
Tevent.HIDDEN = "hidden";
Tevent.WAITING = "waiting";

Tevent.BEFORE_DESTROY = "BEFORE_DESTROY";
Tevent.DESTROY = "DESTROY";


