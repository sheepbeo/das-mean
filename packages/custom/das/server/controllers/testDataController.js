'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Context = mongoose.model('Context'),
	Speedup = mongoose.model('Speedup'),
	lodash = require('lodash'),
	moment = require('moment');

require("moment-duration-format");
moment().format();
var seedrandom = require('seedrandom');
var request = require('request');

var speedupController = require('./speedupServerController');
var quitController = require('./quitServerController');
var sessionController = require('./sessionServerController');
var allianceSocialActivityController = require('./allianceSocialActivityServerController');
var playerSocialActivityController = require('./playerSocialActivityServerController');


var numberOfPlayers = 1000;
var numberOfEntryPerPlayerMin = 1;
var numberOfEntryPerPlayerMax = 3;
var TimeRange = [ 60, 300, 1200, 3600, 7200, 14400, 28800, 86400 ];
//var startDate = moment('2015-8-1');
//var endDate = moment('2015-8-12');
//var saleDate = moment('2015-8-8');

var players = JSON.parse('[ { "PlayerId" : "17f94cbd-489d-4d5e-bcdd-aa0e0fa1383d", "Name" : "Dood1", "Level" : 1 }, { "PlayerId" : "184d1507-d704-4897-8f7a-597a56b81a18", "Name" : "Dood2", "Level" : 2 } ]');
var alliances = JSON.parse('[ { "AllianceId" : "17f94cbd-489d-4d5e-bcdd-aa0e0fa1383d", "Name" : "LoL1", "Level" : 1 }, { "AllianceId" : "184d1507-d704-4897-8f7a-597a56b81a18", "Name" : "LoL2", "Level" : 2 } ]');

var timeStep = 60;
var timeFormat = "DD/MM/YYYY HH:mm:ss";
var timeStartBegin = moment("01/01/2015 15:00:00", timeFormat);
var timeStartEnd = moment("01/08/2015 15:00:00", timeFormat);
var timeStartRange = (moment.duration(timeStartEnd.diff(timeStartBegin))).asSeconds();

var minNumberOfSession = 0;
var maxNumberOfSession = 0;
var minSessionLength = 0;
var maxSessionLength = 0;

var chanceStartSession = 0.1;
var chanceStopSession = 0.1;
var chanceAttack = 0.1;
var chanceEventParticipation = 0.1;
var chanceChatMessage = 0.1;
var chanceRaidParticipation = 0.1;
var chanceAllianceDonation = 0.1;
var chanceAllianceChatMessage = 0.1;

var chanceQuit = 0.002;
var chanceLeave = 0.002;


// create all
exports.createEntries = function(req,res) {
	console.log("inside create Entries");

	var result = '';
	if (req.useJsonFormat) {
		for (var i=0; i<req.resultObjects.length - 1; i++) {
			result += JSON.stringify(req.resultObjects[i]) + ',' + '\n';
		}

		result += JSON.stringify(req.resultObjects[req.resultObjects.length - 1]);
	} else {
		if (req.entrySeperator != null) {
			for (var i=0; i<req.resultObjects.length - 1; i++) {
				result += req.resultObjects[i] + req.entrySeperator;
			}

			result += req.resultObjects[req.resultObjects.length - 1];
		}
	}

	return res.send(result);
};



// create of type
exports.createEntriesOfType = function(req,res,next,id) {
	console.log("inside create Entries");

	var randomSeed = 'hello';
	if (req.query.randomSeed != null) {
		randomSeed = req.query.randomSeed;
	}

	seedrandom(randomSeed, { global: true });
	var resultObjects = [];

	var numberOfPlayer = 100;
	var numberOfAlliance = 100;

	if (req.query.playerCount != null) {
		numberOfPlayer = req.query.playerCount;
	}

	if (req.query.allianceCount != null) {
		numberOfAlliance = req.query.allianceCount;
	}

	// regenerate players:
	players = generatePlayers(numberOfPlayer);
	alliances = generateAlliances(numberOfAlliance);

	if (id == "speedup") {

		for (var i=0; i<numberOfPlayers; i++){
			var nextPlayerEntryCount = randomRangeInt(numberOfEntryPerPlayerMin, numberOfEntryPerPlayerMax);
			var playerId = createGUID();
			var level = randomRangeInt(1,10);

			for (var j=0; j<nextPlayerEntryCount; j++) {
				var context = new Context();
				var speedup = new Speedup();
				speedup = JSON.parse(JSON.stringify(speedup)); // hack model
				
				var timeTotalSeconds = TimeRange[randomRangeInt(0,TimeRange.length-1)];
				var timeLeftSeconds = timeTotalSeconds * randomRangeFloat(0,1);

				//speedup.timeStamp = new Date();

				speedup.type = "Turret";
				speedup.premiumSpent = Math.round(Math.sqrt(timeLeftSeconds) / 5) ;
				speedup.timeLeft = moment.duration(timeLeftSeconds, 'seconds').format("hh:mm:ss", { trim:false });
				speedup.timeTotal = moment.duration(timeTotalSeconds, 'seconds').format("hh:mm:ss", { trim:false });
				speedup.playerId = playerId;

				context.level = level;
				context.resource = randomRangeInt(100,1000);
				context.premium = speedup.premiumSpent + randomRangeInt(5, 15);

				speedup.context = context;

				resultObjects.push(speedup);
				speedupController.createOne(speedup, function(result) {});				
			}

		}

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();
	} else if (id == "rawAllianceSuggestionData") {

		iterate(players, function(player) {
			var alliance = alliances[randomRangeInt(0, alliances.length-1)];
			var isEnded = false;

			var startTime = moment(timeStartBegin);
			startTime.add(moment.duration(randomRangeInt(0, timeStartRange)*100));

			resultObjects.push({
				Type : "AllianceMemberEvent",
				Action : "Join",
				AllianceId : alliance.AllianceId,
				PlayerId : player.PlayerId,
				TimeStamp : startTime.format(timeFormat)
			});

			var counter = 0;
			var counterLimit = 10000;
			var sessionStarted = false;
			var currentSessionLength = 0;
			while (counter <= counterLimit) {
				if (sessionStarted) {
					// session stopped:
					if (RollChance(chanceStopSession)) {
						resultObjects.push({
							Type : "PlayerSession",
							PlayerId : player.PlayerId,
							AllianceId : alliance.AllianceId,
							TimeStamp : moment(startTime).add(counter, 's').format(timeFormat),
							LengthInSeconds : currentSessionLength
						});

						sessionStarted = false;
						currentSessionLength = 0;
					} else {
						if (RollChance(chanceAttack)) {
							resultObjects.push({
								Type : "Attack",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceEventParticipation)) {
							resultObjects.push({
								Type : "EventParticipation",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceChatMessage)) {
							resultObjects.push({
								Type : "ChatMessage",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceRaidParticipation)) {
							resultObjects.push({
								Type : "RaidParticipation",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceAllianceDonation)) {
							resultObjects.push({
								Type : "AllianceDonation",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								Amount : randomRangeInt(10, 20),
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceAllianceChatMessage)) {
							resultObjects.push({
								Type : "Attack",
								PlayerId : player.PlayerId,
								AllianceId : alliance.AllianceId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

					}

					currentSessionLength += timeStep;
				}

				// session started:
				if (RollChance(chanceStartSession)) {
					sessionStarted = true;
				}

				// player quit, +30 days to counter
				if (!sessionStarted && RollChance(chanceQuit)) {
					resultObjects.push({
						Type : "EvaluationEvent",
						AllianceId : alliance.AllianceId,
						PlayerId : player.PlayerId,
						Action : "Quit",
						PlayerLevel : player.Level,
						AllianceLevel : alliance.Level,
						JoinTime : moment(startTime).format(timeFormat),
						TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
					});

					break;
				}

				// player leave alliance
				if (sessionStarted && RollChance(chanceLeave)) {
					resultObjects.push({
						Type : "EvaluationEvent",
						AllianceId : alliance.AllianceId,
						PlayerId : player.PlayerId,
						Action : "Leave",
						PlayerLevel : player.Level,
						AllianceLevel : alliance.Level,
						JoinTime : moment(startTime).format(timeFormat),
						TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
					});

					resultObjects.push({
						Type : "AllianceMemberEvent",
						Action : "Leave",
						AllianceId : alliance.AllianceId,
						PlayerId : player.PlayerId,
						TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
					});

					break;
				}

				counter += timeStep;
			}

			// player enjoyed alliance for long time
			if (counter >= counterLimit) {				
				resultObjects.push({
					Type : "EvaluationEvent",
					AllianceId : alliance.AllianceId,
					PlayerId : player.PlayerId,
					Action : "LongEnough",
					PlayerLevel : player.Level,
					AllianceLevel : alliance.Level,
					JoinTime : moment(startTime).format(timeFormat),
					TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
				});
			}

		});

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();
	} else if (id == "rawPlayerData") {

		iterate(players, function(player) {
			resultObjects.push(player.PlayerId + ' ' + player.Level + ' ' + player.Name);
		});

		req.entrySeperator = '\n';
		req.useJsonFormat = false;

		req.resultObjects = resultObjects;
		next();
	} else if (id == "crunchedSpeedupAverage") {
		resultObjects.push([
			0.9, 0.5, 0.2, 0.11, 0.04
		]);

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();
	} else if (id == "crunchedSpeedupTotal") {
		resultObjects.push([
			0.9, 0.5, 0.2, 0.11, 0.04
		]);

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();

	} else if (id == "crunchedChurnReason") {
		resultObjects.push([
			100, 100, 100, 100, 100, 100
		]);

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();

	} else if (id == "allianceSuggestionMatrix") {


		var httpOptions = {
			url: 'http://cosmos.lab.fi-ware.org:14000/webhdfs/v1/user/cuong.le/out?op=open&user.name=cuong.le',
			headers: {
				'X-Auth-Token' : 'lCKVBFpuz3GffLV9YTwh8kfSllOiCr'
			}
		};

		request(httpOptions, function callback(error, response, body) {
			if (!error) {
				
				var entries = body.trim().split('\n');

				var measuredLevels = ['Low', 'Mid', 'High'];

				var data = [];

				for(var i=0; i<9; i++) {
					var datum = [];
					for (var j=0; j<9; j++) {
						datum.push(0);
					}
					data.push(datum);
				}

				for(var i=0; i<entries.length; i++) {
					var row = entries[i].split(/ |\t/);

					var pLevel = getContainedIndexOf(row[0], measuredLevels);
					var pSocial = getContainedIndexOf(row[1], measuredLevels);
					var aLevel = getContainedIndexOf(row[2], measuredLevels);
					var aSocial = getContainedIndexOf(row[3], measuredLevels);

					data[pLevel * 3 + pSocial][aLevel*3 + aSocial] = row[4];
				}

				var result = [];
				result.push(data);


				req.resultObjects = result;
				req.useJsonFormat = true;
				
				next();
			} else {
				next();
			}
		});

/*

		var data = [];
		for (var i=0; i<9; i++) {
			var datum = [];
			for (var j=0; j<9; j++) {;
				datum.push(randomRangeInt(0, 10));
			};
			data.push(datum);
		}

		resultObjects.push(data);

		req.useJsonFormat = true;


		req.resultObjects = resultObjects;
		next();

		/**/

	} else if (id == "allianceSuggestionList") {
		var data = [];
		for (var i=0; i<10; i++) {
			var alliance = alliances[randomRangeInt(0, alliances.length-1)];
			alliance.Social = randomRangeInt(0, 100);

			data.push(alliance);
		}

		resultObjects.push(data);

		req.useJsonFormat = true;

		req.resultObjects = resultObjects;
		next();
	}

	
};


exports.clearEntries = function(req,res) {
	console.log("inside clear entries");

	var message = '';

	Speedup.remove({}, function(err, speedup) {
		if (err) {
			return res.json(err);
		}
	});

	return res.send("end of clearing");
};

function randomRangeFloat(min, max) {
	return Math.random() * (max - min) + min;
}

// min inclusive, max inclusive
function randomRangeInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// create random "lookalike" GUID, not reliable
function createGUID() {
	return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

function RollChance(chance) {
	return (Math.random() < chance);
}

function iterate(collection, job) {
	for (var i=0; i<collection.length; i++) {
		job(collection[i]);
	}
}

function generatePlayers(amount) {
	var players = [];

	for (var i=0; i<amount; i++) {
		players.push({
			PlayerId : createGUID(),
			Level : randomRangeInt(1,10),
			Name : "Player_" + i
		});
	}

	return players;
}

function generateAlliances(amount) {
	var alliances = [];

	for (var i=0; i<amount; i++) {
		alliances.push({
			AllianceId : createGUID(),
			Level : randomRangeInt(1,10),
			Name : "Alliance_" + i
		});
	}

	return alliances;
}

function getContainedIndexOf(str, strArray) {
	for (var i=0; i<strArray.length; i++) {
		if (str.indexOf(strArray[i]) > -1) {
			return i;
		}
	}

	return -1;
}