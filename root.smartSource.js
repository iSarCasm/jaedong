var SmartSource = {
  NearestStorage: function(source) {
    return Game.spawns.Spawn1;
  },

  SourceWorkerCapacity: function(source) {
    var capacity = 0;
    var x = source.pos.x;
    var y = source.pos.y;
    if (source.room.lookForAt("terrain", x + 1, y) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x - 1, y) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x, y + 1) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x, y - 1) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x + 1, y + 1) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x + 1, y - 1) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x - 1, y + 1) != "wall") { capacity += 1; }
    if (source.room.lookForAt("terrain", x - 1, y - 1) != "wall") { capacity += 1; }
    return capacity;
  },

  SourceCarrierCapacity: function(source) {
    var additionalDemand = 0;
    if (Memory.sources[source.id]) {
      additionalDemand += Memory.sources[source.id]["additionalDemand"];
    }
    return (this.SourceWorkerCapacity(source) * (Game.spawns.Spawn1.pos.getRangeTo(source.pos.x, source.pos.y) / 15)) + additionalDemand;
  },

  NeedsWorkers: function(room) {
    var harvest_workers =  _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_worker');
    var sources = room.find(FIND_SOURCES);
    var source = -1;
    var needed_capacity = 0;
    for(var i = 0; i < sources.length; i++) {
      needed_capacity = this.SourceWorkerCapacity(sources[i]);
      _.forEach(harvest_workers, function(worker) {
        if (worker.memory.targetSource == sources[i].id) {
          needed_capacity -= 1;
        }
      });
      if (needed_capacity > 0) {
        return true;
      }
    }
  },

  NeedsCarriers: function(room) {
    var harvest_carriers =  _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_carrier');
    var sources = room.find(FIND_SOURCES);
    var source = -1;
    var needed_capacity = 0;
    for(var i = 0; i < sources.length; i++) {
      needed_capacity = this.SourceCarrierCapacity(sources[i]);
      _.forEach(harvest_carriers, function(worker) {
        if (worker.memory.targetSource == sources[i].id) {
          needed_capacity -= 1;
        }
      });
      if (needed_capacity > 0) {
        return true;
      }
    }
  },

  SourceForWorker: function(worker, room) {
    if (worker.memory == undefined) { return; }
    var harvest_workers =  _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_worker');
    var sources = room.find(FIND_SOURCES);
    var source = -1;
    var needed_capacity = 0;
    for(var i = 0; i < sources.length; i++) {
      needed_capacity = this.SourceWorkerCapacity(sources[i]);
      _.forEach(harvest_workers, function(_worker) {
        if (_worker.memory.targetSource == sources[i].id) {
          needed_capacity -= 1;
        }
      });
      if (needed_capacity > 0) {
        source = sources[i].id;
        worker.memory.targetSource = source;
      }
    }
  },

  SourceForCarrier: function(carrier, room) {
    if (carrier.memory == undefined) { return; }
    var harvest_carriers =  _.filter(Game.creeps, (creep) => creep.memory.role == 'harvest_carrier');
    var sources = room.find(FIND_SOURCES);
    var source = -1;
    var needed_capacity = 0;
    for(var i = 0; i < sources.length; i++) {
      needed_capacity = this.SourceCarrierCapacity(sources[i]);
      _.forEach(harvest_carriers, function(_worker) {
        if (_worker.memory.targetSource == sources[i].id) {
          needed_capacity -= 1;
        }
      });
      if (needed_capacity > 0) {
        source = sources[i].id;
        carrier.memory.targetSource = source;
      }
    }
  }
};

module.exports = SmartSource;
