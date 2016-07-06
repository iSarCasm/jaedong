var Room = {
  maxDrain: function(room, ticks) {
    return ticks / ENERGY_REGEN_TIME * room.find(FIND_SOURCES).length * room.find(FIND_SOURCES)[0].energyCapacitynumber;
  }
};

module.exports = Room;
