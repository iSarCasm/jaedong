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
  }
};

module.exports = Citizen;
