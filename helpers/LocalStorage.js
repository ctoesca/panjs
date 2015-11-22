defineStaticClass("LocalStorage", "panjs.core.Tobject",
{
  constructor: function(args){
    this._super.constructor.call(this, args);
  },

  getUsedSpace: function() {
    return Object.keys(window.localStorage).map(function(key) { return localStorage[key].length;}).reduce(function(a,b) { return a+b;});
  },

  getTotalSpace: function() {

    var inc = "";
    while (inc.length < 100000)
      inc += "mmmmmmmmmm";

    localStorage.setItem("DATA", "");

    var r = 1;
    for(var i=0 ; i<10000 ; i++) {
        var data = localStorage.getItem("DATA");
        try {      
            localStorage.setItem("DATA", data + inc);
         
        } catch(e) {
            r = this.getUsedSpace();
            break;
        }
    }
    localStorage.removeItem("DATA");

    return r;
  }

});
