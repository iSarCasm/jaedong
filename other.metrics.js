var Citizen = require('root.citizen');

var Metrcis = {
  localInterval: 50,
  glovalInterval: 500,

  run: function() {
    if (Game.time > Memory.lastLocalMetricsTick + this.localInterval) {
      tick = Memory.lastLocalMetricsTick;
      Memory.lastLocalMetricsTick = Game.time;

      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
      var harvest_workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_worker').length;
      var harvest_carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_carrier').length;

      var harvestersCost = _.reduce(_.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'), function(sum, n) {
        return sum + Citizen.cost(n);
      }, 0);

      var message = "Metrics for ticks " + tick + " - " + Game.time + ":\n";
      message += "=== Population ===\n";
      message += "    Total: " + (Game.creeps.length) + "\n";
      message += "    Harvest Workers: " + harvest_workers + "\n";
      message += "    Harvest Carriers: " + harvest_carriers + "\n";
      message += "    Harvesters: " + harvesters + "\n";
      message += "    Upgraders: " + upgraders + "\n";
      message += "    Builders: " + builders + "\n";
      message += "=== Economy ===\n";
      message += "    Income: " + Memory.localIncome + "\n";
      message += "    Income per Harvester: " + (Memory.localIncome / harvesters) + "\n";
      message += "    Harvesters net worth: " + harvestersCost + "\n";
      message += "    Harvesting Effectivness: " + (Memory.localIncome / harvestersCost) + "\n";
      console.log(message);

      if (Game.time > Memory.lastGlobalMetricsTick + this.glovalInterval) {
        tick = Memory.lastGlobalMetricsTick;
        Memory.lastGlobalMetricsTick = Game.time;

        message = "Metrics for ticks " + tick + " - " + Game.time + ":\n";
        message += "=== Population ===\n";
        message += "    Total: " + (Game.creeps.length) + "\n";
        message += "    Harvest Workers: " + harvest_workers + "\n";
        message += "    Harvest Carriers: " + harvest_carriers + "\n";
        message += "    Harvesters: " + harvesters + "\n";
        message += "    Upgraders: " + upgraders + "\n";
        message += "    Builders: " + builders + "\n";
        message += "=== Economy ===\n";
        message += "    Income: " + Memory.globalIncome + "\n";
        message += "    Income per Harvester: " + (Memory.globalIncome / harvesters) + "\n";
        message += "    Harvesters net worth: " + harvestersCost + "\n";
        message += "    Harvesting Effectivness: " + (Memory.globalIncome / harvestersCost) + "\n";

        Game.notify(message);
        console.log("Email sent.");
        this.resetGlobal();
      }
      this.resetLocal();
    }
  },

  addIncome: function(income) {
    Memory.localIncome += income;
    Memory.globalIncome += income;
  },

  resetLocal: function() {
    Memory.localIncome = 0;
  },

  resetGlobal: function() {
    Memory.globalIncome = 0;
  }
};

module.exports = Metrcis;
