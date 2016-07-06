var Metrics = require('other.metrics');


var roleHarvester = {
    spawn: function(maxCost) {
      var newCreep = Game.spawns.Spawn1.createCreep([WORK, MOVE, CARRY, CARRY], "Harvester "+(Game.time % 1000), {role: 'harvester'});
      if (typeof newCreep != "number") { Metrics.addBirth(); }
      return newCreep;
    },


    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
          // console.log("My name is: " + creep.name + " and im going to SOURCE");
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            // console.log("My name is: " + creep.name + " and im going home");
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(targets[0]);
                } else {
                  Metrics.addIncome(creep.carryCapacity);
                }
            }
        }
	}
};

module.exports = roleHarvester;
