/*
* 
* Web Audio API:n testailua. Koodi testattu chromella, ei takuuta toimivuudesta muilla selaimilla.  
*
*/

var oscs = [];
var destinations = {};
var filter = 0;
var ind = 0; 
var lfo = 0;


//html:sta kutsuttavat
var startLFO = function() {
  lfo.play();
}

var stopLFO = function() {
  lfo.pause();
}

var playSound = function(index) {
  oscs[index].play();
};

var stopSound = function(index) {
  oscs[index].pause();
};

var changeType = function(type, index) {
  oscs[index].oscnode.type = type;
};

var setFreq = function(freq, index) {
  console.log(index);
  oscs[index].oscnode.frequency.value = freq;
};

var setIndex = function(i) {
  ind = i;
};

var changeDestination = function(index, newDest) {
  console.log("dest: "+newDest);
  oscs[index].changeDest(newDest);
};


var incFreq = function() {
  var o = oscs[ind];

  if(ind===2) {
    o.oscnode.frequency.value += 0.5;
  } else {
    o.oscnode.frequency.value += 5;
  }

  if(ind===2 && o.oscnode.frequency.value > 60) {
    o.oscnode.frequency.value = 60; 
  }

  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
};

var decFreq = function() {
  var o = oscs[ind];
  if(ind===2) {
    o.oscnode.frequency.value -= 0.5;
  } else {
    o.oscnode.frequency.value -= 5;
  }

  if(o.oscnode.frequency.value < 0) {
    o.oscnode.frequency.value = 0; 
  }

  console.log(o.oscnode.frequency.value+" osc "+(ind+1));
};

var filterType = function(type) {
  filter.type = type;    
};

//-------------------

$( document ).ready(function() {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  var context = new AudioContext();

  createComponents(context);
  populateDests();

  $(document).keydown(function(e) {
    if(e.keyCode === 90) {
      decFreq();
    }

    if(e.keyCode === 88) {
      incFreq();
    }

  });

  $("#osc1_gain").change(function(e) {
    oscs[0].gainNode.gain.value = this.value;
  });

  $("#osc2_gain").change(function(e) {
    oscs[1].gainNode.gain.value = this.value;
  });

  $("#filter_freq").change(function(e) {
    filter.frequency.value = this.value;
    console.log(filter.frequency.value);
  });

});


var populateDests = function() {
  destinations["osc1_freq"] = oscs[0].oscnode.frequency;
  destinations["osc1_gain"] = oscs[0].oscGain.gainNode.gain;
  destinations["osc2_freq"] = oscs[1].oscnode.frequency;
  destinations["osc2_gain"] = oscs[1].oscGain.gainNode.gain;
  destinations["filter"] = filter;
};


var createComponents = function(context) {
  filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.connect(context.destination);
  console.log(filter.frequency.value);
  console.log(filter.frequency);

  var osc1 = new Osc(context, context.destination);
  oscs.push(osc1);
  var osc2 = new Osc(context, filter);
  oscs.push(osc2); 

  lfo = new Osc(context, osc1.oscnode.frequency);
  lfo.oscnode.frequency.value = 5; 
  lfo.oscGain.gainNode.gain.value = 20;
  oscs.push(lfo);
};


