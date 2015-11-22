defineStaticClass("EncodeTools", "panjs.core.Tobject",
{
  constructor: function(args){
    this._super.constructor.call(this, args);
  },

  base64encode: function(input)
  {
    var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    if (typeof input !== 'string') 
      return input;
       
    if (typeof window.btoa !== 'undefined') 
      return window.btoa(input);
    var output = "", a, b, c, d, e, f, g, i = 0;
   
    while (i < input.length) {
          a = input.charCodeAt(i++);
          b = input.charCodeAt(i++);
          c = input.charCodeAt(i++);
          d = a >> 2;
          e = ((a & 3) << 4) | (b >> 4);
          f = ((b & 15) << 2) | (c >> 6);
          g = c & 63;
   
          if (isNaN(b)) f = g = 64;
          else if (isNaN(c)) g = 64;
   
          output += map.charAt(d) + map.charAt(e) + map.charAt(f) + map.charAt(g);
    }
   
    return output;
  },
    
  base64decode: function(input)
  {
    if (typeof input !== 'string') return input;
      else input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    if (typeof window.atob !== 'undefined') 
      return window.atob(input);
    
    var output = "", a, b, c, d, e, f, g, i = 0;

    while (i < input.length) {
          d = map.indexOf(input.charAt(i++));
          e = map.indexOf(input.charAt(i++));
          f = map.indexOf(input.charAt(i++));
          g = map.indexOf(input.charAt(i++));
   
          a = (d << 2) | (e >> 4);
          b = ((e & 15) << 4) | (f >> 2);
          c = ((f & 3) << 6) | g;
   
          output += String.fromCharCode(a);
          if (f != 64) output += String.fromCharCode(b);
          if (g != 64) output += String.fromCharCode(c);
    }

    return output;
  }

});
