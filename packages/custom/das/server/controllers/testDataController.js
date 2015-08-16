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
	for (var i=0; i<req.resultObjects.length; i++) {
		result += JSON.stringify(req.resultObjects[i]) + ',' + '\n';
	}

	return res.send(result);
};



// create of type
exports.createEntriesOfType = function(req,res,next,id) {
	console.log("inside create Entries");

	var resultObjects = [];

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

	} else if (id == "rawAllianceSuggestionData") {

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

		iterate(players, function(player) {
			var alliance = randomRangeInt(0, alliances.length);
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
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceEventParticipation)) {
							resultObjects.push({
								Type : "EventParticipation",
								PlayerId : player.PlayerId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceChatMessage)) {
							resultObjects.push({
								Type : "ChatMessage",
								PlayerId : player.PlayerId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceRaidParticipation)) {
							resultObjects.push({
								Type : "RaidParticipation",
								PlayerId : player.PlayerId,
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceAllianceDonation)) {
							resultObjects.push({
								Type : "AllianceDonation",
								PlayerId : player.PlayerId,
								Amount : randomRangeInt(10, 20),
								TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
							});
						}

						if (RollChance(chanceAllianceChatMessage)) {
							resultObjects.push({
								Type : "Attack",
								PlayerId : player.PlayerId,
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
						Action : "Quit",
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
					TimeStamp : moment(startTime).add(counter, 's').format(timeFormat)
				});
			}

		});
	}

	req.resultObjects = resultObjects;
	next();
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
			Name : "djfklasjfdl"
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
			Name : "djfklasjfdl"
		});
	}

	return alliances;
}