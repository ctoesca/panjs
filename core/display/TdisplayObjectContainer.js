__CLASSPATH__ = "panjs.core.display.TdisplayObjectContainer";
defineClass("TdisplayObjectContainer", "panjs.core.display.TdisplayObject", {

    _statesElements: null,
    currentState: null,
    defaultState: null,
    _bindElements: null,
    __bindings: null,
    _children: null,

    constructor: function(args) {
        this._bindElements = [];
        this.__bindings = {
            html: []
        };

        TdisplayObjectContainer._super.constructor.call(this, args);
        if (this._children == null)
            this._children = [];

        this._children = [];
        this._statesElements = [];
        this.currentState = [];

        if (defined(this.html) && (this.html.trim() != "")) 
        {
            this.container.html(this.html);
            this._populateElements(this.container[0], true);
        }
        if (this._statesElements.length > 0) {
            this.setState([]);
        }
        //logger.debug("init TdisplayObjectContainer: "+this.className+". args="+args);
    },

    bindEvent: function(el, evtName, on_evt_attr, compo) {

        if (on_evt_attr.startsWith("{{")) {
            var script = on_evt_attr.rightOf("{{").leftOf("}}");
            var f = new Function(script).bind(this);
            el.on(evtName, f);
        } else {

            var script = 'arguments[0].on("' + evtName + '", ' + on_evt_attr + '.bind(this));';
            var sl = new Function(script).bind(this);

            if (!compo) {
                sl(el, evtName);
            } else {
                sl(compo, evtName);
            }
        }
        //this._bindElements.push(el);		
    },

    bindEvents: function(el, compo) {

        if (arguments.length == 1)
            var compo = null;

        for (var i = 0; i < el[0].attributes.length; i++) {
            var attrName = el[0].attributes[i].nodeName;

            if (attrName.indexOf("data-on") === 0) {

                var on_evt_attr = el[0].attributes[i].value;
                var evtName = attrName.substr(7);
                this.bindEvent(el, evtName, on_evt_attr, compo);
            }
        }
        //this.bind(el);
    },

    bind: function(el) {
        /*var html = el.html();
        if (html.match(/\{\{.*\}\}/))
        {
        	var tempFn = doT.template(html).bind(this);
        	this.__bindings.html.push({template: html, element: el, tempFn: tempFn});
        }*/
    },

    renderBindings: function() {
        for (var i = 0; i < this.__bindings.html.length; i++) {
            var b = this.__bindings.html[i];

            try {
                //logger.error("RENDER "+b.template+" => "+b.tempFn(this));
                b.element.html(b.tempFn(this));
            } catch (err) {
                logger.error(err);
            }
        }
    },
    createComponent: function(classPath, args) {
        var compo = TdisplayObjectContainer._super.createComponent(classPath, args);
        if (this._children == null)
            this._children = [];
        this._children.push(compo);
       /*<ENV:dev>*/
        panjs.capture("createComponent",{classPath: classPath, componentId: compo.id, from: {id: this.id, className: this.className, classPath: this.classPath}});
        /*</ENV:dev>*/
        return compo;
    },

    free: function() {
     

        if (this._children != null) {
           
            for (var i = 0; i < this._children.length; i++) {
                this._children[i].free();                
            }

            this._children = null;
        }
        //inutile de désaffecter les events sur les objets jquery car remove() le fait.
        //!!par contre, ce n'est pas le cas pour les composants panjs (il faut appeler free() sur tous les compo)

        TdisplayObjectContainer._super.free.call(this);
    },
    __OnPropChanged: function(propName, oldValue, newValue, object) {
        //logger.debug("__OnPropChanged : propName = "+propName+", oldValue = "+oldValue+", newValue = "+newValue);
        this.renderBindings();
    },

    processStates: function(element) {
        var includeIn = element.getAttribute("data-include-in");
        if (includeIn != null)
            includeIn = includeIn.split(" ");
        var includeLogic = element.getAttribute("data-include-logic") || "OR";

        var excludeFrom = element.getAttribute("data-exclude-from");
        if (excludeFrom != null)
            excludeFrom = excludeFrom.split(" ");
        var excludeLogic = element.getAttribute("data-exclude-logic") || "OR";


        if ((excludeFrom != null) && (includeIn != null))
            throw "'excludeFrom' and 'includeIn' attributes are exclusive";

        if ((includeIn != null) || (excludeFrom != null)) {
            var isCompo = (element.getAttribute("data-compo") != null);
            var loaded = (element.getAttribute("data-loaded") == "true");

            var obj = {
                display: element.style.display,
                loaded: loaded,
                isCompo: isCompo,
                visible: null,
                elem: element,
                excludeLogic: excludeLogic,
                includeLogic: includeLogic,
                id: element.getAttribute("id"),
                includeIn: includeIn,
                excludeFrom: excludeFrom
            };

            this._statesElements.push(obj);

        }
    },

    stateExists: function(state) {
        var r = false;
        if ((state == null) || (state == ""))
            return false;

        for (var i = 0; i < this._statesElements.length; i++) {
            var s = this._statesElements[i];
            if ((s.includeIn != null) && (s.includeIn.indexOf(state) >= 0)) {
                r = true;
                break;
            } else
            if ((s.excludeFrom != null) && (s.excludeFrom.indexOf(state) >= 0)) {
                r = true;
                break;
            }
        }
        return r;
    },
    _onSubComponentLoaded: function(compo, el, args) {

        this._children.push(compo);

        var originalId = compo.container.attr("data-original-id");

        //panjs._setDOMId(compo.container[0], originalId, compo.classPath);

        /* el est l'élément Jquery d'origine */
        this.bindEvents(el, compo);



        if (originalId)
            this[originalId] = compo;

        for (var i = 0; i < this._statesElements.length; i++) {
            var obj = this._statesElements[i];
            if (obj.elem == el[0]) {

                obj.loaded = true;
                obj.elem = compo.container[0];

                this.setStatesAttributes(el[0], obj.elem);

                break; //On considère qu'un id n'est utilisé qu'une seule fois dans un composant.
            }
        }

        /*<ENV:dev>*/
        if (panjs.capture)
        panjs.capture("createComponent",{classPath: compo.classPath, componentId: compo.id, from: {id: this.id, className: this.className, classPath: this.classPath}});
        /*</ENV:dev>*/
    },

    getChildren: function() {
        return this._children;
    },
    findComponents: function(classPath) {
        var r = $([]);
        if (arguments.length == 0)
            var selector = '[data-compo]';
        else
            var selector = '[data-compo*="' + classPath + '"]';

        this.container.find(selector).each(function(indx, el) {
            if (el.isCompo())
                r.push(el.owner);
        });
        return r;
    },

    setStatesAttributes: function(sourceElem, destElem) {
        if (sourceElem.getAttribute("data-include-in"))
            destElem.setAttribute("data-include-in", sourceElem.getAttribute("data-include-in"));

        if (sourceElem.getAttribute("data-include-logic"))
            destElem.setAttribute("data-include-logic", sourceElem.getAttribute("data-include-logic"));

        if (sourceElem.getAttribute("data-exclude-from"))
            destElem.setAttribute("data-exclude-from", sourceElem.getAttribute("data-exclude-from"));

        if (sourceElem.getAttribute("data-exclude-logic"))
            destElem.setAttribute("data-exclude-logic", sourceElem.getAttribute("data-exclude-logic"));
    },
    _setStateElementVisible: function(visible, stateObj, opt) {
        var r = false;

        //logger.error("_setStateElementVisible visible="+visible+", isCompo="+stateObj.isCompo+", loaded="+stateObj.loaded+", id="+stateObj.id+", elem.compo="+stateObj.elem.compo);

        if (stateObj.visible != visible) {

            r = true;
            var el = $(stateObj.elem);

            if (visible) {
                //affichage de l'élément
                if (stateObj.isCompo) {


                    // composant			
                    if (!stateObj.loaded) {
                        var compo = el.load();
                        compo.show(opt);
                        //logger.error("SHOW "+compo.id);
                    } else {
                        stateObj.elem.compo.show(opt);
                        //logger.error("SHOW "+stateObj.elem.compo.id);
                    }

                } else {
                    // objet jquery
                    if (defined(opt, "showFn")) {

                        opt.showFn(el, stateObj);
                    } else {

                        el.show(opt);
                        if (stateObj.display != "none")
                            el.css("display", stateObj.display);

                        /*var oldDisplay = el.css("display");
                        el.show(opt); 
                        if (oldDisplay != "none")
                        	el.css("display", oldDisplay);*/

                    }
                }
            } else {

                if (stateObj.isCompo) {
                    // composant	

                    if (!stateObj.loaded) {
                        if (defined(opt, "hideFn"))
                            opt.hideFn(el, stateObj)
                        else
                            el.hide(opt);
                    } else {
                        stateObj.elem.compo.hide(opt);
                        //logger.error("HIDE "+stateObj.elem.compo.id);
                    }
                } else {
                    // objet jquery
                    if (defined(opt, "hideFn")) {
                        opt.hideFn(el, stateObj);
                    } else {
                        //stateObj.oldDisplay = el.css("display");
                        //logger.error("_setStateElementVisible "+visible+" "+stateObj.id+" oldDisplay="+oldDisplay);

                        //if (stateObj.oldDisplay != "none")
                        el.hide(opt);
                    }
                }
            }

            stateObj.visible = visible;
        }
        return r;
    },

    hasState: function(state) {
        var r = false;

        if (typeof state == "string") {
            for (var j = 0; j < this.currentState.length; j++) {
                if (this.currentState[j] == state) {
                    r = true;
                    break;
                }
            }
        } else {
            logger.error("hasState error: state is undefined");
        }

        return r;
    },
    toggleState: function(state, value, opt) {
        var changed = false;
        if (arguments.length == 1) {
            var value = !this.hasState(state);
        } else {
            if (arguments.length == 2) {
                if (typeof value != "boolean") {
                    opt = value;
                    var value = !this.hasState(state);
                }
            }
        }

        if (value == false) {
            changed = this.removeState(state, opt);
        } else {
            changed = this.addState(state, opt);
        }
        return changed;
    },
    addState: function(state, opt) {

        var changed = false;

        if (typeof state == "string") {
            var currentState = [];
            var found = false;


            for (var j = 0; j < this.currentState.length; j++) {
                if (this.currentState[j] == state) {
                    found = true;
                } else {
                    currentState.push(this.currentState[j]);
                }
            }

            if (!found) {
                changed = true;
                currentState.push(state);
                this.setState(currentState, opt);
            }
        } else {
            logger.error("addState error: state is undefined");
        }

        return changed;
    },
    removeState: function(state, opt) {

        var changed = false;

        if (typeof state == "string") {
            var currentState = [];

            for (var j = 0; j < this.currentState.length; j++) {
                if (this.currentState[j] != state)
                    currentState.push(this.currentState[j]);
                else
                    changed = true;
            }
            if (changed)
                this.setState(currentState, opt);

        } else {
            logger.error("removeState error: state is undefined");
        }
        return changed;

    },
    setState: function(mixed, opt) {
        /*
        	- On affiche les éléments ayant includeIn = un des states passé en argument
        	- On cache les éléments ayant excludeFrom = un des states passé en argument
        	*/

        var newStatesHash = {};
        var oldStatesHash = {};


        var changed = false;
        if (typeof mixed == 'string') {

            var states = [mixed];
            newStatesHash[mixed] = 1;

        } else {

            var states = mixed;
            for (var i = 0; i < states.length; i++)
                if (states[i] != undefined)
                    newStatesHash[states[i]] = 1;
                else
                    logger.error("setState error: state is undefined");
        }



        var oldStates = this.currentState;
        for (var i = 0; i < this.currentState.length; i++) {
            this.container.removeClass(this.currentState[i]);
            oldStatesHash[this.currentState[i]] = 1;
        }

        this.currentState = [];

        for (var j = 0; j < this._statesElements.length; j++) {
            var el = this._statesElements[j];

            var included = true;
            var excluded = true;

            if (el.includeIn != null) {
                excluded = null;
                included = true;

                for (var i = 0; i < el.includeIn.length; i++) {
                    var stateName = el.includeIn[i];

                    var stateIncluded = (typeof newStatesHash[stateName] != "undefined");

                    if (el.includeLogic == "OR") {
                        included = stateIncluded;
                        if (included)
                            break;
                    } else {
                        included = included && stateIncluded;
                    }
                }
            } else if (el.excludeFrom != null) {
                excluded = false;
                included = null;
                for (var i = 0; i < el.excludeFrom.length; i++) {
                    var stateName = el.excludeFrom[i];
                    var stateIncluded = (typeof newStatesHash[stateName] != "undefined");

                    if (el.excludeLogic == "OR") {
                        excluded = stateIncluded;
                        if (excluded)
                            break;
                    } else {
                        excluded = excluded && stateIncluded;
                    }
                }
            }

            if ((included != null) || (excluded != null)) {
                var show = ((included == true) || (excluded == false));

                var ch = this._setStateElementVisible(show, el, opt);
                changed = ch || changed;
            }
        }

        this.currentState = [];
        for (var k in newStatesHash) {
            this.currentState.push(k);
            this.container.addClass(k);
        }

        if (changed) {
            if (logger.isLevelEnabled(Tlogger.TRACE))
                logger.trace(this.id + ".currentState = " + JSON.stringify(this.currentState));

            var statesAdded = [];
            for (k in newStatesHash)
                if (typeof oldStatesHash[k] == "undefined")
                    statesAdded.push(k);

            var statesRemoved = [];
            for (k in oldStatesHash)
                if (typeof newStatesHash[k] == "undefined")
                    statesRemoved.push(k);

            this.dispatchEvent(new Tevent(Tevent.STATE_CHANGED, {
                oldStates: oldStates,
                newStates: this.currentState,
                removedStates: statesRemoved,
                addedStates: statesAdded
            }));
        }

        return changed;
    },

    processElement: function(jqObject , opt){
        var el = jqObject[0];
        if (arguments.length == 1) 
            var opt = {};

        var r = this._processElement(el, jqObject.parent()[0], true);
        
        if (opt && (opt.processStates == true))
            this.setState(this.currentState);
        
        if (r == null)
            r = jqObject;

        return r;
    },

    _processElement: function(el, parent, setObject, autoload) {
        if (el.owner)
            return; 

        if (el.nodeType == 1) {
            //nodeType = ELEMENT	

            var id = el.getAttribute("id");
            var dataType = el.getAttribute("data-compo");

            var jqObj = $(el);
            var r = null;

            if (dataType == null) {
                if (!el.owner){

                    el.owner = this;
                    if ((setObject) && (id != null)) {
                        if (defined(this[id]))
                            logger.warn('1-Duplication du id "' + id + '" sur objet ' + this.className);

                        var fId = panjs.getCamelCase(id);
                        this[fId] = jqObj;
                        panjs._setDOMId(el, id, dataType);
                        //r.push(id);	
                    }
                    this.bindEvents(jqObj);
                    this.processStates(el);
                    this._populateElements(el, setObject);
                }
            } else {
                if (dataType == this.classPath) {
                    logger.error("Référence circulaire dans " + this.classPath);
                } else {

                    if (arguments.length < 4 )
                        var autoload = !(el.getAttribute("data-autoload") === "false");

                    if (autoload)
                    {
                        //creation instance du composant
                        var compo = this.createComponent(dataType, {
                            elem: el,
                            owner: this
                        });

                        compo.owner = this;

                        if ((setObject) && (id != null)) {
                            if (defined(this[id]))
                                logger.warn('2-Duplication du id "' + id + '" sur objet ' + this.className);

                            this[id] = compo;

                            panjs._setDOMId(compo.container[0], id, dataType);
                            //r.push(id);										
                        }

                        this.bindEvents(jqObj, compo);

                        jqObj.replaceWith(compo.container);

                      
                        el.setAttribute("data-loaded", "true");

                        compo.container[0].loaded = true;
                        compo.container[0].compo = compo;
                        compo.container[0].owner = this;
                      
                        this.setStatesAttributes(el, compo.container[0]);
                        this.processStates(compo.container[0]);

                        compo._triggerOnAdded();
                        r = compo;

                    } else {
                       
                        
                        if (!el.owner){

                            panjs._setDOMId(el, id, dataType);
                            jqObj[0].compo = null;
                            jqObj[0].owner = this;
                            this[id] = jqObj;

                            this.processStates(el);
                            //this._populateElements(el, setObject);    
                        }
                        
                    }

                }
            }

        } else if (el.nodeType == 8) {
            var text = "";
            text = el.textContent;
            text = text.toUpperCase();

            if (text == "CONTENT") {

                var c = document.createElement("div");
                c.setAttribute("data-class", "content");
                parent.replaceChild(c, el);
                this.content = $(c);
            }
        }
        return r;
    },
    _populateElements: function(element, setObject, autoload) {

        //logger.info("_populateElements sur "+this.className+", element.id="+element.getAttribute("id")+", nodeName="+element.nodeName);

        /*
        Renvoie un tableau contenant tous les id des éléments contenus dans "element", en récursif.
        setObject: true/false. Si false, l'élément trouvé n'est pas stocké:
        Cas du parsing de <CONTENT>: on ne veut pas que les éléments de <CONTENT> soient stockés 
        car ils appartiennet à l'objet parent.
        Exemple:
        <VBox>
        	<Label id="label1" text="OK label1"/>
        	<Label id="label2" text="OK label2"/>
        </VBox>
        La VBox et les 2 labels sont sur l'objet parent.
        Les 2 labels sont en fait injecté ici, mais ne font pas partie du template.
        */

        

        for (var i = 0; i < element.childNodes.length; i++) {
            var el = element.childNodes[i];
            if (arguments.length < 3)
                this._processElement(el, element, setObject);
            else
                this._processElement(el, element, setObject, autoload);

        }
        
    }
});

/*  STATIC */
TdisplayObjectContainer._listeIdElements = [];