var Gain = function(context, dest) {
  this.destination = dest;
  this.context = context;
  this.gainNode = context.createGain();
  this.gainNode.gain.value = 0.5;
};

var Osc = function(context, dest) {
  this.oscGain = new Gain(context, dest);
  this.gainNode = this.oscGain.gainNode;
  this.destination = dest;
  this.context = context;
  this.oscnode = context.createOscillator();
  this.oscnode.type = "sawtooth";
  this.oscnode.frequency.value = 120;
  this.started = false;
}; 


Osc.prototype.changeDest = function(newDest) {
  if(!destinations[newDest]) {
    this.destination = this.context.destination;
    console.log("dest: speakers");
  } else {
    this.destination = destinations[newDest];
  } 
};

Osc.prototype.play = function() {
  console.log("play to dest: "+ this.destination);
  
  this.oscnode.connect(this.gainNode);
  this.gainNode.connect(this.destination);

  if(!this.started) {
    this.oscnode.start(0);
    this.started = true;
  }
};

Osc.prototype.pause = function() {
  this.gainNode.disconnect();
  this.oscnode.disconnect();
};

