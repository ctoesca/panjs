defineClass("Ttimer", "core.events.TeventDispatcher",
{ 
	delay: null,
	running: false,
	_token:null,
  count: 0,
	constructor: function(args) { 
		Ttimer._super.constructor.call(this,args);	

		  if (!defined(args, "delay"))
        throw "delay argument is mandatory";

      if (defined(args, "onTimer"))
        this.on(Ttimer.ON_TIMER, args.onTimer);

		  this.delay = args.delay;
    },

    start: function()
    {
      if (this.delay == null)	
        throw "delay is null";

  		if (!this.running){
        this.running = true;
        this._settimeout();
      }
  	},

  	reset: function(){
      if (this.running)
        this._settimeout();
      this.count = 0;
  	},

  	_settimeout: function(){
		    this._token = Math.random();
        delay(this._onTimer.bind(this), this.delay, this._token);
  	},

  	stop: function(){
      this.running = false;
      this.count = 0;
  	},
    
  	_onTimer: function(token)
  	{
      if ((this.running)&&(this._token == token))
      {
        var evt = new Tevent(Ttimer.ON_TIMER, {});
        this.dispatchEvent(evt);
        this.count ++;
        this._settimeout();  
      }
  	}
});
//Ttimer events types:
Ttimer.ON_TIMER = "ON_TIMER";