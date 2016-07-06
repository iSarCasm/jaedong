var Citizen = require('root.citizen');
var Room = require('root.room');

var Metrcis = {
  localInterval: 1500,

  run: function(room) {
    if (Game.time > Memory.lastLocalMetricsTick + this.localInterval) {
      tick = Memory.lastLocalMetricsTick;
      Memory.lastLocalMetricsTick = Game.time;
      progress = Memory.lastLocalProgress;
      Memory.lastLocalProgress = room.controller.progress;

      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;

      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
      var harvest_workers = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_worker').length;
      var harvest_carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_carrier').length;

      var total = upgraders + builders + harvesters + harvest_workers + harvest_carriers;

      var harvestersCost = _.reduce(_.filter(Game.creeps, (creep) => Citizen.isHarvester(creep)), function(sum, n) {
        return sum + Citizen.cost(n);
      }, 0);

      var upgradersCost =  _.reduce(_.filter(Game.creeps, (creep) => Citizen.isUpgrader(creep)), function(sum, n) {
        return sum + Citizen.cost(n);
      }, 0);

      var buildersCost =  _.reduce(_.filter(Game.creeps, (creep) => Citizen.isBuilder(creep)), function(sum, n) {
        return sum + Citizen.cost(n);
      }, 0);

      var message1 = "Metrics for ticks " + tick + " - " + Game.time + ":\n";
      message1 += "=== Population ===\n";
      message1 += "    Total: " + total + "\n";
      message1 += "    Harvest Workers: " + harvest_workers + "\n";
      message1 += "    Harvest Carriers: " + harvest_carriers + "\n";
      message1 += "    Harvesters: " + harvesters + "\n";
      message1 += "    Upgraders: " + upgraders + "\n";
      message1 += "    Builders: " + builders + "\n";
      message1 += "\n";
      message1 += "    Creep birth: " + Memory.Birth + "\n";
      message1 += "    Creep death: " + Memory.Death + "\n";
      message1 += "    Suicides: " + Memory.Suicide + "\n";

      var message2 = "=== Economy ===\n";
      message2 += "    Income: " + Memory.Income + "\n";
      message2 += "    Gain from recycle: " + Memory.GainFromRecycle + "\n";
      message2 += "    -------------------------\n";
      message2 += "    Controller growth: " + (room.controller.progress - progress) + "\n";
      message2 += "    Spent on building: " + Memory.Building + "\n";
      message2 += "    Spent on repair: " + Memory.Repair + "\n";
      message2 += "    Spent on new creeps: " + Memory.SpentOnNewCreeps + "\n";
      message2 += "    Spent on renewal: " + Memory.SpentOnRenewal + "\n";
      message2 += "\n";
      message2 += "    Income per Harvester: " + (Memory.Income / (harvesters + harvest_workers + harvest_carriers)) + "\n";
      message2 += "    Harvesters net worth: " + harvestersCost + "\n";
      message2 += "    Harvesting Effectivness: " + (Memory.Income / harvestersCost) + "\n";
      message2 += "\n";
      message2 += "    Growth per Upgrader: " + ((room.controller.progress - progress) / upgraders) + "\n"
      message2 += "    Upgraders net worth: " + upgradersCost + "\n";
      message2 += "    Upgrading Effectivness: " + ((room.controller.progress - progress) / upgradersCost) + "\n";
      message2 += "\n";
      message2 += "    Work per Builder: " + ((Memory.Building + Memory.Repair) / builders) + "\n"
      message2 += "    Builders net worth: " + buildersCost + "\n";
      message2 += "    Building Effectivness: " + (((Memory.Building + Memory.Repair) / builders) / buildersCost) + "\n";

      var message3 = "=== Room Limits ===\n";
      message3 += "    Energy Drain: " + Memory.Drain + " / " + Room.maxDrain(room, this.localInterval) + "\n";
      message3 += "    Energy Income: " + Memory.Income + " / " + Room.maxDrain(room, this.localInterval) + "\n";

      console.log(message1);
      console.log(message2);
      console.log(message3);

      Game.notify(message1);
      Game.notify(message2);
      Game.notify(message3);

      this.reset();
    }
  },

  addDrain: function(drain) {
    Memory.Drain += drain;
  },

  addIncome: function(income) {
    Memory.Income += income;
  },

  addBuilding: function(income) {
    Memory.Building += income;
  },

  addRepair: function(income) {
    Memory.Repair += income;
  },

  addBirth: function(cost) {
    Memory.Birth += 1;
    Memory.SpentOnNewCreeps += cost;
  },

  addDeath: function() {
    Memory.Death += 1;
  },

  addSuicide: function() {
    Memory.Suicide += 1;
  },

  reset: function() {
    Memory.Income = 0;
    Memory.Building = 0;
    Memory.Repair = 0;
    Memory.Birth = 0;
    Memory.Death = 0;
    Memory.Suicide = 0;
    Memory.SpentOnNewCreeps = 0;
    Memory.SpentOnRenewal = 0;
    Memory.GainFromRecycle = 0;
    Memory.Drain = 0;
  },
};

module.exports = Metrcis;
