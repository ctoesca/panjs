defineStaticClass("IpTools", "panjs.core.Tobject",
{
    constructor: function(args){
        this._super.constructor.call(this, args);
    },
      
    long2ip: function(ip) {
          //  discuss at: http://phpjs.org/functions/long2ip/
          // original by: Waldo Malqui Silva
          //   example 1: long2ip( 3221234342 );
          //   returns 1: '192.0.34.166'

          if (!isFinite(ip))
            return false;

          return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
    },
    ip2long: function(IP) {
      //  discuss at: http://phpjs.org/functions/ip2long/
      // original by: Waldo Malqui Silva
      // improved by: Victor
      //  revised by: fearphage (http://http/my.opera.com/fearphage/)
      //  revised by: Theriault
      //   example 1: ip2long('192.0.34.166');
      //   returns 1: 3221234342
      //   example 2: ip2long('0.0xABCDEF');
      //   returns 2: 11259375
      //   example 3: ip2long('255.255.255.256');
      //   returns 3: false

      var i = 0;
      // PHP allows decimal, octal, and hexadecimal IP components.
      // PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
      IP = IP.match(
        /^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i
      ); // Verify IP format.
      if (!IP) {
        return false; // Invalid format.
      }
      // Reuse IP variable for component counter.
      IP[0] = 0;
      for (i = 1; i < 5; i += 1) {
        IP[0] += !! ((IP[i] || '')
          .length);
        IP[i] = parseInt(IP[i]) || 0;
      }
      // Continue to use IP for overflow values.
      // PHP does not allow any component to overflow.
      IP.push(256, 256, 256, 256);
      // Recalculate overflow of last component supplied to make up for missing components.
      IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
      if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
        return false;
      }
      return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
    },

    cidrToRange: function(cidr) {
       var range = [2];
       cidr = cidr.split('/');
       var cidr_1 = parseInt(cidr[1]);

       var ip_long = this.ip2long(cidr[0]);
       if (ip_long == false)
        return [null, null];

       var ip1_long = ip_long & ((-1 << (32 - cidr_1)));
      
       var ip2_long = ip1_long + Math.pow(2, (32 - cidr_1)) - 1;
       var count = ip2_long - ip1_long;

       range[0] = this.long2ip( ip1_long );
       range[1] = this.long2ip( ip2_long );
       range[2] = count;

       return range;
    }


});
