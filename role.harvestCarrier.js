var Metrics = require('other.metrics');
var SmartSource = require('root.smartSource');
var CapacityObject = require('root.capacityObject');

var roleHarvester = {
  spawn: function(maxCost) {
    var body_parts = [];
    var workParts = Math.floor(maxCost / 100);
    for(i = 0; i < workParts; i++) {
      body_parts.push(MOVE);
      body_parts.push(CARRY);
    }
    var newCreep = Game.spawns.Spawn1.createCreep(body_parts, "HarvestCarrier "+(Game.time % 1000), {role: 'harvest_carrier'});
    if (typeof newCreep != "number") { SmartSource.SourceForCarrier(newCreep, Game.spawns.Spawn1.room); Metrics.addBirth(workParts * 100); }
    return newCreep;
  },

  run: function(creep) {
    if (creep.memory.targetSource != undefined) {
      if(creep.carry.energy < creep.carryCapacity) {
            var source = Game.getObjectById(creep.memory.targetSource);
            var energy = source.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy);
            }
        }
        else {
            var targets;
            var spawnTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && CapacityObject.notFull(structure);
                    }
            });

            if (spawnTargets.length == 0) {
              targets = creep.room.find(FIND_STRUCTURES, {
                      filter: (structure) => {
                                  return structure.structureType == STRUCTURE_CONTAINER && CapacityObject.notFull(structure);
                      }
              });
            } else {
              targets = spawnTargets;
            }

            targets = _.sortBy(targets, function(x) {
              return creep.pos.getRangeTo(x.pos);
            });
            var target = targets[0];
            if(targets.length > 0) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
                } else {
                  Metrics.addIncome(creep.carryCapacity);
                }
            }
        }
      } else {
        SmartSource.SourceForCarrier(creep, creep.room);
        console.log("I have no source! " + creep.name);
        if (creep.memory.targetSource == undefined) {
          creep.suicide();
        }
      }
  }
};

module.exports = roleHarvester;
