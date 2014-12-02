/*
TeventDispatcher 
_eventTypes: { type1:[listener1, listener2 ...], type2:[listener1, listener2 ...], ...}
*/

uses("core.events.Tevent");

defineClass("TeventDispatcher", "core.Tobject", { 

	_listeners: null,
	
	
	constructor: function(args){
		this._listeners = {};
		//logger.debug("TeventDispatcher.init ",this.className,". args=",args);
	},

	/* 	params event:Tevent 
		return Boolean
	*/
	_getListenerIndex: function(type, listener)
	{	
		if (!this.hasEventListener(type))
			return -1;
		
		for (var i=0; i< this._listeners[type].length; i++)
		{
			if (this._listeners[type][i].listener == listener)
			return i;
		}
		return -1;
	},
	
	dispatchEvent: function(event)
	{	
		if (!this.hasEventListener(event.type))
		return;

		var listeners = this._listeners[event.type];

		for (var i=0; i< listeners.length; i++)
		{
			if (listeners[i] != null)
			{
				var list = listeners[i];

				event.currentTarget = this;

				event.data = event.data || list.data;
				event.bind =  list.bind;
				
				if (event.bind == null)
					list.listener(event);
				else
					list.listener.call(event.bind,event);
				
				if (event.cancelled)
					break;
			}
		}	
	},

	/* 	params type:String, listener:Function
		return void
	*/
	on: function(type, listener, bind, data)
	{
		if (arguments.length <4 ) var data = null;
		if (arguments.length <3 ) var bind = null;

		var l = {"listener":listener, "data": data, "bind":bind};

		if (!this.hasEventListener(type))
			this._listeners[type] = [];
		
		for (var i=0; i< this._listeners[type].length; i++)
		{
			if (this._listeners[type][i] == null)
			{
				this._listeners[type][i] = l;
				return;
			}
		}	
		this._listeners[type].push(l);
	},

	/* 	params: (type:String, listener:Function, useCapture:Boolean = false 
		return void
	*/
	off: function(type, listener)
	{
		var indx = this._getListenerIndex(type, listener);
	
		if (indx >= 0)
		{
			this._listeners[type][indx] = null;
		}
	},
	removeAllListeners: function()
	{
		for (type in this._listeners)
		{
			this._listeners[type].length = 0;
			this._listeners[type] = null;
			delete this._listeners[type];
		}
	},
	/* 	params: type:String	
		return Boolean
	*/
	hasEventListener: function(evtType) 
	{
		return (typeof this._listeners[evtType] != "undefined");
	}
});