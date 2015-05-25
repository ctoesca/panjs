defineClass("Model", "core.events.TeventDispatcher",
{ 

  owner: null,
  settingData: false,

	constructor: function(args) { 

	  Model._super.constructor.call(this,args);	
    if (defined(args,'owner'))
        this.owner = args.owner;
  },
  initData: function(data){
    this.settingData = true;
      for (var k in data){
        this[k] = data[k];
      }
      this.settingData = false;
  },

  __OnPropChanged: function(propName, oldValue, newValue, object){
      if (this.settingData)
      return;

      if (this[propName] instanceof Model){
        logger.debug("Affectation owner sur objet "+propName);
        this[propName].owner = this;
      }

      if (this.owner != null){
        this.owner.__OnPropChanged(propName, oldValue, newValue, object);
      }
      else{
        this.dispatchEvent( Tevent.CHANGE, {propName:propName, oldValue:oldValue, newValue:newValue , object: object});
        
      }
  },
  
  setData: function(obj){
      for (var k in obj)
      {
        if (typeof this[k] != "undefined")
        {
          if (this[k] != obj[k])
          {
            var oldValue = this[k];
            this[k] = obj[k];
          }
        }else{
          this[k] = obj[k];
          this.__OnPropChanged(k, undefined , obj[k], this);
        }
      }
  },

  getData: function(){
      var json = {};
      for (var k in this)
      {    
          if ((k != "owner")&&(k != "settingData")&&(typeof this[k] != 'function')&&(typeof this._super[k] == "undefined"))
          {
            //logger.error(this.className+" , typeof "+k+" => "+typeof this[k]);
            if (k.startsWith("__"))
                k = k.droite("__");

            if (this[k] instanceof Model)
            {
              json[k] = this[k].getData();
            }else{
             

              json[k] = this[k]; 
            }          
          }
      }
      return json;
  }

});
