var Metrics = require('other.metrics');
var GC = require('other.gc');

var PopulationControl = require('room.populationControl');

var Harvester = require('role.harvester');
var Upgrader = require('role.upgrader');
var Builder = require('role.builder');

var HarvestWorker = require('role.harvestWorker');
var HarvestCarrier = require('role.harvestCarrier');

module.exports.loop = function () {
  GC.clear();

  Metrics.run(Game.spawns.Spawn1.room);

  if(PopulationControl.DemandsMoreCarriers(Game.spawns.Spawn1.room)) {
      var newCreep = HarvestCarrier.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
      if (typeof newCreep != "number")  { console.log("Carrier Worker is born! " + newCreep); }
  } else if(PopulationControl.DemandsMoreWorkers(Game.spawns.Spawn1.room)) {
      var newCreep = HarvestWorker.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
      if (typeof newCreep != "number")  { console.log("Harvest Worker is born! " + newCreep); }
  } else if(PopulationControl.DemandsMoreUpgraders(Game.spawns.Spawn1.room)) {
      var newCreep = Upgrader.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
  } else if(PopulationControl.DemandsMoreBuilders(Game.spawns.Spawn1.room)) {
      var newCreep = Builder.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
  }



  for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.role == 'harvest_worker') {
          HarvestWorker.run(creep);
      }
      if(creep.memory.role == 'harvest_carrier') {
          HarvestCarrier.run(creep);
      }
      if(creep.memory.role == 'harvester') {
          Harvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          Upgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
          Builder.run(creep);
      }
  }
}
