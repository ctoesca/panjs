
__CLASSPATH__="panjs.helpers.ArrayTools";
defineStaticClass("ArrayTools", "panjs.core.Tobject",
{
    constructor: function(args){
        this._super.constructor.call(this, args);
    },
      
    shuffleArray: function(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    },

    moveItem: function(array, fromIndex, toIndex) 
    {
      if (fromIndex != toIndex)
      {
          var element = array[fromIndex];
          array.splice(fromIndex, 1);
          array.splice(toIndex, 0, element);
          return true;
      }
      else{
        return false;
      }
    }


});
