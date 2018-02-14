/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @author : Florian Vidal <florianvidals@gmail.com>
 * @version : 0.1.0
 */

// import the specific package
const Crawler = require('crawler');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Import custom modules
var parserModule = require('./parser');
var mapReduceModule = require('./mapReduceModule');

// Database variables
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'mongodbSpellsFinder';		// Database Name
const collecName = 'spells';				// Collection name

// Function that get the page and return Cheerio to crawl the HTML body
var crawlerPage = function(url) {
    console.log('URl : ' + url);
	var crawler = new Crawler({
		maxConnections: 1, // `maxConnections` will be forced to 1
		// This will be called for each crawled page
		callback : function (error, res, done) {
			if(error) {
				console.log(error);
			} else {
				var $ = res.$;

				// Parser
				var spellTitle = $('div.heading').find('p').text();

                var infoSchoolLevel = $($('div.SpellDiv').children()[1]).text();
                var school = parserModule.splitSchool(infoSchoolLevel.substring(7,infoSchoolLevel.indexOf(";")));
                var level = parserModule.splitLevel(infoSchoolLevel.substring(infoSchoolLevel.indexOf(";")+8, infoSchoolLevel.length));

                var castingTime = $($('div.SpellDiv').children()[3]).text().substring(13);
                var components = parserModule.splitComponent($($('div.SpellDiv').children()[4]).text().substring(11));

                var range = parserModule.splitRange($($('div.SpellDiv').children()[6]).text().substring(6));
                var effects = $($('div.SpellDiv').children()[7]).text().substring(7);
                var duration = $($('div.SpellDiv').children()[8]).text().substring(9);

                var infoSavingResistance = $($('div.SpellDiv').children()[9]).text();
                var savingThrow = infoSavingResistance.substring(13, infoSavingResistance.indexOf(";"));
                var spellResistance = infoSavingResistance.substring(infoSavingResistance.indexOf(";")+19, infoSavingResistance.length);

                var description = $($('div.SpellDiv').children()[11]).text();

				/*
				console.log(spellTitle)
				console.log(school);
				console.log(level);
				console.log(components);
				console.log(range);
				console.log("SpellResistance :" + spellResistance);*/
				
				/*
                console.log("Level            : " + level);
                console.log("Casting Time     : " + castingTime);
                console.log("Components       : " + components);
                console.log("Range            : " + range);
                console.log("Effects          : " + effects);
                console.log("Duration         : " + duration);
                console.log("Saving Throw     : " + savingThrow);
                console.log("Spell Resistance : " + spellResistance);
                console.log("Description      : " + description);*/
				
				var currentSpell = parserModule.JSONConcat({name: spellTitle}, [school, level, components, range, {SpellResistance: spellResistance}])
				//console.log(currentSpell);
				
				// Use connect method to connect to the server
				MongoClient.connect(dbUrl, function(err, db) {
					assert.equal(null, err);
					console.log("Connected successfully to bdd");

					// Create a database
					var spellsFinderDb = db.db(dbName);
					/*
					spellsFinderDb.listCollections().toArray(function(err, collections){
						//collections = [{"name": "coll1"}, {"name": "coll2"}]
						collections.forEach(function(elem) {
							if (collecName === elem.name) {
								spellsFinderDb.collection(collecName).drop();
							}
						});	
					});*/

					// Create a test collection
					spellsFinderDb.createCollection(collecName, function(err, res) {
						if (err) throw err;
						console.log("Collection created!");
					});
					
					// Remove all the documents
					spellsFinderDb.collection(collecName).removeMany();

					// Insert the current value in the database
					spellsFinderDb.collection(collecName).insertOne(currentSpell, function(err, res) {
						if (err) throw err;
						console.log("1 document inserted");
					});
					
					spellsFinderDb.collection(collecName).findOne({}, function(err, result) {
						if (err) throw err;
						console.log(result);
					});
					
					mapReduceModule.findSpells(0, 1, spellsFinderDb, function end() {
						console.log("End");
						db.close;
					});
					
				});

				// $ is Cheerio by default
				//a lean implementation of core jQuery designed specifically for the server
				//console.log($('body').find('script').eq(7).text());

				//console.log(infos.children());
				//console.log($('.article-content').find('p').text());

				//console.log($('.article_center').find('p'));
				//console.log($('.article-content').find('p').length);
				//fs.writeFileSync("monFichier", $('body').find('script').eq(7).text(), "UTF-8");
				//console.log($("table").text());
				//socket.emit('response', res.body);
				//console.log($("title").text());
			}
			done();
		}
	});
	crawler.queue(url);
}

// Export module functions
exports.crawlerPage = crawlerPage;