var Citizen = {
  cost: function(creep) {
    var totalCost = 0;
    _.forEach(creep.body, function(part) {
      switch(part.type) {
        case WORK:
            totalCost += 100;
            break;
        case CARRY:
            totalCost += 50;
            break;
        case MOVE:
            totalCost += 50;
            break;
      }
    });
    return totalCost;
  },

  isHarvester: function(creep) {
    switch(creep.memory.role) {
      case "harvester":
        return true;
      case "harvest_worker":
        return true;
      case "harvest_carrier":
        return true;
      default:
        return false;
    }
  },

  isUpgrader: function(creep) {
    return creep.memory.role == "upgrader";
  },

  isBuilder: function(creep) {
    return creep.memory.role == "builder";
  }
};

module.exports = Citizen;
