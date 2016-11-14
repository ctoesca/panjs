__CLASSPATH__="panjs.core.collections.TarrayCollection";
defineClass("TarrayCollection", "panjs.core.events.TeventDispatcher", {
		_source: null,
		length: 0,
		key: null,
		_byId: null,
		filterFunction: null,
		_items: null,

		constructor: function(args) {
				TarrayCollection._super.constructor.call(this, args);

				this._items = [];

				var data = [];
				if (args) {
						if (typeof args.push != "undefined") {
								data = args;
						} else {
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

				/* ça fonctionne */

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

		sort: function(sortFunction) {
				if (defined(sortFunction))
						this._items.sort(sortFunction);
		},

		getSource: function() {
				return this._items;
		},
		setSource: function(value, silent) {
			
			if ((typeof value != "object")||(typeof value.push != "function"))
			{
				logger.error("TarrayCollection.setSource: data must be a array !");

			}else{
				
				if (this._source != value) {
						this._source = value;

						if (this.filterFunction != null) {
								this._items = this._source.filter(this.filterFunction);
						} else {
								this._items = this._source.slice(0);
						}

						if (this.key != null) {
								this._byId = {};
								for (var i = 0; i < this._items.length; i++)
										this._byId[this._items[i][this.key]] = this._items[i];
						}
						this.length = this._items.length;
						this.refresh(silent);
				}
			}

		},
		find: function(opt) {
				var r = [];
				if (opt.filterFunction) {
						for (var i = 0; i < this._source.length; i++) {
								if (opt.filterFunction(this._source[i]))
										r.push(this._source[i]);
						}
				}

				return r;
		},
		swap: function(sourceItem, destItem){
			if (sourceItem != destItem)
			{
				var indx1 = this.getItemIndex(sourceItem);
				var indx2 = this.getItemIndex(destItem);
				

				this._items[indx1] = destItem;
				this._items[indx2] = sourceItem;				
			}
		},

		moveAfter: function(item, destItem){
			if (item != destItem)
			{
				var indx1 = this.getItemIndex(item);
				var indx2 = this.getItemIndex(destItem);
						
				if (indx1 < indx2){
		    		this.moveItem( item, indx2 );
		    	} else if (indx1 > indx2){
		    		this.moveItem( item, indx2+1);
		    	}
			}
		},
		moveItem: function (item, toIndex ) 
		{
			var fromIndex = this.getItemIndex(item);

			if (fromIndex != toIndex)
			{
			    var element = this._items[fromIndex];
	    		this._items.splice(fromIndex, 1);
	    		this._items.splice(toIndex, 0, element);

				this.dispatchEvent(new Tevent(Tevent.ITEM_MOVED, {
					item: item,
					fromIndex: fromIndex,
					toIndex: toIndex
				}));		
				this.dispatchEvent(new Tevent(Tevent.CHANGE, {
					action: "ITEM_MOVED",
					item: item,
					fromIndex: fromIndex,
					toIndex: toIndex
				}));		
			}

		},

		getByKey: function(key) {
				return this._byId[key];
		},
		getByProp: function(propname, propvalue, multiple, case_sensitive) {
				var r = null;

				if ((this.key != null) && (propname == this.key)) {
						if (typeof this._byId[propvalue] != "undefined")
								r = this._byId[propvalue];
				} else {
						if (typeof case_sensitive == "undefined")
								case_sensitive = false;

						if ((!case_sensitive) && (typeof propvalue == 'string'))
								propvalue = propvalue.toLowerCase();

						if (arguments.length < 3) {
								var multiple = false;
						} else {
								r = [];
						}
						for (var i = 0; i < this._items.length; i++) {
								var item = this._items[i];

								if (typeof item[propname] != "undefined") {
										var tmp = item[propname];
										if ((!case_sensitive) && (typeof item[propname] == 'string'))
												tmp = item[propname].toLowerCase();

										if (tmp == propvalue) {
												if (multiple == true) {
														r.push(item);
												} else {
														r = item;
														break;
												}

										}
								}
						}
				}

				return r;
		},
		getFilterFunction: function() {
				return this.filterFunction;
		},
		setFilterFunction: function(f) {
				if (this.filterFunction != f) {
						this.filterFunction = f;
				}
		},
		dispatchUpdateEvent: function(item) {
				this.dispatchEvent(new Tevent(Tevent.UPDATE, {item:item} ));
				this.dispatchEvent(new Tevent(Tevent.CHANGE, {
						action: "UPDATE",
						item: item
				}));
		},

		refresh: function(silent) {

				if (this.filterFunction != null)
						this._items = this._source.filter(this.filterFunction);

				this.length = this._items.length;
				if (!silent){
					this.dispatchEvent(new Tevent(Tevent.REFRESH, this));
					this.dispatchEvent(new Tevent(Tevent.CHANGE, {
						action: "REFRESH"
					}));
				}
		},

		/*
		 ******************** LECTURE DE LA COLLECTION ************************
		 */
		getItems: function() {
				return this._items;
		},
		_getItemIndex: function(item, list) {
				for (var k = 0; k < list.length; k++) {
						if (list[k] == item)
								return k;
				}
				return -1;
		},
		getItemIndex: function(item) {
				return this._getItemIndex(item, this._items);
		},

		getItemAt: function(indx) {
				return this._items[indx];
		},

		contains: function(item) {
				return (this.getItemIndex(item) >= 0);
		},
		/*
		 ******************** MODIFICATION DE LA COLLECTION ************************
		 */
		_replaceItem: function(indx, item, newItem, silent) {

				this._items[indx] = newItem;
				if (this.key != null) {
						this._byId[item[this.key]] = newItem;
						this.dispatchEvent(new Tevent(Tevent.UPDATE, item));
				}

				this.length = this._items.length;
				if (!silent){
					this.dispatchEvent(new Tevent(Tevent.REPLACE, {
							item: item,
							newItem: newItem
					}));
					this.dispatchEvent(new Tevent(Tevent.CHANGE, {
							action: "REPLACE",
							item: item,
							newItem: newItem
					}));
				}
		},
	
		replaceItem: function(item, newItem, silent) {
				if (item == newItem)
						return;

				var indx = this._getItemIndex(item, this._source);
				if (indx > -1)
						this._source[indx] = newItem;

				indx = this.getItemIndex(item);
				if (indx > -1) {
						if (this.filterFunction == null) {
								this._replaceItem(indx, item, newItem, silent);
						} else {
								if (this.filterFunction(newItem)) {
										//Filtre OK
										this._replaceItem(indx, item, newItem, silent);

								} else {
										//Filtre KO
										this._removeItemAt(indx, newItem, silent);
								}
						}

				}
		},
		_addItemAt: function(indx, item, silent) {
	
				if (this.key != null) {
						if (typeof this._byId[item[this.key]] != "undefined") {
								throw "Key already in collection: " + item[this.key];
						}
						this._byId[item[this.key]] = item;
				}

				this._items.splice(indx, 0, item);
				this.length = this._items.length;

				if (!silent){
					this.dispatchEvent(new Tevent(Tevent.ADDED, {
							item: item,
							index: indx
					}));
					this.dispatchEvent(new Tevent(Tevent.CHANGE, {
							action: "ADDED",
							item: item,
							index: indx
					}));
				}
		},

		addItem: function(item, silent) {
				this._source.push(item);

				if ((this.filterFunction == null) || (this.filterFunction(item))) {
						var indx = this.getItemIndex(item);
						if (indx == -1) {
								this._addItemAt(this.length, item, silent);
						}
				}
		},

		addItemsAt: function(items, indx, silent) 
		{
				if (indx > this.length) 
						indx = this.length;

				var position = indx;
				for (var i = 0; i < items.length; i++) {
						this._source.push(items[i]);
						if ((this.filterFunction == null) || (this.filterFunction(items[i]))) {
						
							var indx = this.getItemIndex(items[i]);
							if (indx == -1) {

									position++;
									this._addItemAt(position, items[i], silent);
							}

						}
				}			
		},

		addItems: function(items, silent) {
				this.addItemsAt(items, this.length, silent);
		},
		addItemAt: function(item, indx, silent) {
				if (indx > this.length) {
						this.addItem(item)
				} else {
						this._source.push(item);
						if ((this.filterFunction == null) || (this.filterFunction(item))) {
								this._addItemAt(indx, item, silent);
						}
				}
		},
		forEach: function(f) {
				this._items.forEach(f);
		},
		removeItems: function(mixed, silent) {
				if (typeof mixed == "function") {
						var itemsToRemove = [];
						for (var i = 0; i < this._items.length; i++)
								if (mixed(this._items[i]))
										itemsToRemove.push(this._items[i]);
				} else {
						var itemsToRemove = mixed;
				}

				for (var i = 0; i < itemsToRemove.length; i++)
						this.removeItem(itemsToRemove[i], silent);

				return itemsToRemove;
		},

		removeItem: function(item, silent) {
				if (item != null) {
						var indx = this.getItemIndex(item);
						if (indx >= 0) {
								this._removeItemAt(indx, item, silent);
						}
				} else {
						var indx = -1;
				}

				return indx;
		},

		removeItemAt: function(indx, silent) {
				var item = this.getItemAt(indx);
				if (item != null)
						this._removeItemAt(indx, item, silent);
		},

		removeAll: function(silent) {
				this._source = [];
				this._items = [];
				this._byId = {};
				this.refresh(silent);
		},

		_removeItemAt: function(indx, item, silent) {
		
				this._items.splice(indx, 1);

				var indxSource = this._getItemIndex(item, this._source);

				if (indxSource >= 0)
						this._source.splice(indxSource, 1);

				this.length = this._items.length;
				if (this.key != null)
						delete this._byId[item[this.key]];
				if (!silent){
					this.dispatchEvent(new Tevent(Tevent.DELETE, {item: item} ));
					this.dispatchEvent(new Tevent(Tevent.CHANGE, {
							action: "DELETE",
							item: item
					}));
				}
				
		}
});