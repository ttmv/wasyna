var Filter = function(context, dest) {
  this.destination = dest;
  this.context = context;
  this.filternode = context.createBiquadFilter();
  this.filternode.type = "highpass";
  this.filternode.connect(this.destination);
};
