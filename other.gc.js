var Metrics = require('other.metrics');

var GC = {
  clear: function() {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          Metrics.addDeath();
          delete Memory.creeps[name];
          console.log('Clearing non-existing creep memory:', name);
      }
    }
  }
};

module.exports = GC;
