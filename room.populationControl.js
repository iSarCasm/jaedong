var SmartSource = require('root.smartSource');

var CitizenControl = {
  DemandsMoreCarriers: function(room) {
      var worker = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_worker');
      var carrier = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_carrier');
    return SmartSource.NeedsCarriers(room) && worker.length > carrier.length;
  },

  DemandsMoreWorkers: function(room) {
    return SmartSource.NeedsWorkers(room);
  },

  DemandsMoreUpgraders: function(room) {
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    return upgraders.length < 8;
  },

  DemandsMoreBuilders: function(room) {
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    return builders.length < 8;
  },

  CanTakeFromSpawn: function(room) {
    return !(this.DemandsMoreCarriers(room) || this.DemandsMoreWorkers(room));
  }
};

module.exports = CitizenControl;
