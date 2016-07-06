var Metrics = require('other.metrics');
var GC = require('other.gc');

var PopulationControl = require('room.populationControl');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var HarvestWorker = require('role.harvestWorker');
var HarvestCarrier = require('role.harvestCarrier');

module.exports.loop = function () {
  GC.clear();

  Metrics.run();

  if(PopulationControl.DemandsMoreCarriers(Game.spawns.Spawn1.room)) {
      var newCreep = HarvestCarrier.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
      if (typeof newCreep != "number")  { console.log("Carrier Worker is born! " + newCreep); }
  } else if(PopulationControl.DemandsMoreWorkers(Game.spawns.Spawn1.room)) {
      var newCreep = HarvestWorker.spawn(Game.spawns.Spawn1.room.energyCapacityAvailable);
      if (typeof newCreep != "number")  { console.log("Harvest Worker is born! " + newCreep); }
  } else if(PopulationControl.DemandsMoreUpgraders(Game.spawns.Spawn1.room)) {
      var newCreep = Game.spawns.Spawn1.createCreep([WORK, MOVE, CARRY, CARRY], "Upgrader "+(Game.time % 1000), {role: 'upgrader'});
  } else if(PopulationControl.DemandsMoreBuilders(Game.spawns.Spawn1.room)) {
      var newCreep = Game.spawns.Spawn1.createCreep([WORK, MOVE, CARRY, CARRY], "Builder "+(Game.time % 1000), {role: 'builder'});
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
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
          roleBuilder.run(creep);
      }
  }
}
