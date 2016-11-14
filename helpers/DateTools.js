defineStaticClass("DateTools", "panjs.core.Tobject",
{
    constructor: function(args){
        this._super.constructor.call(this, args);

        panjs.loadScriptSync(panjs.namespaces["panjs.core"].path+"/../lib/moment/2.9.0/min/moment.min.js");
        panjs.loadScriptSync(panjs.namespaces["panjs.core"].path+"/../lib/moment/2.9.0/locale/fr.js");
    },
 
    getFriendlyDate: function(date){

      var r = "";
      if (date){
        var now = moment();
        var r = moment(date).calendar();
      }
      return r;

    },
    getFriendlyFullDate: function(date){

      var r = "";
      if (date){
        var now = moment();
        var r = moment(date).format("LLLL");
      }
      return r;

    },
    formatDate: function(date, format){
        return moment(date).format(format);
    },
    getDateFromTimestamp: function(d, dateseparator){
        var r = "";

        if (d != null){
          if (arguments.length < 2)
            var dateseparator = "/";

          r = new Date(parseInt(d) * 1000);
          var year = r.getFullYear();
          var month = r.getMonth()+1;
          if (month < 10)
            month = "0"+month;

          var day = r.getDate();
          if (day < 10)
            day = "0"+day;

          var hour = r.getHours();
             if (hour < 10)
            hour = "0"+hour;

          var min = r.getMinutes();
             if (min < 10)
            min = "0"+min;

          var sec = r.getSeconds();
             if (sec < 10)
            sec = "0"+sec;

          r = year+dateseparator+month+dateseparator+day+" "+hour + ':' + min + ':' + sec;
        }
        return r;
    },

    createDateFromMysql: function(mysql_string)
    { 
        if (mysql_string != null)
          return moment(mysql_string, "YYYY-MM-DD HH:mm:ss");
        else
          return null;
    },

    getNonWorkingDays: function(an){
        var JourAn = new Date(an, "00", "01")
        var FeteTravail = new Date(an, "04", "01")
        var Victoire1945 = new Date(an, "04", "08")
        var FeteNationale = new Date(an,"06", "14")
        var Assomption = new Date(an, "07", "15")
        var Toussaint = new Date(an, "10", "01")
        var Armistice = new Date(an, "10", "11")
        var Noel = new Date(an, "11", "25")
        //var SaintEtienne = new Date(an, "11", "26") // ALSACE
        
        var G = an%19
        var C = Math.floor(an/100)
        var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30
        var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11))
        var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7
        var L = I - J
        var MoisPaques = 3 + Math.floor((L + 40)/44)
        var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4)
        var Paques = new Date(an, MoisPaques-1, JourPaques)
        //var VendrediSaint = new Date(an, MoisPaques-1, JourPaques-2) // ALSACE
        var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1)
        var Ascension = new Date(an, MoisPaques-1, JourPaques+39)
        var Pentecote = new Date(an, MoisPaques-1, JourPaques+49)
        var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50)
        
        return new Array(JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel)
    }

});
