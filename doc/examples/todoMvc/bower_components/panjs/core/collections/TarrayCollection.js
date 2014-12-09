
/*** 
Tobject 
***/

defineClass("TarrayCollection", "core.events.TeventDispatcher", {
	_source:null,
	length:0,
  key: null,
  _byId: null,
 // _length:0,

	constructor: function(args) { 
		TarrayCollection._super.constructor.call(this,args);
    var data = [];
    if (args){
      if (typeof args.push != "undefined"){
        data = args;
      }else{
        if (args.key)
          this.key = args.key;
        if (args.data)
          data = args.data;
      }
    }
    
    this._byId = {};
    this.setSource(data);
    
   /* ça fonction */
   
   /*   Object.defineProperty(this._source, "length", {
            set : function(newValue){ 
                logger.debug("changedgg "+this._length+" => "+newValue);
                this._length = newValue; 
            },
            get : function(){ 
                return this._length; 
            }
    });*/

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
        if (this.key != null)
        {
          this._byId = {};
          for (var i=0; i<this._source.length; i++)
            this._byId[ this._source[i][this.key]] = this._source[i];
        }
        
  			this.refresh();
  		}
  	},
	 find: function(opt)
   {
      var r = [];
      if (opt.filterFunction){
        for (var i=0; i<this._source.length; i++){
          if (opt.filterFunction(this._source[i]))
            r.push(this._source[i]);
        }
      }
     
      return r;
   },
    getByProp: function(propname, propvalue, multiple)
    {
      var r = null;
     
      if ((this.key!=null) && (propname == this.key))
      {
          if (typeof this._byId[propvalue] != "undefined")
            r = this._byId[propvalue];
      }else
      {
          if (arguments.length < 3)
          {
             var multiple = false;
          }
          else{
              r = [];
          }
          for (var i=0; i<this._source.length; i++)
          {            
            var item = this._source[i];
            
            if (typeof item[propname] != "undefined")
            {  
              if (item[propname] == propvalue)
              {
                if (multiple == true)
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
          if (this.key != null){
            this._byId[item[this.key]] = newItem;
            this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
          }
          this.length = this._source.length; 
          this.dispatchEvent( new Tevent(Tevent.REPLACE, {item:item, newItem: newItem}));
          this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REPLACE",item:item, newItem: newItem}));
        }
    },

    updateItem: function(item)
    {   
      var changed = false;
      var oldItem = item; 
      if (this.key != null)
      {
        oldItem = this.getByProp(this.key, item[this.key]);
        if (oldItem != null){
          this._byId[item[this.key]] = item;
          changed = true;
        }
      }else{
          var indx = getItemIndex(item);
          if (indx >= 0){
            oldItem = null;
            changed = true;
          }
      }
      if (changed)
        this.dispatchUpdateEvent(oldItem, item );
    },

    dispatchUpdateEvent: function(oldItem, newItem ){
      this.dispatchEvent( new Tevent(Tevent.UPDATE, newItem));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"UPDATE", item: oldItem, newItem:newItem}));
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
        if (this.key != null)
            this._byId[item[this.key]] = item;

        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:this.length-1}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:this.length-1}));
  		}
  	},
    addItems: function(items)
    { 
      for (var i=0; i<items.length; i++){
        this._source.push(items[i]); 
        if (this.key != null)
          this._byId[items[i][this.key]] = items[i];
      }

      this.length = this._source.length;   

      this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
      
    },
    addItemAt: function(item, indx)
    {
        this._source.splice(indx, 0, item);
        if (this.key != null)
          this._byId[item[this.key]] = item;

        this.length = this._source.length;    
        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:indx}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:indx}));
    },

  	
  	removeItem: function(item)
  	{
  		var indx = this.getItemIndex(item);
  		if (indx >= 0){
  			this._removeItemAt(indx, item);
       
      }
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
      this._byId = {};
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
      if (this.key != null)
        delete this._byId[item[this.key]];

  		this.dispatchEvent( new Tevent(Tevent.DELETE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"DELETE", item:item}));
  	}
});

