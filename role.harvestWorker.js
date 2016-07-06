var SmartSource = require('root.smartSource');
var Metrics = require('other.metrics');


var HarvesterWorker = {
    spawn: function(maxCost) {
      var body_parts = [MOVE, CARRY];
      var cost = maxCost - (50 + 50); // MOVE cost + CARRY cost
      var workParts =Math.floor(cost / 100);
      for(i = 0; i < workParts; i++) {
        body_parts.push(WORK);
      }
      var newCreep = Game.spawns.Spawn1.createCreep(body_parts, "HarvestWorker "+(Game.time % 1000), {role: 'harvest_worker'});
      if (typeof newCreep != "number") { SmartSource.SourceForWorker(newCreep, Game.spawns.Spawn1.room); Metrics.addBirth(workParts*100 + 100); }
      return newCreep;
    },

    run: function(creep) {
      // console.log(creep.name + "  " + creep.memory.targetSource);
      if (creep.memory.targetSource != undefined) {
        if(creep.carry.energy < creep.carryCapacity) {
          var source = Game.getObjectById(creep.memory.targetSource);
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
          }
        }
        else {
          creep.drop(RESOURCE_ENERGY);
          Metrics.addDrain(creep.carryCapacity);
        }
      } else {
        SmartSource.SourceForWorker(creep, creep.room);
        console.log("I have no source!");
        if (creep.memory.targetSource != undefined) {
          Metrics.addSuicide();
          creep.suicide();
        }
      }
   }
};

module.exports = HarvesterWorker;
