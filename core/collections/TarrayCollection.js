
/*** 
Tobject 
***/

defineClass("TarrayCollection", "core.events.TeventDispatcher", {
	_source:null,
	length:0,
 
 // _length:0,

	constructor: function(args) { 
		TarrayCollection._super.constructor.call(this,args);

    if (args)
      this._source = args;
    else
      this._source = [];
    
   /* ça fonction */
   
     /* Object.defineProperty(this, "length", {
            set : function(newValue){ 
                logger.debug("changedgg "+this._length+" => "+newValue);
                this._length = newValue; 
            },
            get : function(){ 
                return this._length; 
            }
    });
*/
    this.length = this._source.length;

  	},
	
	/*
  		PUBLIC
  	*/
  sort:function( sortFunction)
  {
      if (defined(sortFunction))
      {
        this._source.sort(sortFunction);
      }
  },

	  getSource: function()
  	{
  		return this._source;
  	},
  	setSource: function(value)
  	{
  		if (this._source != value)
  		{
  			this._source = value;
  			this.refresh();
  		}
  	},
	  
    getByProp: function(propname, propvalue, multiple)
    {
      var r = null;
      var returnArray = false;

      if (arguments.length > 2)
         if (multiple === true){
            r = []
            returnArray = true;
         }
     
      for (var i=0; i<this._source.length; i++)
      {
        var item = this._source[i];
        
        if (typeof item[propname] != "undefined")
        {  
          if (item[propname] == propvalue)
          {
            if (returnArray == true)
            {
              r.push(item);
            }
            else
            {
              r = item;
              break;
            }
            
          }
        }
      }
      return r;
    },
    replaceItem:function(item, newItem)
    {
      if (item == newItem)
        return;
        var indx = this.getItemIndex(item);
        if (indx > -1)
        {
          this._source[indx] = newItem;
          this.length = this._source.length; 
          this.dispatchEvent( new Tevent(Tevent.REPLACE, {item:item, newItem: newItem}));
          this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REPLACE",item:item, newItem: newItem}));
        }
    },

    updateItem: function(item)
    {
        this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
    },

  	getItemIndex: function(item)
  	{
  		for (var i=0; i<this._source.length; i++)
      {
  			if (this._source[i] == item)
        {
  				return i;
        }
      }

  		return -1;
  	},

  	getItemAt: function(indx)
  	{
  		return this._source[indx];
  	},

  	addItem: function(item)
  	{ 
  		var indx = this.getItemIndex(item);

  		if (indx == -1)
  		{
  			this._source.push(item);
        this.length = this._source.length;    
        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:this.length-1}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:this.length-1}));
  		}
  	},
    addItems: function(items)
    { 
      for (var i=0; i<items.length; i++)
      this._source.push(items[i]); 

      this.length = this._source.length;   

      this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
      
    },
    addItemAt: function(item, indx)
    {
        this._source.splice(indx, 0, item);
        this.length = this._source.length;    
        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:indx}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:indx}));
    },

  	
  	removeItem: function(item)
  	{
  		var indx = this.getItemIndex(item);
  		if (indx >= 0)
  			this._removeItemAt(indx, item);
      return indx;
  	},
  	
  	removeItemAt: function(indx)
  	{
  		var item = this.getItemAt(indx);
      if (item != null)
  		  this._removeItemAt(indx, item);
  	},
  	
  	removeAll: function()
  	{
  		this._source = [];
  		this.refresh();
  	},
    refresh:function()
    {
        this.length = this._source.length;
        this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REFRESH"}));
    },
    
  	/*
  		PRIVATE
  	*/
  	_removeItemAt: function(indx, item)
  	{
  		this._source.splice(indx, 1);
      this.length = this._source.length;
  		this.dispatchEvent( new Tevent(Tevent.DELETE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"DELETE", item:item}));
  	}
});

