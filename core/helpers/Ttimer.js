defineClass("Ttimer", "core.events.TeventDispatcher",
{ 
	delay: null,
	running: false,
	_token:null,

	constructor: function(args) { 
		Ttimer._super.constructor.call(this,args);	

		  if (!defined(args, "delay"))
        throw "delay argument is mandatory";

		  this.delay = args.delay;
    },

    start: function()
    {
      if (this.delay == null)	
        throw "delay is null";

  		if (this.running)
        return;

      this.running = true;
      this._settimeout();
  	},

  	reset: function(){
      if (this.running)
        this._settimeout();
  	},

  	_settimeout: function(){
      if (this.running == false)
        return;
		  this._token = Math.random();
      delay(this._onTimer.bind(this), this.delay, this._token);
  	},

  	stop: function(){
      this.running = false;
  	},

  	_onTimer: function(token)
  	{
      if ((!this.running)||(this._token != token))
        return;

      var evt = new Tevent(Ttimer.ON_TIMER, {});
      this.dispatchEvent(evt);
      this._settimeout();
  	}
});
Ttimer.ON_TIMER = "ON_TIMER";