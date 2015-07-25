/*
Event
*/

/* 
params: type:String, bubbles:Boolean = false, cancelable:Boolean = false 
*/

defineClass("Tevent", "panjs.core.Tobject",
{  
	type: null,
	data: null,
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

Tevent.CLICK = "CLICK";
Tevent.CHANGE = "CHANGE";
Tevent.SUCCESS = "SUCCESS";
Tevent.ERROR = "ERROR";
Tevent.DELETE = "DELETE";
Tevent.UPDATE = "UPDATE";
Tevent.ADDED = "ADDED";
Tevent.LOADED = "LOADED";
Tevent.BEFORE_LOAD = "BEFORE_LOAD";
Tevent.DATA_LOADED = "DATA_LOADED";
Tevent.REFRESH = "REFRESH";
Tevent.REPLACE = "REPLACE";
Tevent.ITEM_CLICKED = "ITEM_CLICKED";
Tevent.OPEN = "OPEN";
Tevent.CLOSE = "CLOSE";
Tevent.READY = "READY";
Tevent.BEFORE_STATE_CHANGE = "BEFORE_STATE_CHANGE";
Tevent.STATE_CHANGED = "STATE_CHANGED";

Tevent.SHOW = "SHOW";
Tevent.SHOWN = "SHOWN";
Tevent.HIDE = "HIDE";
Tevent.HIDDEN = "HIDDEN";
Tevent.WAITING = "WAITING";





