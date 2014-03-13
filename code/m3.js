/*
* 
* Web Audio API:n testailua. Koodi testattu chromella, ei takuuta toimivuudesta muilla selaimilla.  
*
*/

var oscs = [];
var filter;
var ind; 
var gain;

$( document ).ready(function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();

    createComponents(context);

    $(document).keydown(function(e) {
        if(e.keyCode === 90) {
            decFreq();
        }
        if(e.keyCode === 88) {
            incFreq();
        }
    });

    $("#volume").change(function(e) {
      console.log(this.value);
      chGain(this.value);
    });

});

createComponents = function(context) {
    filter = context.createBiquadFilter();
    filter.type = "highpass";
    filter.connect(context.destination);
    gain = new Gain(context, context.destination);
    osc1 = new Osc(context, context.destination);
    oscs.push(osc1);
    osc2 = new Osc(context, filter);
    oscs.push(osc2);
}


playSound = function(index) {
    oscs[index].play();
}

stopSound = function(index) {
    oscs[index].pause();
}

setType = function(type, index) {
    oscs[index].changeType(type);
}

setFreq = function(freq, index) {
    console.log(index);
    oscs[index].setFreq(freq);
}

chGain = function(value) {
  gain.gainNode.gain.value = value;
  console.log("gain value: "+gain.gainNode.gain.value);
}

setIndex = function(i) {
    ind = i;
}

changeDestination = function(index, newDest) {
  console.log("dest: "+newDest);
  oscs[index].changeDest(newDest);
}


incFreq = function() {
  var o = oscs[ind];
  o.setFreq(o.oscnode.frequency.value +5);
  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
}

decFreq = function() {
  var o = oscs[ind];
  o.setFreq(o.oscnode.frequency.value -5);
  if(o.oscnode.frequency.value < 0) {
    o.oscnode.frequency.value = 0; 
  }

  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
}


Osc = function(context, dest) {
  this.destination = dest;
  this.context = context;
  this.oscnode = context.createOscillator();
  this.oscnode.type = "sawtooth";
  this.oscnode.frequency.value = 120;
} 

Gain = function(context, dest) {
  this.destination = dest;
  this.context = context;
  this.gainNode = context.createGain();
  this.gainNode.gain.value = 0.5;
}

Osc.prototype.changeType = function(type) {
  this.oscnode.type = type;
}

Osc.prototype.changeDest = function(newDest) {
  if(newDest==="filter") {
    this.destination = filter;
    console.log("dest: filter");
  } else if(newDest==="gain") {
    this.destination = gain.gainNode;
    console.log("dest: gain");
  } else {
    this.destination = this.context.destination;
    console.log("dest: speakers");
  }
}

Osc.prototype.setFreq = function(freq) {
  this.oscnode.frequency.value = freq;
}

Osc.prototype.play = function() {
  console.log("play to dest: "+ this.destination);
  console.log("gain value: "+gain.gainNode.gain.value);
  this.oscnode.connect(this.destination);
  if(this.destination===gain.gainNode) {
    gain.gainNode.connect(gain.destination);
    console.log("gain connected to "+gain.destination);
  } else { console.log(gain.gainNode);} 
  this.oscnode.start(0);

}

Osc.prototype.pause = function() {
  this.oscnode.disconnect();
  gain.gainNode.disconnect();
}

setFilterType = function(type) {
    filter.type = type;    
}

