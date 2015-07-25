
/*** 
Tobject 
***/

defineClass("TarrayCollection", "panjs.core.events.TeventDispatcher", {
	_source:null,
	length:0,
  key: null,
  _byId: null,
 // _length:0,
  filterFunction: null,
  _items: null,

	constructor: function(args) { 
		TarrayCollection._super.constructor.call(this,args);
    
    this._items = [];

    var data = [];
    if (args){
      if (typeof args.push != "undefined"){
        data = args;
      }else{
        if (args.key)
          this.key = args.key;
        if (args.data)
          data = args.data;
        if (args.filterFunction)
          this.filterFunction = args.filterFunction;
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

  

  	},
	
	/*
  		PUBLIC
  	*/
  sort:function( sortFunction)
  {
      if (defined(sortFunction))
        this._items.sort(sortFunction);
  },
  
	  getSource: function()
  	{
  		return this._items;
  	},
  	setSource: function(value)
  	{
  		if (this._source != value)
  		{
  			this._source = value;
        
        if (this.filterFunction != null){
          this._items = this._source.filter( this.filterFunction );
        }
        else{
          this._items = this._source.slice(0);
        }

        if (this.key != null)
        {
          this._byId = {};
          for (var i=0; i<this._items.length; i++)
            this._byId[ this._items[i][this.key]] = this._items[i];
        }
        this.length = this._items.length;
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
    getByKey: function(key)
    {
      return  this._byId[key];
    },
    getByProp: function(propname, propvalue, multiple, case_sensitive)
    {
      var r = null;
      
      if ((this.key!=null) && (propname == this.key))
      {
          if (typeof this._byId[propvalue] != "undefined")
            r = this._byId[propvalue];
      }else
      {
        if (typeof case_sensitive == "undefined")
          case_sensitive = false;

        if ((!case_sensitive)&&(typeof propvalue == 'string'))
          propvalue = propvalue.toLowerCase();

          if (arguments.length < 3)
          {
             var multiple = false;
          }
          else{
              r = [];
          }
          for (var i=0; i<this._items.length; i++)
          {            
            var item = this._items[i];
            
            if (typeof item[propname] != "undefined")
            {  
              var tmp =  item[propname];
             if ((!case_sensitive)&&(typeof item[propname] == 'string'))
                  tmp =  item[propname].toLowerCase();

              if (tmp == propvalue)
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
    getFilterFunction: function(){
      return this.filterFunction;
    },
    setFilterFunction: function( f ){
      if (this.filterFunction != f){
        this.filterFunction = f;
      }
    },
    dispatchUpdateEvent: function(item){
      this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"UPDATE", item: item}));
    },
   
    refresh:function()
    {
      
      if (this.filterFunction != null)
        this._items = this._source.filter( this.filterFunction );
      //else
      //   this._items = this._source.slice(0);

      this.length = this._items.length;
     
      this.dispatchEvent( new Tevent(Tevent.REFRESH, this));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REFRESH"}));
    },

    /*
    ******************** LECTURE DE LA COLLECTION ************************
    */
    _getItemIndex: function(item, list)
    {
      for (var k=0; k<list.length; k++)
      {
          if (list[k] == item)
            return k;
      }
      return -1;
    },
    getItemIndex: function(item)
    {
      return this._getItemIndex(item, this._items);
    },

    getItemAt: function(indx)
    {
      return this._items[indx];
    },
  
    contains: function(item){
      return (this.getItemIndex(item)>=0);
    },
    /*
    ******************** MODIFICATION DE LA COLLECTION ************************
    */
    _replaceItem: function(indx, item, newItem){
      
      this._items[indx] = newItem;
      if (this.key != null)
      {
        this._byId[item[this.key]] = newItem;
        this.dispatchEvent( new Tevent(Tevent.UPDATE, item));
      }
              
      this.length = this._items.length;      
      this.dispatchEvent( new Tevent(Tevent.REPLACE, {item:item, newItem: newItem}));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"REPLACE",item:item, newItem: newItem}));
    },
   
    replaceItem:function(item, newItem)
    { 
      if (item == newItem)
        return;

        var indx = this._getItemIndex(item, this._source);
        if (indx > -1)
          this._source[ indx] = newItem;
        
        indx = this.getItemIndex(item);
        if (indx > -1)
        {                 
          if (this.filterFunction == null)
          {
            this._replaceItem(indx, item, newItem);
          }else
          {          
              if (this.filterFunction(newItem))
              {
                //Filtre OK
                this._replaceItem(indx, item, newItem);

              }
              else
              {
                //Filtre KO
                this._removeItemAt(indx, newItem);
              }
          }
          
       }
    },
    _addItemAt: function(indx, item)
    {   

        if (this.key != null)
        {
          if (typeof this._byId[item[this.key]] != "undefined")
          {
            throw "Key already in collection: "+item[this.key];
          }
          this._byId[item[this.key]] = item;
        }
        
        this._items.splice(indx, 0, item);
        this.length = this._items.length;    

        this.dispatchEvent( new Tevent(Tevent.ADDED, {item:item, index:indx}));
        this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"ADDED", item:item, index:indx}));
    },

  	addItem: function(item)
  	{
        this._source.push(item);

        if ((this.filterFunction == null) || (this.filterFunction(item)))
        {
          var indx = this.getItemIndex(item);          
          if (indx == -1)
          {
             this._addItemAt(this.length, item);
          }
        }
  	},

    addItemsAt: function(items, indx)
    { 
      if (indx > this.length)
      {
        this.addItems(items);
      }else{
        var position = indx;
        for (var i=0; i<items.length; i++)
        {
          this._source.push(items[i]);
          if ((this.filterFunction == null) || (this.filterFunction(items[i])))
          {
            var indx = this.getItemIndex(items[i]);   
            if (indx > -1){
              position ++;         
              this._addItemAt(position, items[i]);  
            }
            
          }
        }     
      }
    },

    addItems: function(items)
    { 
      this.addItemsAt(items, this.length);
    },
    addItemAt: function(item, indx)
    {
        if (indx > this.length){
          this.addItem(item)
        }else{
            this._source.push(item);
            if ((this.filterFunction == null) || (this.filterFunction(item)))
            {
              this._addItemAt(indx, item );
            }       
        }
    },
    forEach: function( f ){
      this._items.forEach( f );
    },
    removeItems: function(mixed)
    {
      if (typeof mixed == "function")
      {
        var itemsToRemove = [];
        for (var i =0; i< this._items.length; i++)          
          if (mixed(this._items[i]))
            itemsToRemove.push(this._items[i]);
      }else{
        var itemsToRemove = mixed;
      }
      
      for (var i =0; i< itemsToRemove.length; i++) 
        this.removeItem( itemsToRemove[i] );

      return itemsToRemove;
    },

  	removeItem: function(item)
  	{
      if (item != null)
      {
        var indx = this.getItemIndex(item);
        if (indx >= 0){
          this._removeItemAt(indx, item);
        }
      }else{
         var indx = -1;
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
      this._items = [];
      this._byId = {};
  		this.refresh();
  	},
   
    
  	/*
  		PRIVATE
  	*/
  	_removeItemAt: function(indx, item)
  	{
  		this._items.splice(indx, 1);

      var indxSource = this._getItemIndex(item, this._source);
     
      if (indxSource>= 0)
        this._source.splice(indxSource, 1);
 
      this.length = this._items.length;
      if (this.key != null)
        delete this._byId[item[this.key]];

  		this.dispatchEvent( new Tevent(Tevent.DELETE, item));
      this.dispatchEvent( new Tevent(Tevent.CHANGE, {action:"DELETE", item:item}));
  	}
});

