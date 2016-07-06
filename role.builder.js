var PopulationControl = require('room.populationControl');

var roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {
      if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
      }
      if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
          creep.memory.building = true;
      }

      if(creep.memory.building) {
          var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
      }
      else if (PopulationControl.CanTakeFromSpawn(creep.room))  {
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

module.exports = roleBuilder;
