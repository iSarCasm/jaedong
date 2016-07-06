var CapacityObject = {
  notFull: function(structure) {
    switch(structure.structureType) {
      case STRUCTURE_SPAWN:
        return structure.energy < structure.energyCapacity;
      case STRUCTURE_EXTENSION:
        return structure.energy < structure.energyCapacity;
      case STRUCTURE_CONTAINER:
        return structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
    }
  },

  notEmpty: function(structure) {
    switch(structure.structureType) {
      case STRUCTURE_SPAWN:
        return structure.energy > 0;
      case STRUCTURE_EXTENSION:
        return structure.energy > 0;
      case STRUCTURE_CONTAINER:
        return structure.store[RESOURCE_ENERGY] > 0;
    }
  },

  transferEnergy: function(structure, target) {
    switch(structure.structureType) {
      case STRUCTURE_SPAWN:
        return structure.transferEnergy(target, target.carryCapacity);
      case STRUCTURE_EXTENSION:
        return structure.transferEnergy(target, target.carryCapacity);
      case STRUCTURE_CONTAINER:
        return structure.transfer(target, RESOURCE_ENERGY, target.carryCapacity);
    }
  }
};

module.exports = CapacityObject;
