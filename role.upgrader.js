var PopulationControl = require('room.populationControl');
var Metrics = require('other.metrics');
var CapacityObject = require('root.capacityObject');


var roleUpgrader = {
    spawn: function(maxCost) {
      var body_parts = [WORK, MOVE, CARRY];
      var energy = maxCost - BODYPART_COST[MOVE] - BODYPART_COST[WORK] - BODYPART_COST[CARRY];
      var next_part = WORK;
      while(energy >= BODYPART_COST[next_part]) {
        energy -= BODYPART_COST[next_part];
        body_parts.push(next_part);
        if (next_part == WORK) {
          next_part = CARRY;
        } else if (next_part == MOVE) {
          next_part = WORK;
        } else {
          next_part = MOVE;
        }
      }
      var newCreep = Game.spawns.Spawn1.createCreep(body_parts, "Upgrader "+(Game.time % 1000), {role: 'upgrader'});
      if (typeof newCreep != "number") { Metrics.addBirth(maxCost - energy); }
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
            // if(creep.repair(Game.getObjectById("577ce76b822b2e681255df59")) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(Game.getObjectById("577ce76b822b2e681255df59"));
            // }
        }
        else {
          var targets;
          var storageTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && CapacityObject.notEmpty(structure);
            }
          });

          if (storageTargets.length == 0 && PopulationControl.CanTakeFromSpawn(creep.room)) {
            targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && CapacityObject.notEmpty(structure);
                    }
            });
          } else if (storageTargets.length != 0) {
            targets = storageTargets;
          }

          targets = _.sortBy(targets, function(x) {
            return creep.pos.getRangeTo(x.pos);
          });
          var target = targets[0];

          if (target != undefined) {
            if(CapacityObject.transferEnergy(target, creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
          }
        }
	}
};

module.exports = roleUpgrader;
