var PopulationControl = require('room.populationControl');
var Metrics = require('other.metrics');

var roleUpgrader = {
    spawn: function(maxCost) {
      var newCreep = Game.spawns.Spawn1.createCreep([WORK, MOVE, CARRY, CARRY], "Upgrader "+(Game.time % 1000), {role: 'upgrader'});
      if (typeof newCreep != "number") { Metrics.addBirth(); }
      return newCreep;
    },


    run: function(creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else if (PopulationControl.CanTakeFromSpawn(creep.room)) {
          var targets = creep.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_EXTENSION ||
                              structure.structureType == STRUCTURE_SPAWN ||
                              structure.structureType == STRUCTURE_STORAGE) && structure.energy >= creep.carryCapacity;
                  }
          });
          var target = targets[0];
          if (target != undefined) {
            if(target.transferEnergy(creep, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
          }
        }
	}
};

module.exports = roleUpgrader;
