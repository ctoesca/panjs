/*
TeventDispatcher 
_eventTypes: { type1:[listener1, listener2 ...], type2:[listener1, listener2 ...], ...}
*/

uses("panjs.core.events.Tevent");

__CLASSPATH__="panjs.core.events.TeventDispatcher";
defineClass("TeventDispatcher", "panjs.core.Tobject", { 

	_listeners: null,
	
	
	constructor: function(args){
		this._listeners = {};
	},
	
	free: function(){
		logger.trace("FREE className=%1 id=%2", this.className, this.id);

		this.removeAllListeners();
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
			if (this._listeners[type][i] != null)
				if (this._listeners[type][i].listener == listener)
					return i;
		}
		return -1;
	},
	
	dispatchEvent: function(mixed, eventData, bubbles, cancelable)
	{	
		/*mixed = Tevent: {type, eventData, bubbles, cancelable}
			or 
		mixed = {type, eventData, bubbles, cancelable}*/

		var type = null;
		var event = null;
		if (typeof mixed == "object")
		{
			event = mixed;
			type = mixed.type;
		}
		else{
			type = arguments[0];
		}

		if (!this.hasEventListener(type))
				return;
		//un objet event n'est créé que si il y a des listeners
		if (event == null)
			event = new Tevent(type, eventData, bubbles, cancelable);
		
		var listeners = this._listeners[event.type];

		for (var i=0; i< listeners.length; i++)
		{
			if (listeners[i] != null)
			{
				var list = listeners[i];

				if (event.currentTarget == null)
				event.currentTarget = this;

				event.bind =  list.bind;
				event.relatedData = list.data;
				
				if (event.bind == null)
					list.listener.call(this, event);
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

	once: function(type, listener, bind, data)
	{
		if (this._getListenerIndex(type, listener) > -1)
			return;
		if (arguments.length <3 ) 
			this.on(type, listener);
		else if (arguments.length <4 )
			this.on(type, listener, bind);
		else
			this.on(type, listener, bind, data);
		
	},

	
	offByCtx: function(ctx){
		for (var type in this._listeners)
		{
			var listeners = this._listeners[type];
			for (var i=0; i< listeners.length; i++)
			{
				if ((listeners[i] != null)&&(listeners[i].bind == ctx))
				{
					listeners[i] = null;
				}	
			}
		}
	},
	
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
		for (var type in this._listeners)
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
