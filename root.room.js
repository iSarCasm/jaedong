var Room = {
  maxDrain: function(room, ticks) {
    console.log("drain");
    console.log(ticks);
    console.log(ENERGY_REGEN_TIME);
    console.log(room.find(FIND_SOURCES).length);
    console.log(room.find(FIND_SOURCES)[0].energyCapacitynumber);
    return ticks / ENERGY_REGEN_TIME * room.find(FIND_SOURCES).length * room.find(FIND_SOURCES)[0].energyCapacitynumber;
  }
};

module.exports = Room;
