/*
* 
* Web Audio API:n testailua. Koodi testattu chromella, ei takuuta toimivuudesta muilla selaimilla.  
*
*/

var oscs = [];
var filter = 0;
var ind = 0; 

$( document ).ready(function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var context = new AudioContext();

    createComponents(context);

    $(document).keydown(function(e) {
        if(e.keyCode === 90) {
            decFreq();
        }
        if(e.keyCode === 88) {
            incFreq();
        }
    });

    $("#osc1_gain").change(function(e) {
      var o = oscs[0];
      o.changeGain(this.value);
    });

    $("#osc2_gain").change(function(e) {
      var o = oscs[1];
      o.changeGain(this.value);
    });

});

var createComponents = function(context) {
  filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.connect(context.destination);

  var osc1 = new Osc(context, context.destination);
  oscs.push(osc1);
  var osc2 = new Osc(context, filter);
  oscs.push(osc2);   
}


var playSound = function(index) {
    oscs[index].play();
}

var stopSound = function(index) {
    oscs[index].pause();
}

var changeType = function(type, index) {
  oscs[index].oscnode.type = type;
}

var setFreq = function(freq, index) {
  console.log(index);
  oscs[index].oscnode.frequency.value = freq;
}

var setIndex = function(i) {
    ind = i;
}

var changeDestination = function(index, newDest) {
  console.log("dest: "+newDest);
  oscs[index].changeDest(newDest);
}


var incFreq = function() {
  var o = oscs[ind];
  o.oscnode.frequency.value +=5

  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
}

var decFreq = function() {
  var o = oscs[ind];
  o.oscnode.frequency.value -= 5

  if(o.oscnode.frequency.value < 0) {
    o.oscnode.frequency.value = 0; 
  }

  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
}

var filterType = function(type) {
    filter.type = type;    
}

var Osc = function(context, dest) {
  this.oscGain = new Gain(context, dest);
  this.gainNode = this.oscGain.gainNode;
  this.destination = dest;
  this.context = context;
  this.oscnode = context.createOscillator();
  this.oscnode.type = "sawtooth";
  this.oscnode.frequency.value = 120;
  this.started = false;
} 

var Gain = function(context, dest) {
  this.destination = dest;
  this.context = context;
  this.gainNode = context.createGain();
  this.gainNode.gain.value = 0.5;
}


Osc.prototype.changeDest = function(newDest) {
  if(newDest==="filter") {
    this.destination = filter;
    console.log("dest: filter");
  } 
  else {
    this.destination = this.context.destination;
    console.log("dest: speakers");
  }
}

Osc.prototype.changeGain = function(value) {
  console.log(value);
  this.gainNode.gain.value = value;
}


Osc.prototype.play = function() {
  console.log("play to dest: "+ this.destination);
  
  this.oscnode.connect(this.gainNode);
  this.gainNode.connect(this.destination);

  if(!this.started) {
    this.oscnode.start(0);
    this.started = true;
  }
}

Osc.prototype.pause = function() {
  this.gainNode.disconnect();
  this.oscnode.disconnect();
}


